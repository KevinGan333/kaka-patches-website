import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getProductBySlug, getFallbackProduct } from "@/lib/admin/products";
import ProductPageRenderer from "@/components/ProductPageRenderer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let product = await getProductBySlug(slug);
  if (!product) product = await getFallbackProduct(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.metaTitle,
    description: product.metaDescription,
    openGraph: {
      title: product.ogTitle || product.seoTitle || product.metaTitle,
      description: product.ogDescription || product.metaDescription,
      ...(product.ogImage ? { images: [{ url: product.ogImage }] } : {}),
    },
    alternates: { canonical: `${product.urlPrefix}/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = await getProductBySlug(slug);
  if (!product) product = await getFallbackProduct(slug);
  // A CMS record always serves its owner-managed content — status controls
  // admin visibility and sitemap inclusion, not public access.
  // If neither CMS nor fallback exists, return 404.
  if (!product) notFound();
  // One canonical URL per product: /products/[slug] only serves records whose
  // urlPrefix is /products. Cross-prefix requests permanently redirect so the
  // same page is never duplicated under two routes.
  if (product.urlPrefix !== "/products") {
    permanentRedirect(`${product.urlPrefix}/${product.slug}`);
  }
  return <ProductPageRenderer product={product} />;
}
