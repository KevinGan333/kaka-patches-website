import { verifyAdminSession } from "@/lib/admin/auth";
import { getQuoteRequestById } from "@/lib/admin/quote-db";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const quote = await getQuoteRequestById(id);

  if (!quote) {
    return Response.json({ error: "Quote not found." }, { status: 404 });
  }

  return Response.json({ quote });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminSession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const updates = await request.json();
    const db = getDb();

    // Map JSON camelCase keys to snake_case DB columns
    const columnMap: Record<string, string> = {
      name: "name",
      email: "email",
      company: "company",
      quantity: "quantity",
      delivery: "delivery",
      patchType: "patch_type",
      patchSize: "patch_size",
      backing: "backing",
      border: "border_option",
      message: "message",
    };

    // Build dynamic query with parameterized values
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [jsonKey, colName] of Object.entries(columnMap)) {
      if (updates[jsonKey] !== undefined) {
        setClauses.push(`${colName} = $${paramIndex}`);
        values.push(updates[jsonKey]);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No valid fields to update." }, { status: 400 });
    }

    values.push(id); // last param is the WHERE id
    const query = `UPDATE quote_requests SET ${setClauses.join(", ")}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;

    const result = await db.unsafe(query, values) as any[];
    const quote = result[0] || null;

    if (!quote) {
      return Response.json({ error: "Quote not found." }, { status: 404 });
    }

    return Response.json({ success: true, quote });
  } catch (error) {
    console.error("Quote update error:", error);
    return Response.json({ error: "Update failed." }, { status: 500 });
  }
}
