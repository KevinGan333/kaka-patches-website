import { verifyAdminSession } from "@/lib/admin/auth";
import {
  getProductList,
  createProduct,
  generateProductSlug,
  validateProduct,
  checkDuplicateProductSlug,
  type ProductPage,
} from "@/lib/admin/products";

export const runtime = "nodejs";

export async function GET() {
  if (!(await verifyAdminSession()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const items = await getProductList();
  return Response.json({ items });
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();

    if (!data.slug) data.slug = generateProductSlug(data.name || "");

    const errors = validateProduct(data);
    if (errors.length > 0)
      return Response.json({ error: errors.join(" ") }, { status: 400 });

    const dup = await checkDuplicateProductSlug(data.slug);
    if (dup)
      return Response.json(
        { error: "A product page with this slug already exists." },
        { status: 409 }
      );

    const now = new Date().toISOString();
    const item: ProductPage = {
      type: "product",
      name: data.name,
      slug: data.slug,
      group: data.group || "accessories",
      urlPrefix: data.urlPrefix || "/custom-accessories",
      status: data.status || "draft",
      displayOrder: data.displayOrder ?? 99,
      availableForQuote: data.availableForQuote ?? true,
      quoteFormKey: data.quoteFormKey || data.name || "",
      metaTitle: data.metaTitle || data.name || "",
      metaDescription: data.metaDescription || "",
      ogTitle: data.ogTitle || data.metaTitle || data.name || "",
      ogDescription: data.ogDescription || data.metaDescription || "",
      ogImage: data.ogImage || "",
      heroBadge: data.heroBadge || "",
      h1: data.h1 || data.name || "",
      heroSubtitle: data.heroSubtitle || "",
      heroHighlights: data.heroHighlights || [],
      overviewParagraphs: data.overviewParagraphs || [],
      buyerTypes: data.buyerTypes || [],
      applications: data.applications || [],
      features: data.features || [],
      customOptionsTitle: data.customOptionsTitle || "Custom Options",
      customOptions: data.customOptions || [],
      typeOptionsTitle: data.typeOptionsTitle || "",
      typeOptions: data.typeOptions || [],
      faqs: data.faqs || [],
      ctaHeading: data.ctaHeading || "Need Custom Products?",
      relatedProductSlugs: data.relatedProductSlugs || [],
      moqDisclaimer: data.moqDisclaimer || "",
      packagingDelivery: data.packagingDelivery || "",
      images: data.images || [],
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === "published" ? now : null,
    };

    const created = await createProduct(item);
    return Response.json({ success: true, item: created });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Failed to create product:", message);
    return Response.json(
      { error: "Failed to create product page." },
      { status: 500 }
    );
  }
}
