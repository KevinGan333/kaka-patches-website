import { verifyAdminSession } from "@/lib/admin/auth";
import { getContentList, createContent, generateSlug, validateContent, checkDuplicateSlug, type ContentItem } from "@/lib/admin/content";

export const runtime = "nodejs";

export async function GET() {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const items = await getContentList("resources");
  return Response.json({ items });
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await request.json();
    if (!data.slug) data.slug = generateSlug(data.title || "");
    const errors = validateContent(data);
    if (errors.length > 0) return Response.json({ error: errors.join(" ") }, { status: 400 });
    const dup = await checkDuplicateSlug("resources", data.slug);
    if (dup) return Response.json({ error: "A resource with this slug already exists." }, { status: 409 });
    const now = new Date().toISOString();
    const item: ContentItem = {
      type: "resources", title: data.title, slug: data.slug, excerpt: data.excerpt || "",
      status: data.status || "draft", category: data.category || "General", tags: data.tags || [],
      seoTitle: data.seoTitle || data.title, seoDescription: data.seoDescription || data.excerpt || "",
      coverImage: data.coverImage || "", content: data.content || "",
      createdAt: now, updatedAt: now, publishedAt: data.status === "published" ? now : null,
    };
    const created = await createContent("resources", item);
    return Response.json({ success: true, item: created });
  } catch (e) { return Response.json({ error: "Failed to create resource." }, { status: 500 }); }
}
