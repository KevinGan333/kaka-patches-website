import { verifyAdminSession } from "@/lib/admin/auth";
import { getContentBySlug, updateContent, archiveContent } from "@/lib/admin/content";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const item = await getContentBySlug("blog", slug);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ item });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const updates = await request.json();
  const updated = await updateContent("blog", slug, updates);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true, item: updated });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const archived = await archiveContent("blog", slug);
  if (!archived) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true, item: archived });
}
