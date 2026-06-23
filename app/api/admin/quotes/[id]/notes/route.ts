import { verifyAdminSession } from "@/lib/admin/auth";
import { addQuoteNote } from "@/lib/admin/quote-db";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { content } = await request.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return Response.json({ error: "Content is required." }, { status: 400 });
    }

    const quote = await addQuoteNote(id, content.trim());

    if (!quote) {
      return Response.json({ error: "Quote not found." }, { status: 404 });
    }

    return Response.json({ success: true, quote });
  } catch (error) {
    console.error("Note add error:", error);
    return Response.json({ error: "Failed to add note." }, { status: 500 });
  }
}
