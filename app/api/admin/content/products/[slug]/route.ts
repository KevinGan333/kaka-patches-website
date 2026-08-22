import { verifyAdminSession } from "@/lib/admin/auth";
import {
  getProductBySlug,
  updateProduct,
  archiveProduct,
  validateProduct,
  type ProductPage,
} from "@/lib/admin/products";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAdminSession()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const item = await getProductBySlug(slug);
  if (!item)
    return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ item });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAdminSession()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const data = await request.json();

    // Remove fields that shouldn't be directly overwritten
    delete data.type;
    delete data.slug;
    delete data.createdAt;

    const errors = validateProduct({ ...data, slug }); // slug from path is always valid
    if (errors.length > 0)
      return Response.json({ error: errors.join(" ") }, { status: 400 });

    const updated = await updateProduct(slug, data as Partial<ProductPage>);
    if (!updated)
      return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json({ success: true, item: updated });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Failed to update product:", message);
    return Response.json(
      { error: "Failed to update product page." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await verifyAdminSession()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const archived = await archiveProduct(slug);
    if (!archived)
      return Response.json({ error: "Not found" }, { status: 404 });

    return Response.json({ success: true, item: archived });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Failed to archive product:", message);
    return Response.json(
      { error: "Failed to archive product page." },
      { status: 500 }
    );
  }
}
