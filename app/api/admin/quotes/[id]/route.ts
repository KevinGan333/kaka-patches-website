import { verifyAdminSession } from "@/lib/admin/auth";
import { getQuoteById, updateQuote } from "@/lib/admin/quotes";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const quote = await getQuoteById(id);
  if (!quote) return Response.json({ error: "Quote not found." }, { status: 404 });
  return Response.json({ quote });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const updates = await request.json();
    const quote = await updateQuote(id, updates);
    if (!quote) return Response.json({ error: "Quote not found." }, { status: 404 });
    return Response.json({ success: true, quote });
  } catch { return Response.json({ error: "Update failed." }, { status: 500 }); }
}
