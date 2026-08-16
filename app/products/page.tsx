import type { Metadata } from "next";
import Link from "next/link";
import ProductImageSlot from "@/components/ProductImageSlot";
import { PRODUCT_FAMILIES, getFamilySlugForProduct } from "@/lib/product-families";
import { getProductList, type ProductPage } from "@/lib/admin/products";

export const metadata: Metadata = {
  title: "Custom Patch, Label & Accessory Products for B2B Buyers | KaKa Patches",
  description:
    "Factory-direct custom patches, labels, heat transfers, badges, textile accessories, sachets and cultural gifts. Visually choose a product family, compare construction, and request a quote.",
};

const MOQ_COPY = "MOQ: 200 pcs per design and construction for bulk production.";

// ── Static section content ────────────────────────────────────────────────────

const COMPARISON_COLUMNS = [
  {
    name: "Embroidered",
    construction: "Stitched thread on fabric",
    detail: "Good — bold, classic",
    texture: "Raised stitched",
    attachment: "Sew-on, iron-on, Velcro",
    applications: "Uniforms, caps, jackets",
    alternative: "Woven (finer detail)",
  },
  {
    name: "Woven",
    construction: "Fine woven thread",
    detail: "Excellent — fine text",
    texture: "Smooth flat",
    attachment: "Sew-on, iron-on, Velcro",
    applications: "Labels, apparel tags",
    alternative: "Printed (full color)",
  },
  {
    name: "PVC",
    construction: "Molded rubber",
    detail: "Moderate — bold 3D",
    texture: "Rubber 3D relief",
    attachment: "Sew-on, adhesive",
    applications: "Outdoor, tactical",
    alternative: "Chenille (soft feel)",
  },
  {
    name: "Chenille",
    construction: "Fuzzy yarn pile",
    detail: "Moderate — soft",
    texture: "Soft fuzzy",
    attachment: "Sew-on",
    applications: "Varsity, fashion",
    alternative: "Embroidered (crisper)",
  },
  {
    name: "Printed",
    construction: "Full-color print",
    detail: "Excellent — photos",
    texture: "Flat printed",
    attachment: "Iron-on, sew-on",
    applications: "Promo, complex art",
    alternative: "Woven (durable)",
  },
];

const APPLICATIONS = [
  { key: "apparel-uniforms", title: "Apparel & Uniforms", desc: "Brand identity for workwear, clubs and team uniforms." },
  { key: "hats-headwear", title: "Hats & Headwear", desc: "Cap badges and headwear branding that holds its shape." },
  { key: "bags-accessories", title: "Bags & Accessories", desc: "Patch branding for bags, backpacks and accessories." },
  { key: "events-merchandise", title: "Events & Merchandise", desc: "Giveaways and merch for events, launches and teams." },
  { key: "cultural-gifts", title: "Cultural Gifts", desc: "Omamori pouches, sachets and cultural keepsakes." },
  { key: "promotional-products", title: "Promotional Products", desc: "Badges, magnets and branded giveaways for campaigns." },
];

const PROCESS_STEPS = [
  { title: "Upload Artwork", desc: "Send your logo or design file and tell us your requirements." },
  { title: "Design Review", desc: "Our team checks artwork and confirms construction and specs." },
  { title: "Digital Proof", desc: "You approve a digital proof before anything is produced." },
  { title: "Sampling", desc: "Optional physical sample for final color and feel approval." },
  { title: "Bulk Production", desc: "Factory-direct production begins at your approved MOQ." },
  { title: "QC & Packing", desc: "Inspection, trimming and packing to your specification." },
  { title: "Delivery", desc: "Worldwide shipping with tracking and documentation." },
];

const QC_ITEMS = [
  { key: "material-inspection", title: "Material Inspection", desc: "Incoming fabric, thread and backing checked on arrival." },
  { key: "in-process-inspection", title: "In-Process Inspection", desc: "Stitch density and alignment verified during production." },
  { key: "final-qc", title: "Final QC", desc: "Every batch inspected for trim, backing and finish." },
  { key: "sample-report-preview", title: "Documentation Support", desc: "Inspection reports and compliance documents on request." },
];

const FACTORY_ITEMS = [
  { key: "artwork-review", title: "Artwork Review", desc: "Digitized artwork and thread-color matching." },
  { key: "production-machine", title: "Production Machines", desc: "Multi-head embroidery and specialty equipment." },
  { key: "material-management", title: "Material & Thread", desc: "Organized thread and backing stock control." },
  { key: "production-line", title: "Production Line", desc: "Structured lines for consistent batch output." },
  { key: "quality-inspection", title: "Quality Inspection", desc: "Human inspection at every stage." },
  { key: "packing-line", title: "Packing Line", desc: "Count, fold and package to spec." },
  { key: "warehouse-shipment", title: "Warehouse & Shipment", desc: "Consolidation and worldwide dispatch." },
];

const GUIDES = [
  { href: "/resources/embroidered-vs-woven-patches", title: "Embroidered vs Woven Patches" },
  { href: "/resources/how-to-choose-patch-size", title: "How to Choose Patch Size" },
  { href: "/resources/best-backing-for-custom-patches", title: "Best Backing for Custom Patches" },
  { href: "/blog", title: "Custom Patches Buying Guides" },
];

const ArrowIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

