import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageSlot from "@/components/ProductImageSlot";
import { BreadcrumbListSchema } from "@/components/JsonLd";
import { getFamilyBySlug, getFamilyForProduct } from "@/lib/product-families";
import { getProductList } from "@/lib/admin/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const family = getFamilyBySlug(slug);
  if (!family) return {};
  return {
    title: family.metaTitle,
    description: family.metaDescription,
    alternates: { canonical: `/product-families/${family.slug}` },
  };
}

export default async function ProductFamilyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const family = getFamilyBySlug(slug);
  if (!family) notFound();

  const allProducts = await getProductList();
  const products = allProducts
    .filter((p) => p.status === "published" && getFamilyForProduct(p)?.slug === family.slug)
    .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.2),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">{family.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-[1.1]">
            {family.h1} <span className="text-blue-400">{family.h1Accent}</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{family.description}</p>
          <div className="mt-10">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500">
              Request a Quote
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{family.name}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Products in This Family</h2>
          </div>

          {products.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  href={`${product.urlPrefix}/${product.slug}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <ProductImageSlot title={product.displayName || product.name} slotPath={`/images/products/${product.slug}/hero-main.webp`} ratio="4:3" alt={product.displayName || product.name} />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700">{product.displayName || product.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.heroSubtitle}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition group-hover:gap-2.5">
                      View Details
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-slate-500">Products in this family are coming soon.</p>
          )}
        </div>
      </section>

      <BreadcrumbListSchema items={[{ name: "Home", href: "/" }, { name: "Product Families", href: "/product-families" }, { name: family.name, href: `/product-families/${family.slug}` }]} />
    </main>
  );
}
