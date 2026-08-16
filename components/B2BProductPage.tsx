import Link from "next/link";
import { BreadcrumbListSchema, FAQSchema, ProductSchema } from "@/components/JsonLd";
import ProductImageSlot from "@/components/ProductImageSlot";
import ProductHeroGallery, { type HeroGalleryImage } from "@/components/ProductHeroGallery";
import { resolveImageSrc } from "@/lib/image-slots";
import { getFamilyForProduct } from "@/lib/product-families";
import { getProductList, type ProductPage } from "@/lib/admin/products";
import { getContentList } from "@/lib/admin/content";

// ─── Mandatory B2B copy (single source of truth) ──────────────────────────
const MOQ_TEXT = "MOQ: 200 pcs per design and construction for bulk production.";
const SAMPLE_TEXT = "Pre-production sample development available for custom projects.";
const COMPLIANCE_TEXT =
  "Test reports and compliance documentation can be supported according to selected materials, product construction and destination-market requirements.";

const TRUST_POINTS = [
  { label: "MOQ: 200 pcs per design", icon: "cube" },
  { label: "Sample development available", icon: "spark" },
  { label: "Artwork approval before production", icon: "check" },
  { label: "In-process and final QC", icon: "doc" },
];

const DEFAULT_CHIPS = ["Custom Size", "Custom Shape", "Material Options", "Packaging Options"];

const SAMPLE_TO_SHIPMENT_STEPS = [
  { title: "Submit Artwork or Idea", description: "Send your design file, sketch or concept through the quote form." },
  { title: "Confirm Product Construction and Quote", description: "We confirm the best construction and send a factory-direct quote." },
  { title: "Approve Digital Proof", description: "Review and approve a digital proof before production begins." },
  { title: "Pre-Production Sample, If Required", description: "Request a physical sample to verify material, construction and finish." },
  { title: "Bulk Production and Quality Inspection", description: "Production runs with in-process and final quality inspection." },
  { title: "Packing, Shipment and Tracking", description: "Order is packed, shipped and tracked according to confirmed terms." },
];

const FACTORY_SLOTS = [
  { title: "Artwork Review / Production Preparation", path: "/images/factory/artwork-review.webp" },
  { title: "Embroidery / Weaving Machine", path: "/images/factory/production-machine.webp" },
  { title: "Material and Thread Management", path: "/images/factory/material-management.webp" },
  { title: "Production Line", path: "/images/factory/production-line.webp" },
  { title: "Quality Inspection", path: "/images/factory/quality-inspection.webp" },
  { title: "Packaging Line", path: "/images/factory/packing-line.webp" },
  { title: "Warehouse / Shipment Preparation", path: "/images/factory/warehouse-shipment.webp" },
];

const QUALITY_SLOTS = [
  { title: "Material Inspection", path: "/images/quality/material-inspection.webp" },
  { title: "In-Process Inspection", path: "/images/quality/in-process-inspection.webp" },
  { title: "Final Quality Inspection", path: "/images/quality/final-qc.webp" },
  { title: "Sample Report Preview", path: "/images/quality/sample-report-preview.webp" },
  { title: "Packaging Inspection", path: "/images/quality/packing-inspection.webp" },
];

const DEFAULT_SHIPPING_STEPS = [
  { title: "Factory Quote and Proforma Invoice", description: "You receive a factory quote and proforma invoice (PI) with product details and confirmed terms." },
  { title: "Production Details Confirmed", description: "We confirm construction, quantity, packaging and any compliance-documentation requirements." },
  { title: "Payment Terms Confirmed on PI", description: "Payment terms are confirmed on the proforma invoice. No online checkout or public bank details." },
  { title: "Shipment, Tracking and Shipping Documents", description: "Shipment is arranged according to the confirmed order and payment terms, with tracking and shipping documents provided." },
];

function quoteUrl(product: ProductPage): string {
  const key = product.quoteLabel || product.quoteFormKey || product.name;
  return `/request-a-quote?product=${encodeURIComponent(key)}`;
}

function slotBase(slug: string) {
  return `/images/products/${slug}`;
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
    </div>
  );
}

