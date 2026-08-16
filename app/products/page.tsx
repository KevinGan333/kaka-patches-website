import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom Patch Products for B2B Buyers — Embroidered, Woven, PVC, Chenille, Labels & Accessories | KaKa Patches",
  description: "KaKa Patches manufactures custom embroidered, woven, PVC and chenille patches, woven and printed labels, heat transfers, and custom accessories for brands, teams, uniforms, events and promotional buyers.",
};

const patches = [
  { title: "Custom Embroidered Patches", desc: "Classic stitched texture — the industry standard for uniforms, jackets, caps and brand merchandise.", href: "/products/custom-embroidered-patches", gradient: "from-blue-600 to-blue-700", badge: "Most Popular", bestFor: "Uniforms, clubs, merchandise" },
  { title: "Custom Woven Patches", desc: "Fine-detail finish captures small text and intricate logos with a smooth, flat surface for premium labels.", href: "/products/custom-woven-patches", gradient: "from-indigo-600 to-indigo-700", badge: "Best Detail", bestFor: "Labels, fine logos, apparel" },
  { title: "Custom PVC Patches", desc: "Soft flexible rubber with bold 3D relief — waterproof and built for outdoor gear and high-wear applications.", href: "/products/custom-pvc-patches", gradient: "from-cyan-600 to-cyan-700", badge: "Most Durable", bestFor: "Outdoor, tactical, sports" },
  { title: "Custom Chenille Patches", desc: "Textured fuzzy finish with premium varsity feel — perfect for letterman jackets, teams and fashion graphics.", href: "/products/custom-chenille-patches", gradient: "from-violet-600 to-violet-700", badge: "Best Texture", bestFor: "Varsity, fashion, letters" },
  { title: "Custom Leather Patches", desc: "Premium leather patches for hats, bags, jackets and high-end brand labels with embossed or laser-engraved detail.", href: "/products/custom-leather-patches", gradient: "from-amber-600 to-amber-700", badge: "Premium Look", bestFor: "Hats, denim, premium apparel" },
  { title: "Custom Printed Patches", desc: "Full-color printed designs for detailed artwork, photographic reproduction and vibrant promotional products.", href: "/products/custom-printed-patches", gradient: "from-rose-600 to-rose-700", badge: "Full Color", bestFor: "Photos, complex art, promo" },
  { title: "Custom Velcro Patches", desc: "Hook-and-loop removable patches for tactical gear, uniforms and interchangeable badge systems.", href: "/products/custom-velcro-patches", gradient: "from-emerald-600 to-emerald-700", badge: "Removable", bestFor: "Tactical, uniforms, badges" },
];

const labels = [
  { title: "Custom Woven Labels", desc: "Fine-detail damask, satin and taffeta woven labels for clothing brands, care labels and brand tags.", href: "/products/custom-woven-labels", gradient: "from-pink-600 to-rose-700", badge: "Best Detail", bestFor: "Clothing, care labels, brand tags" },
  { title: "Custom Printed Labels", desc: "Full-color printed labels on satin, cotton, Tyvek or coated stock for vibrant brand identification.", href: "/products/custom-printed-labels", gradient: "from-orange-600 to-amber-700", badge: "Full Color", bestFor: "Fashion, accessories, hang tags" },
  { title: "Custom Heat Transfer Labels", desc: "No-sew heat-applied labels with smooth skin-friendly finish for performance wear and seamless garments.", href: "/products/custom-heat-transfer-labels", gradient: "from-lime-600 to-green-700", badge: "No-Sew", bestFor: "Activewear, sportswear, tees" },
];

const accessories = [
  { title: "Custom Embroidered Keychains", desc: "Soft PVC, metal, epoxy and 3D molded keychains for brand merchandise.", href: "/custom-accessories/custom-keychains", gradient: "from-rose-600 to-rose-700", badge: "Popular", bestFor: "Brand merch, events" },
  { title: "Custom Embroidered Stickers", desc: "3D embroidered fabric stickers with peel-and-stick or sew-on backing.", href: "/custom-accessories/custom-embroidered-stickers", gradient: "from-amber-600 to-amber-700", badge: "Premium", bestFor: "Branding, packaging" },
  { title: "Custom Plush Charms", desc: "Soft plush fabric charms with full-color printing for bag and keychain accessories.", href: "/custom-accessories/custom-plush-charms", gradient: "from-pink-600 to-pink-700", badge: "Kawaii", bestFor: "Character goods, bags" },
  { title: "Custom Pin-Back Buttons", desc: "Metal shell buttons with full-color printed inserts for campaigns and events.", href: "/custom-accessories/custom-pin-back-buttons", gradient: "from-yellow-600 to-yellow-700", badge: "Classic", bestFor: "Campaigns, events" },
  { title: "Custom Embroidered Bookmarks", desc: "Fine embroidered fabric bookmarks with tassels for bookstores and literary gifts.", href: "/custom-accessories/custom-embroidered-bookmarks", gradient: "from-green-600 to-green-700", badge: "Literary", bestFor: "Bookstores, libraries" },
  { title: "Custom Embroidered Fridge Magnets", desc: "3D embroidered magnets with strong magnetic backing for souvenirs and gifts.", href: "/custom-accessories/custom-embroidered-fridge-magnets", gradient: "from-teal-600 to-teal-700", badge: "Souvenir", bestFor: "Tourism, gifts" },
  { title: "Custom Card Holders & Card Wallets", desc: "PU leather, PVC and fabric card holders with custom branding for corporate gifts.", href: "/custom-accessories/custom-card-holders-wallets", gradient: "from-sky-600 to-sky-700", badge: "Practical", bestFor: "Corporate, fashion" },
  { title: "Custom Sachets", desc: "Scented fabric sachets with printed or embroidered pouches for aromatherapy and gifts.", href: "/custom-accessories/custom-sachets", gradient: "from-purple-600 to-purple-700", badge: "Fragrant", bestFor: "Wellness, weddings" },
  { title: "Custom Omamori Pouches", desc: "Traditional Japanese embroidered good luck charm pouches for cultural gifts and shrines.", href: "/custom-accessories/custom-omamori-bags", gradient: "from-red-600 to-red-700", badge: "Cultural", bestFor: "Shrines, souvenirs" },
];

