import { verifyAdminSession } from "@/lib/admin/auth";
import { getAllQuoteRequests, type QuoteFilters } from "@/lib/admin/quote-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    const filters: QuoteFilters = {};

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const patchType = searchParams.get("patchType");
    const emailSent = searchParams.get("emailSent");
    const artworkUploaded = searchParams.get("artworkUploaded");
    const sort = searchParams.get("sort");

    if (search) filters.search = search;
    if (status) filters.status = status;
    if (patchType) filters.patchType = patchType;
    if (emailSent) filters.emailSent = emailSent;
    if (artworkUploaded) filters.artworkUploaded = artworkUploaded;
    if (sort) filters.sort = sort;

    const quotes = await getAllQuoteRequests(filters);

    return Response.json({ quotes });
  } catch (error) {
    console.error("Admin quotes error:", error);
    return Response.json({ error: "Failed to load quotes." }, { status: 500 });
  }
}
