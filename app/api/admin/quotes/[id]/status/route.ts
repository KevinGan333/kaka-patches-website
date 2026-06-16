import { verifyAdminSession } from "@/lib/admin/auth";
import { updateQuoteStatus } from "@/lib/admin/quotes";

export const runtime = "nodejs";

const validStatuses = ["New", "Reviewed", "Quoted", "Waiting for Customer", "In Production", "Closed"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!status || !validStatuses.includes(status)) return Response.json({ error: "Invalid status" }, { status: 400 });
    const quote = await updateQuoteStatus(id, status);
    if (!quote) return Response.json({ error: "Quote not found" }, { status: 404 });
    return Response.json({ success: true, quote });
  } catch (e) {
    console.error("Status update error:", e);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}