function ProductCard({ item }: { item: typeof patches[0] }) {
  return (
    <Link key={item.href} href={item.href} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
          </svg>
        </div>
        {item.badge && <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">{item.badge}</span>}
      </div>
      <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{item.desc}</p>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="text-slate-400">Best for:</span> {item.bestFor}
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition group-hover:gap-2.5">
        View Details
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
        </svg>
      </span>
    </Link>
  );
}

export default function ProductsPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-950 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">Products</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-[1.1]">
            Custom Patch, Label & Accessory Products for <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">B2B Buyers</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Seven distinct patch types, three label technologies, and nine custom accessory categories — each optimized for different branding needs, durability requirements and budgets.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500">
              Request a Quote
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PATCHES SECTION ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Custom Patches</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Seven Patch Types — One Factory Partner</h2>
            <p className="mt-4 text-slate-500">From classic embroidered to premium leather — choose the patch type that matches your brand, application and budget.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {patches.map((item) => <ProductCard key={item.href} item={item} />)}
          </div>
        </div>
      </section>

      {/* ─── LABELS & TRANSFERS SECTION ─── */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">Labels & Transfers</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Brand Labels & Heat Transfer Solutions</h2>
            <p className="mt-4 text-slate-500">Woven, printed and heat transfer labels for clothing brands, apparel manufacturers and seamless garment applications.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {labels.map((item) => <ProductCard key={item.href} item={item} />)}
          </div>
        </div>
      </section>

      {/* ─── CUSTOM ACCESSORIES SECTION ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Custom Accessories</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Branded Accessories for Every Occasion</h2>
            <p className="mt-4 text-slate-500">From keychains and embroidered stickers to omamori bags and scented sachets — custom accessories that extend your brand into everyday life.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accessories.map((item) => <ProductCard key={item.href} item={item} />)}
          </div>
          <p className="mt-10 text-center">
            <Link href="/custom-accessories" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
              View All Accessories →
            </Link>
          </p>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Product Comparison</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Compare Patch Types</h2>
          </div>
          <div className="mt-14 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                  <th className="px-7 py-5 font-semibold">Feature</th>
                  <th className="px-7 py-5 font-semibold text-blue-700">Embroidered</th>
                  <th className="px-7 py-5 font-semibold text-indigo-700">Woven</th>
                  <th className="px-7 py-5 font-semibold text-cyan-700">PVC</th>
                  <th className="px-7 py-5 font-semibold text-violet-700">Chenille</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "Texture", e: "Raised stitched", w: "Smooth flat", p: "Rubber 3D", c: "Soft fuzzy" },
                  { f: "Detail Level", e: "Good", w: "Excellent", p: "Moderate", c: "Moderate" },
                  { f: "Durability", e: "High", w: "High", p: "Very high", c: "Good" },
                  { f: "Applications", e: "Uniforms, jackets, clubs", w: "Labels, fashion brands", p: "Outdoor, tactical", c: "Varsity, fashion" },
                  { f: "MOQ", e: "200 pcs", w: "200 pcs", p: "200 pcs", c: "200 pcs" },
                ].map((r, i) => (
                  <tr key={r.f} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}>
                    <td className="px-7 py-4 font-semibold text-slate-800">{r.f}</td>
                    <td className="px-7 py-4">{r.e}</td>
                    <td className="px-7 py-4">{r.w}</td>
                    <td className="px-7 py-4">{r.p}</td>
                    <td className="px-7 py-4">{r.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Not Sure Which Product Is Right?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Upload your artwork and tell us your requirements. Our team will help you select the best product type and prepare a factory-direct quote.
          </p>
          <div className="mt-10">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-blue-700 shadow-xl transition hover:bg-blue-50">
              Request a Quote
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
