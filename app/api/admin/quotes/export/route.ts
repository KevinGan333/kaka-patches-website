import { verifyAdminSession } from "@/lib/admin/auth";
import { getAllQuotes } from "@/lib/admin/quotes";

export const runtime = "nodejs";

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return "";
  return `"${String(val).replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const quotes = await getAllQuotes();
    const header = "ID,Date,Status,StatusUpdated,Name,Email,Company,PatchType,PatchSize,Backing,Border,Quantity,Delivery,Message,ArtworkFile,ArtworkPath,EmailSent,EmailError,Notes";
    const rows = quotes.map(q => [
      csvEscape(q.id), csvEscape(q.submittedAt), csvEscape(q.status), csvEscape(q.statusUpdatedAt),
      csvEscape(q.customer?.name), csvEscape(q.customer?.email), csvEscape(q.customer?.company),
      csvEscape(q.requirements?.patchType), csvEscape(q.requirements?.patchSize),
      csvEscape(q.requirements?.backing), csvEscape(q.requirements?.border),
      csvEscape(q.requirements?.quantity), csvEscape(q.requirements?.delivery),
      csvEscape(q.requirements?.message),
      csvEscape(q.artwork?.originalFileName), csvEscape(q.artwork?.savedFilePath),
      csvEscape(q.email?.sent ? "Yes" : q.email?.error ? "Failed" : "No"),
      csvEscape(q.email?.error),
      csvEscape((q.notes || []).map((n: any) => `[${n.createdAt}] ${n.content}`).join(" | ")),
    ].join(","));

    const csv = [header, ...rows].join("\n");
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
