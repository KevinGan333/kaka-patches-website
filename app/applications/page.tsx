import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom Patch Applications — Solutions by Industry | KaKa Patches",
  description: "Custom patch solutions for clothing brands, sports teams, uniforms, events, clubs and promotional projects. B2B factory-direct patch manufacturer.",
};

const linked = [
  { title: "Clothing Brands", desc: "Apparel branding, streetwear, fashion collections, jackets, hats and bags.", href: "/applications/custom-patches-for-clothing-brands" },
  { title: "Sports Teams", desc: "Team badges, club logos, jerseys, caps, event patches and fan merchandise.", href: "/applications/custom-patches-for-sports-teams" },
  { title: "Uniform Suppliers", desc: "Workwear, school uniforms, staff uniforms, security uniforms and organization badges.", href: "/applications/custom-patches-for-uniforms" },
];

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Applications</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl md:leading-[1.1]">Custom Patch Solutions <span className="text-blue-400">by Application</span></h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">KaKa Patches helps clothing brands, sports teams, uniform suppliers, clubs, events and promotional buyers create custom patches for real product and branding needs.</p><div className="mt-10 flex flex-wrap gap-4"><Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500">Request a Quote →</Link><Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">View Products</Link></div></div></section>
      <section className="py-24"><div className="mx-auto max-w-7xl px-6"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Application Categories</p><h2 className="mt-4 text-3xl font-bold md:text-4xl">Patch Solutions for Your Industry</h2></div><div className="mt-14 grid gap-6 md:grid-cols-3">{linked.map((item)=>(<Link key={item.href} href={item.href} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"><h2 className="text-xl font-bold">{item.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{item.desc}</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition group-hover:gap-2">View Solution →</span></Link>))}</div></div></section>
      <section className="bg-blue-600 py-20 text-white"><div className="mx-auto max-w-4xl px-6 text-center"><h2 className="text-3xl font-bold md:text-4xl">Need Custom Patches for Your Application?</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-50">Tell us about your industry and requirements. We'll recommend the best patch type and prepare a factory-direct quote.</p><div className="mt-10"><Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">Request a Quote →</Link></div></div></section>
    </main>
  );
}
