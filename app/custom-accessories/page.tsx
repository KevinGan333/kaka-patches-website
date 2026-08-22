import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbListSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Custom Accessories for B2B Buyers — Keychains, Charms, Stickers & More | KaKa Patches",
  description: "KaKa Patches manufactures custom keychains, embroidered stickers, plush charms, pin-back buttons, embroidered bookmarks, embroidered fridge magnets, card holders and wallets, sachets and omamori bags for brands, events and promotional buyers.",
};

const products = [
  { title: "Custom Embroidered Keychains", desc: "Soft PVC, metal, epoxy or 3D molded personalized keychains for brand giveaways, retail and event merchandise.", href: "/custom-accessories/custom-keychains", gradient: "from-rose-600 to-rose-700", badge: "Popular", bestFor: "Brand merchandise, events" },
  { title: "Custom Embroidered Stickers", desc: "3D embroidered fabric stickers with peel-and-stick, iron-on or sew-on backing for brand giveaways and packaging decoration.", href: "/custom-accessories/custom-embroidered-stickers", gradient: "from-amber-600 to-amber-700", badge: "Premium", bestFor: "Branding, packaging" },
  { title: "Custom Plush Charms", desc: "Soft plush fabric charms with full-color sublimation printing for bag accessories, keychain decorations and kawaii merchandise.", href: "/custom-accessories/custom-plush-charms", gradient: "from-pink-600 to-pink-700", badge: "Kawaii", bestFor: "Character goods, bags" },
  { title: "Custom Pin-Back Buttons", desc: "Metal shell pin-back buttons with full-color printed inserts for campaign promotions, event merchandise and fundraising items.", href: "/custom-accessories/custom-pin-back-buttons", gradient: "from-yellow-600 to-yellow-700", badge: "Classic", bestFor: "Campaigns, events" },
  { title: "Custom Embroidered Bookmarks", desc: "Fine embroidered fabric bookmarks with tassels for bookstores, libraries, publishing houses and literary merchandise.", href: "/custom-accessories/custom-embroidered-bookmarks", gradient: "from-green-600 to-green-700", badge: "Literary", bestFor: "Bookstores, libraries" },
  { title: "Custom Embroidered Fridge Magnets", desc: "3D embroidered fridge magnets with strong magnetic backing for souvenir shops, tourist destinations and promotional gifts.", href: "/custom-accessories/custom-embroidered-fridge-magnets", gradient: "from-teal-600 to-teal-700", badge: "Souvenir", bestFor: "Tourism, gifts" },
  { title: "Custom Card Holders & Card Wallets", desc: "PU leather, PVC or fabric card holders and wallets with custom branding for corporate gifts and fashion accessories.", href: "/custom-accessories/custom-card-holders-wallets", gradient: "from-sky-600 to-sky-700", badge: "Practical", bestFor: "Corporate, fashion" },
  { title: "Custom Sachets", desc: "Scented fabric sachets with printed or embroidered pouches for aromatherapy, home fragrance, wedding favors and promotional gifts.", href: "/custom-accessories/custom-sachets", gradient: "from-purple-600 to-purple-700", badge: "Fragrant", bestFor: "Wellness, weddings" },
  { title: "Custom Omamori Pouches", desc: "Traditional Japanese-style embroidered good luck charm pouches for shrine merchandise, cultural gifts and souvenir shops.", href: "/custom-accessories/custom-omamori-bags", gradient: "from-red-600 to-red-700", badge: "Cultural", bestFor: "Shrines, souvenirs" },
];

const comparisonRows = [
  { product: "Embroidered Keychains", material: "Soft PVC, Metal, Epoxy", durability: "High", detail: "Good", applications: "Brand merchandise, events", moq: "200 pcs/design" },
  { product: "Embroidered Stickers", material: "Polyester Thread, Fabric", durability: "High", detail: "Good", applications: "Branding, packaging", moq: "200 pcs/design" },
  { product: "Plush Charms", material: "Plush Fabric, Fiberfill", durability: "Moderate", detail: "Good", applications: "Character goods, bags", moq: "200 pcs/design" },
  { product: "Pin-Back Buttons", material: "Metal Shell, Mylar", durability: "Moderate", detail: "Good", applications: "Campaigns, events", moq: "200 pcs/design" },
  { product: "Embroidered Bookmarks", material: "Fabric, Embroidery Thread", durability: "High", detail: "Excellent", applications: "Bookstores, libraries", moq: "200 pcs/design" },
  { product: "Embroidered Magnets", material: "Fabric, Thread, Magnet", durability: "High", detail: "Good", applications: "Tourism, gifts", moq: "200 pcs/design" },
  { product: "Card Holders & Wallets", material: "PU Leather, PVC, Fabric", durability: "High", detail: "Good", applications: "Corporate, fashion", moq: "200 pcs/design" },
  { product: "Sachets", material: "Fabric, Botanicals", durability: "Moderate", detail: "Good", applications: "Wellness, weddings", moq: "200 pcs/design" },
  { product: "Omamori Pouches", material: "Brocade, Silk-Poly", durability: "High", detail: "Excellent", applications: "Shrines, souvenirs", moq: "200 pcs/design" },
];

const SparkleIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function CustomAccessoriesPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero — bg-slate-950 with radial gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-950 to-amber-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(245,158,11,0.2),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">Custom Accessories</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-[1.1]">
            Custom Accessories for <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">B2B Buyers</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Nine premium accessory types — from keychains and embroidered stickers to omamori bags and scented sachets. Each manufactured to your exact specifications with factory-direct pricing and low MOQs.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500">
              Request a Quote <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid — 9 cards, 3 columns */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Product Categories</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Nine Accessory Types — One Factory Partner</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {products.map((item) => (
              <Link key={item.href} href={item.href} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl">
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md`}>
                    <SparkleIcon />
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">{item.badge}</span>
                </div>
                <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{item.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500"><span className="text-slate-400">Best for:</span> {item.bestFor}</div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition group-hover:gap-2.5">View Details <ArrowIcon /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Comparison Table */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Product Comparison</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Compare Custom Accessories</h2>
          </div>
          <div className="mt-14 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                  <th className="px-7 py-5 font-semibold">Product</th>
                  <th className="px-7 py-5 font-semibold">Material</th>
                  <th className="px-7 py-5 font-semibold">Durability</th>
                  <th className="px-7 py-5 font-semibold">Detail Level</th>
                  <th className="px-7 py-5 font-semibold">Applications</th>
                  <th className="px-7 py-5 font-semibold">MOQ</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((r, i) => (
                  <tr key={r.product} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}>
                    <td className="px-7 py-4 font-semibold text-slate-800">{r.product}</td>
                    <td className="px-7 py-4">{r.material}</td>
                    <td className="px-7 py-4">{r.durability}</td>
                    <td className="px-7 py-4">{r.detail}</td>
                    <td className="px-7 py-4">{r.applications}</td>
                    <td className="px-7 py-4">{r.moq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Need Custom Accessories?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Whether you need keychains for an event, embroidered stickers for brand giveaways, or omamori bags for a cultural shop — we produce them all under one roof. Upload your artwork and get a factory-direct quote today.
          </p>
          <div className="mt-10">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-blue-700 shadow-xl transition hover:bg-blue-50">
              Request a Quote <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
      <BreadcrumbListSchema items={[{ name: "Home", href: "/" }, { name: "Custom Accessories", href: "/custom-accessories" }]} />
    </main>
  );
}
