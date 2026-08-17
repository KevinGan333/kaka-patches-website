import { get } from "@vercel/blob";
import { verifyAdminSession } from "@/lib/admin/auth";
import { getQuoteRequestById } from "@/lib/admin/quote-db";
import {
  buildContentDisposition,
  isInlineRenderableContentType,
  resolveContentType,
} from "@/lib/admin/artwork";

export const runtime = "nodejs";

/**
 * Authenticated, private customer-artwork delivery.
 *
 * The quote is looked up by its database ID (the route path segment), never by a
 * client-supplied Blob URL/path. The raw private Blob URL is read from the stored
 * `artwork_url` column server-side and is never echoed back to the client.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Cryptographically validate the admin session (HMAC + expiry) — not just
  // cookie presence or middleware.
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const quote = await getQuoteRequestById(id);
  if (!quote) {
    return Response.json({ error: "Artwork not found." }, { status: 404 });
  }

  const artworkUrl = quote.artwork_url;
  if (!artworkUrl) {
    return Response.json({ error: "Artwork not found." }, { status: 404 });
  }

  const download = new URL(request.url).searchParams.get("download") === "1";

  let result;
  try {
    result = await get(artworkUrl, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    console.error(
      "[Artwork] Blob storage error:",
      error instanceof Error ? error.message : String(error)
    );
    return Response.json({ error: "Artwork storage error." }, { status: 502 });
  }

  if (!result || !result.stream) {
    return Response.json({ error: "Artwork not found." }, { status: 404 });
  }

  const contentType = resolveContentType(result.blob.contentType, quote.artwork_type);
  const inline = !download && isInlineRenderableContentType(contentType);
  const filename = quote.artwork_filename || "artwork";

  return new Response(result.stream, {
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
      "Content-Disposition": buildContentDisposition(filename, !inline),
    },
  });
}
