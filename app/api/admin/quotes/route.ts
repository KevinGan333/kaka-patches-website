import { verifyAdminSession } from "@/lib/admin/auth";
import { getAllQuotes } from "@/lib/admin/quotes";

export const runtime = "nodejs";

export async function GET() {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const quotes = await getAllQuotes();
    return Response.json({ quotes });
  } catch (error) {
    console.error("Admin quotes error:", error);
    return Response.json({ error: "Failed to load quotes." }, { status: 500 });
  }
}
