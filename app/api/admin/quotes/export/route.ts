import { verifyAdminSession } from "@/lib/admin/auth";
import { exportQuoteRequestsCsv } from "@/lib/admin/quote-db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const csv = await exportQuoteRequestsCsv();
    const date = new Date().toISOString().split("T")[0];

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=kaka-patches-quotes-${date}.csv`,
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return Response.json({ error: "Export failed." }, { status: 500 });
  }
}
