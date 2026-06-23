import { verifyAdminSession } from "@/lib/admin/auth";
import { updateQuoteStatus, type QuoteStatus } from "@/lib/admin/quote-db";

export const runtime = "nodejs";

const VALID_STATUSES: QuoteStatus[] = [
  "new",
  "reviewed",
  "quoted",
  "waiting_for_customer",
  "in_production",
  "closed",
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !VALID_STATUSES.includes(status)) {
      return Response.json(
        {
          error: "Invalid status.",
          allowedValues: VALID_STATUSES,
        },
        { status: 400 }
      );
    }

    const quote = await updateQuoteStatus(id, status);

    if (!quote) {
      return Response.json({ error: "Quote not found." }, { status: 404 });
    }

    return Response.json({ success: true, quote });
  } catch (error) {
    console.error("Status update error:", error);
    return Response.json({ error: "Update failed." }, { status: 500 });
  }
}