export default async function B2BProductPage({ product }: { product: ProductPage }) {
  const family = getFamilyForProduct(product);
  const familySlug = family?.slug;
  const chips = product.customizationChips?.length ? product.customizationChips : DEFAULT_CHIPS;
  const buyerSummary = product.buyerSummary || product.heroSubtitle;
  const displayName = product.displayName || product.name;
  const isProduction = process.env.VERCEL_ENV === "production";

  // ── Hero gallery ──
  const assignedImages = (product.images || []).filter((i) => i.url);
  let galleryImages: HeroGalleryImage[] =
    assignedImages.length > 0
      ? assignedImages.map((img) => ({ src: img.url, slotPath: img.url, title: img.alt || product.name, alt: img.alt }))
      : [
          { slotPath: `${slotBase(product.slug)}/hero-main.webp`, title: "Hero Product Image" },
          { slotPath: `${slotBase(product.slug)}/hero-detail.webp`, title: "Detail View" },
          { slotPath: `${slotBase(product.slug)}/hero-application.webp`, title: "In Application" },
          { slotPath: `${slotBase(product.slug)}/gallery-front.webp`, title: "Front View" },
          { slotPath: `${slotBase(product.slug)}/gallery-back.webp`, title: "Back / Attachment" },
          { slotPath: `${slotBase(product.slug)}/gallery-closeup.webp`, title: "Close-Up Texture" },
        ].map((s) => ({ ...s, src: resolveImageSrc(s.slotPath), alt: `${displayName} — ${s.title}` }));

  // The client gallery serializes `slotPath` into the RSC payload; in Production
  // swap the internal asset path for an opaque key so no path leaks into the DOM.
  if (isProduction) {
    galleryImages = galleryImages.map((img, i) => ({ ...img, slotPath: `slot-${i + 1}` }));
  }

  // ── Decision guide (Section C) ──
  const dg = product.decisionGuide || {};
  const bestFor = dg.bestFor?.length ? dg.bestFor : product.buyerTypes;
  const notIdealFor = dg.notIdealFor || [];
  const decisionCardCount = (bestFor.length > 0 ? 1 : 0) + (notIdealFor.length > 0 ? 1 : 0) + 1;
  const decisionGridClass =
    decisionCardCount === 1
      ? "mx-auto max-w-xl"
      : decisionCardCount === 2
        ? "mx-auto max-w-6xl md:grid-cols-2"
        : "md:grid-cols-3";

  // ── Detail gallery (Section D) ──
  const detailGallery = product.detailGallery?.length
    ? product.detailGallery.map((d) => ({
        title: d.title,
        caption: d.caption,
        slotPath: d.imageSlot || `${slotBase(product.slug)}/gallery-closeup.webp`,
      }))
    : [
        { title: "Front View", caption: "Finished front face of the product.", slotPath: `${slotBase(product.slug)}/gallery-front.webp` },
        { title: "Back / Attachment", caption: "Backing, adhesive or attachment method.", slotPath: `${slotBase(product.slug)}/gallery-back.webp` },
        { title: "Close-Up Texture", caption: "Material, thread or surface detail.", slotPath: `${slotBase(product.slug)}/gallery-closeup.webp` },
        { title: "Edge / Finishing", caption: "Border, edge and finishing detail.", slotPath: `${slotBase(product.slug)}/gallery-finishing.webp` },
        { title: "Applied to End Use", caption: "Product applied to its intended use.", slotPath: `${slotBase(product.slug)}/hero-application.webp` },
        { title: "Packaging / Bulk", caption: "Packaging and bulk production presentation.", slotPath: `${slotBase(product.slug)}/gallery-packaging.webp` },
      ];

  // ── Customization explorer (Section E) ──
  const explorer =
    product.customizationExplorer?.length
      ? product.customizationExplorer.map((o, i) => ({
          name: o.name,
          description: o.description,
          bestFor: o.bestFor,
          slotPath: o.imageSlot || `${slotBase(product.slug)}/option-${String((i % 4) + 1).padStart(2, "0")}.webp`,
        }))
      : [
          ...product.typeOptions.map((t, i) => ({
            name: t.title,
            description: t.description,
            bestFor: undefined as string | undefined,
            slotPath: `${slotBase(product.slug)}/option-${String((i % 4) + 1).padStart(2, "0")}.webp`,
          })),
          ...product.customOptions.slice(0, 3).map((o, i) => ({
            name: o,
            description: "",
            bestFor: undefined as string | undefined,
            slotPath: `${slotBase(product.slug)}/option-${String((i % 4) + 1).padStart(2, "0")}.webp`,
          })),
        ];

  // ── Specification table (Section F) ──
  const specs: { label: string; value: string }[] = [
    { label: "Product", value: displayName },
    ...(product.specifications || []),
    ...(product.typeOptions.length > 0
      ? [{ label: "Available options", value: product.typeOptions.map((t) => t.title).join(", ") }]
      : []),
    { label: "Bulk MOQ", value: MOQ_TEXT },
    { label: "Sample support", value: SAMPLE_TEXT },
    { label: "Artwork support", value: "Artwork review before production" },
    { label: "Documentation support", value: "Test-report and compliance-documentation request support" },
  ];

  // ── Application gallery (Section G) ──
  const applicationGallery = product.applicationGallery?.length
    ? product.applicationGallery.map((a, i) => ({
        title: a.title,
        description: a.description,
        href: a.href || quoteUrl(product),
        slotPath: a.imageSlot || `${slotBase(product.slug)}/application-${String((i % 3) + 1).padStart(2, "0")}.webp`,
      }))
    : product.applications.map((a, i) => ({
        title: a,
        description: `Custom ${displayName.toLowerCase()} for ${a.toLowerCase()}.`,
        href: quoteUrl(product),
        slotPath: `${slotBase(product.slug)}/application-${String((i % 3) + 1).padStart(2, "0")}.webp`,
      }));

  // ── Related products + blogs (Section M) ──
  const allProducts = await getProductList();
  let relatedProducts = (product.relatedProductSlugs || [])
    .map((slug) => allProducts.find((p) => p.slug === slug && p.status === "published"))
    .filter(Boolean) as ProductPage[];
  if (relatedProducts.length === 0 && familySlug) {
    relatedProducts = allProducts
      .filter((p) => p.slug !== product.slug && p.status === "published" && getFamilyForProduct(p)?.slug === familySlug)
      .slice(0, 3);
  }

  const blogs = await getContentList("blog");
  const relatedBlogs = (product.relatedBlogSlugs || [])
    .map((slug) => blogs.find((b) => b.slug === slug && b.status === "published"))
    .filter((b) => b !== undefined)
    .slice(0, 3);

  const parentHref = "/products";
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: parentHref },
    ...(family ? [{ name: family.name, href: `/product-families/${family.slug}` }] : []),
    { name: displayName, href: `${product.urlPrefix}/${product.slug}` },
  ];

  return (
    <main className="bg-white text-slate-900">
      {/* ── A. Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-6 py-3.5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500">
            {breadcrumbItems.map((item, i) => (
              <li key={item.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300">/</span>}
                {i === breadcrumbItems.length - 1 ? (
                  <span className="text-slate-700" aria-current="page">{item.name}</span>
                ) : (
                  <Link href={item.href} className="transition hover:text-blue-600">{item.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ── B. Hero ── */}
      <section className="border-b border-slate-100 py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12 lg:items-start">
          {/* Left 55% — gallery */}
          <div className="min-w-0 lg:col-span-7">
            <ProductHeroGallery images={galleryImages} isProduction={isProduction} />
          </div>

          {/* Right 45% — info */}
          <div className="lg:col-span-5">
            {family && (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{family.name}</p>
            )}
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-4xl" dangerouslySetInnerHTML={{ __html: product.h1 }} />
            {buyerSummary && <p className="mt-5 text-base leading-7 text-slate-600">{buyerSummary}</p>}

            {/* Trust points */}
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {TRUST_POINTS.map((tp) => (
                <li key={tp.label} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700">
                  <svg className="h-4 w-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tp.label}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={quoteUrl(product)} className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500">
                Request a Quote <ArrowIcon />
              </Link>
              <Link href={quoteUrl(product)} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
                Upload Your Artwork
              </Link>
            </div>

            {/* Customization chips */}
            <div className="mt-7 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600">{chip}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── C. Is this the right product? ── */}
      {(bestFor.length > 0 || notIdealFor.length > 0) && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Buyer Decision Guide" title="Is This the Right Product for Your Project?" />
            <div className={`mt-12 grid gap-6 ${decisionGridClass}`}>
              {bestFor.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-7">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    Best for
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {bestFor.map((b) => <li key={b} className="flex gap-2"><span className="text-green-600">✓</span>{b}</li>)}
                  </ul>
                </div>
              )}
              {notIdealFor.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-7">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Not ideal for
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {notIdealFor.map((b) => <li key={b} className="flex gap-2"><span className="text-slate-400">—</span>{b}</li>)}
                  </ul>
                </div>
              )}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m0 8a9 9 0 11-9-9 9 9 0 019 9z" /></svg>
                  Consider Another Construction When
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li className="flex flex-col">
                    Fine text or intricate lines
                    <Link href="/products/custom-woven-patches" className="mt-0.5 font-semibold text-blue-600 hover:text-blue-700">Custom Woven Patches</Link>
                  </li>
                  <li className="flex flex-col">
                    Photographic detail or gradients
                    <span className="mt-0.5">
                      <Link href="/products/custom-printed-patches" className="font-semibold text-blue-600 hover:text-blue-700">Printed</Link> or <Link href="/products/custom-heat-transfer-patches" className="font-semibold text-blue-600 hover:text-blue-700">Heat Transfer</Link>
                    </span>
                  </li>
                  <li className="flex flex-col">
                    Waterproof rubber-like finish
                    <Link href="/products/custom-pvc-patches" className="mt-0.5 font-semibold text-blue-600 hover:text-blue-700">Custom PVC Patches</Link>
                  </li>
                  <li className="flex flex-col">
                    Raised fuzzy varsity appearance
                    <Link href="/products/custom-chenille-patches" className="mt-0.5 font-semibold text-blue-600 hover:text-blue-700">Custom Chenille Patches</Link>
                  </li>
                </ul>
              </div>
            </div>
            {dg.alternativeText && (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <p className="text-sm font-semibold text-blue-900">Need an alternative?</p>
                <p className="mt-1 text-sm leading-7 text-blue-800">{dg.alternativeText}</p>
                {dg.alternativeSlug && (
                  <Link href={`/products/${dg.alternativeSlug}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
                    View alternative product <ArrowIcon className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── D. Product detail gallery ── */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Production Details" title="Review Product Details Before Requesting a Quote" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {detailGallery.map((d) => (
              <figure key={d.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <ProductImageSlot title={d.title} slotPath={d.slotPath} ratio="4:3" alt={`${product.name} — ${d.title}`} />
                <figcaption className="px-2 pb-1 pt-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{d.title}.</span> {d.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── E. Visual customization explorer ── */}
      {explorer.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Customization Explorer" title={product.customOptionsTitle || "Explore Your Customization Options"} />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {explorer.map((o) => (
                <div key={o.name} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
                  <ProductImageSlot title={o.name} slotPath={o.slotPath} ratio="1:1" alt={`${product.name} — ${o.name}`} />
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900">{o.name}</h3>
                    {o.description && <p className="mt-2 text-sm leading-6 text-slate-600">{o.description}</p>}
                    {o.bestFor && <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-600">Best for: {o.bestFor}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── F. Specification table ── */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading eyebrow="Specifications" title="Product Specification Overview" />
          <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <tbody>
                {specs.map((s, i) => (
                  <tr key={s.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <th scope="row" className="w-1/3 border-b border-slate-100 px-6 py-4 font-semibold text-slate-700 align-top">{s.label}</th>
                    <td className="border-b border-slate-100 px-6 py-4 text-slate-600">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── G. Application gallery ── */}
      {applicationGallery.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Applications" title="Made for Real Brand and Bulk-Order Applications" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {applicationGallery.map((a) => (
                <Link key={a.title} href={a.href} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                  <ProductImageSlot title={a.title} slotPath={a.slotPath} ratio="16:9" alt={`${product.name} — ${a.title}`} />
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">{a.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{a.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition group-hover:gap-2.5">Request a Quote <ArrowIcon className="h-3.5 w-3.5" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── H. Sample-to-shipment process ── */}
      <section className="bg-slate-950 py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Process</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">From Artwork Review to Bulk Delivery</h2>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_TO_SHIPMENT_STEPS.map((step, i) => (
              <li key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{i + 1}</div>
                <h3 className="mt-4 text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── I. Quality, testing and documentation ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Quality & Compliance" title="Quality Control and Documentation Support" />
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <ul className="space-y-3">
                {[
                  "Artwork review before production",
                  "In-process inspection during production",
                  "Final quality inspection before packing",
                  "Material and construction confirmation",
                  "Test-report and compliance-documentation request support",
                  "Destination-market requirement collection",
                  ...(product.complianceItems || []),
                ].map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                    <svg className="h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-slate-500">{COMPLIANCE_TEXT}</p>
              <Link
                href={`${quoteUrl(product)}&message=${encodeURIComponent("I need test reports or compliance documentation for this project.")}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Request Compliance Documentation <ArrowIcon />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {QUALITY_SLOTS.map((q) => (
                <ProductImageSlot key={q.path} title={q.title} slotPath={q.path} ratio="4:3" alt={q.title} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── J. Factory & workshop proof ── */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Factory Proof</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Real Production, Real Quality Control</h2>
            <p className="mt-4 text-slate-600">Factory-direct production with artwork review, in-process checks and final inspection before every shipment.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {FACTORY_SLOTS.map((f) => (
              <ProductImageSlot key={f.path} title={f.title} slotPath={f.path} ratio="4:3" alt={f.title} />
            ))}
          </div>
        </div>
      </section>

      {/* ── K. Shipping & payment workflow ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Ordering & Shipping" title="Clear B2B Order, Payment and Shipping Process" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(product.shippingSteps?.length ? product.shippingSteps : DEFAULT_SHIPPING_STEPS).map((s, i) => (
              <div key={s.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{i + 1}</div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-slate-500">
            No online checkout and no public bank details. Payment terms are confirmed on the Proforma Invoice, and shipment is arranged according to the confirmed order and payment terms.
          </p>
        </div>
      </section>

      {/* ── L. FAQ ── */}
      {product.faqs.length > 0 && (
        <section className="bg-slate-50 py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
            <div className="mt-12 divide-y divide-slate-200">
              {product.faqs.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-900 hover:text-blue-600">
                    {item.question}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 pr-12 text-sm leading-7 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── M. Related products + final CTA ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          {relatedProducts.length > 0 && (
            <>
              <SectionHeading eyebrow="Related Products" title="You Might Also Need" />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((rp) => (
                  <Link key={rp.slug} href={`${rp.urlPrefix}/${rp.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                    <ProductImageSlot title={rp.name} slotPath={`${slotBase(rp.slug)}/hero-main.webp`} ratio="4:3" alt={rp.name} />
                    <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-700">{rp.displayName || rp.name}</h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition group-hover:gap-2.5">View Details <ArrowIcon className="h-3.5 w-3.5" /></span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {relatedBlogs.length > 0 && (
            <div className="mt-14">
              <SectionHeading eyebrow="Learn More" title="Educational Buying Guides" />
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {relatedBlogs.map((b) => (
                  <Link key={b.slug} href={`/blog/${b.slug}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-white">
                    <p className="text-sm font-bold text-slate-900">{b.title}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">Read guide <ArrowIcon className="h-3.5 w-3.5" /></span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {product.relatedApplications?.length ? (
            <div className="mt-14">
              <SectionHeading eyebrow="Related Applications" title="Explore Related Applications" />
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {product.relatedApplications.map((a) => (
                  <Link key={a} href="/applications" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600">{a}</Link>
                ))}
              </div>
            </div>
          ) : null}

          {/* Final CTA */}
          <div className="mt-16 rounded-[2rem] bg-blue-600 px-6 py-14 text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Need Help Choosing the Right Custom Product?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
              Upload your artwork now or send it later. Our team can review your requirements before production.
            </p>
            <div className="mt-8">
              <Link href={quoteUrl(product)} className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">
                Request a Factory Quote <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile sticky quote CTA ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(2,6,23,0.10)] backdrop-blur-md lg:hidden">
        <Link
          href={quoteUrl(product)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
        >
          Request a Quote <ArrowIcon />
        </Link>
      </div>

      {/* ── Structured data ── */}
      <BreadcrumbListSchema items={breadcrumbItems} />
      {product.faqs.length > 0 && <FAQSchema questions={product.faqs.map((f) => ({ q: f.question, a: f.answer }))} />}
      <ProductSchema name={displayName} description={product.metaDescription} image={product.ogImage || undefined} category={family?.name} />
    </main>
  );
}