function productHref(p: ProductPage) {
  return `${p.urlPrefix}/${p.slug}`;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ProductsPage() {
  const all = await getProductList();
  const published = all.filter((p) => p.status === "published");

  const families = PRODUCT_FAMILIES.map((family) => ({
    family,
    products: published.filter((p) => getFamilySlugForProduct(p) === family.slug),
  }));

  return (
    <main className="bg-white text-slate-900">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">Products</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl md:leading-[1.1]">
              Custom Patches, Labels, <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Badges &amp; Textile Accessories</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Choose a product family, compare construction and detail capability, review applications, and request a factory-direct quote.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500">
                Request a Quote <ArrowIcon />
              </Link>
              <Link href="/request-a-quote?tab=upload" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                Upload Artwork
              </Link>
            </div>
            <p className="mt-6 text-sm font-medium text-slate-400">{MOQ_COPY}</p>
            <p className="mt-1 text-sm text-slate-500">Sample support available on request before bulk production.</p>
          </div>
          <div className="flex items-center">
            <ProductImageSlot
              title="Products Hero Banner"
              slotPath="/images/products/products-hero.webp"
              ratio="16:9"
              recommendedSize="1920 × 1080 px"
              alt="KaKa Patches product range"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* 2. Product-family selector */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Product Families</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Choose Your Product Family</h2>
            <p className="mt-4 text-slate-500">Four factory-direct families — each with its own construction, finish and application range.</p>
          </div>

          <div className="mt-14 space-y-16">
            {families.map(({ family, products }) => (
              <div key={family.slug} id={family.slug} className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
                  <ProductImageSlot
                    title={family.name}
                    slotPath={family.heroImageSlot}
                    ratio="16:9"
                    recommendedSize="1920 × 1080 px"
                    alt={family.name}
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{family.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight">{family.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{family.description}</p>
                    <Link href={`/product-families/${family.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                      View {family.shortName} family <ArrowIcon />
                    </Link>
                  </div>
                </div>

                {products.length > 0 && (
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => (
                      <Link
                        key={p.slug}
                        href={productHref(p)}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                      >
                        <ProductImageSlot
                          title={p.displayName || p.name}
                          slotPath={`/images/products/${p.slug}/hero-main.webp`}
                          ratio="4:3"
                          recommendedSize="1200 × 900 px"
                          alt={p.displayName || p.name}
                        />
                        <div className="flex flex-1 flex-col p-4">
                          <h4 className="text-base font-bold text-slate-900">{p.displayName || p.name}</h4>
                          <p className="mt-1.5 flex-1 text-sm leading-6 text-slate-600">
                            {p.buyerSummary || p.heroSubtitle?.replace(/<[^>]*>/g, "") || "Factory-direct custom production with flexible customization."}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5">
                            View Product <ArrowIcon />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Visual product comparison */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Product Comparison</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Compare Construction & Detail Capability</h2>
            <p className="mt-4 text-slate-500">Construction, texture, attachment and recommended alternative — pick the finish that fits your application.</p>
          </div>
          <div className="mt-12 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Construction</th>
                  <th className="px-5 py-4 font-semibold">Detail capability</th>
                  <th className="px-5 py-4 font-semibold">Texture</th>
                  <th className="px-5 py-4 font-semibold">Attachment</th>
                  <th className="px-5 py-4 font-semibold">Typical applications</th>
                  <th className="px-5 py-4 font-semibold">Recommended alternative</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_COLUMNS.map((r, i) => (
                  <tr key={r.name} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}>
                    <td className="px-5 py-4 font-bold text-slate-800">{r.name}</td>
                    <td className="px-5 py-4 text-slate-600">{r.construction}</td>
                    <td className="px-5 py-4 text-slate-600">{r.detail}</td>
                    <td className="px-5 py-4 text-slate-600">{r.texture}</td>
                    <td className="px-5 py-4 text-slate-600">{r.attachment}</td>
                    <td className="px-5 py-4 text-slate-600">{r.applications}</td>
                    <td className="px-5 py-4 text-slate-600">{r.alternative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Application gallery */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Applications</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Where Your Products Get Used</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {APPLICATIONS.map((a) => (
              <div key={a.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <ProductImageSlot
                  title={a.title}
                  slotPath={`/images/applications/${a.key}.webp`}
                  ratio="16:9"
                  recommendedSize="1600 × 900 px"
                  alt={a.title}
                />
                <div className="p-4">
                  <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. From Artwork to Delivery */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">How It Works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">From Artwork to Delivery</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quality Control & Documentation */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Quality</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Quality Control & Documentation Support</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {QC_ITEMS.map((q) => (
              <div key={q.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <ProductImageSlot
                  title={q.title}
                  slotPath={`/images/quality/${q.key}.webp`}
                  ratio="4:3"
                  recommendedSize="1200 × 900 px"
                  alt={q.title}
                />
                <div className="p-4">
                  <h3 className="text-base font-bold text-slate-900">{q.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{q.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Real Production, Real Quality Control */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Inside the Factory</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Real Production, Real Quality Control</h2>
            <p className="mt-4 text-slate-400">From artwork review to packed shipment — every stage of your order is handled under one roof.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FACTORY_ITEMS.map((f) => (
              <div key={f.key} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <ProductImageSlot
                  title={f.title}
                  slotPath={`/images/factory/${f.key}.webp`}
                  ratio="4:3"
                  recommendedSize="1200 × 900 px"
                  alt={f.title}
                />
                <div className="p-4">
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Related guides + final CTA */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Not Sure Which Product Is Right?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Upload your artwork and tell us your requirements. Our team will help you select the best product type and prepare a factory-direct quote.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-blue-700 shadow-xl transition hover:bg-blue-50">
              Request a Quote <ArrowIcon />
            </Link>
          </div>
          <div className="mt-10 border-t border-white/20 pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Related Guides</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {GUIDES.map((g) => (
                <Link key={g.href} href={g.href} className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-blue-100 transition hover:bg-white/10">
                  {g.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
