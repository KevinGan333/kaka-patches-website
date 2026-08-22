import type { Metadata } from "next";
import Link from "next/link";
import ProductImageSlot from "@/components/ProductImageSlot";
import { PRODUCT_FAMILIES } from "@/lib/product-families";
import { BreadcrumbListSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Product Families — Custom Patches, Labels, Badges & Accessories | KaKa Patches",
  description:
    "Browse KaKa Patches product families: patches, labels and transfers, badges and magnets, textile accessories, and sachets and cultural gifts — all factory-direct for B2B buyers.",
};

export default function ProductFamiliesPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.2),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Product Families</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Custom Products for <span className="text-blue-400">B2B Buyers</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Four product families manufactured factory-direct — from patches and labels to badges, textile accessories and cultural gifts.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2">
          {PRODUCT_FAMILIES.map((family) => (
            <Link
              key={family.slug}
              href={`/product-families/${family.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <ProductImageSlot title={family.name} slotPath={family.heroImageSlot} ratio="16:9" alt={family.name} />
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700">{family.name}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{family.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition group-hover:gap-2.5">
                  Explore Family
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BreadcrumbListSchema items={[{ name: "Home", href: "/" }, { name: "Product Families", href: "/product-families" }]} />
    </main>
  );
}
