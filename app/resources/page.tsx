import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom Patch Resources — Guides & Tips | KaKa Patches",
  description: "Custom patch resources, guides and tips for B2B buyers. Learn about embroidered vs woven patches, how to choose patch size, and best backing options.",
};

const guides = [
  { title: "Embroidered vs Woven Patches", desc: "Compare texture, detail level, use cases and buying recommendations for these two popular patch types.", href: "/resources/embroidered-vs-woven-patches" },
  { title: "How to Choose Patch Size", desc: "Patch sizing guide for jackets, hats, uniforms, bags, labels and large back patches.", href: "/resources/how-to-choose-patch-size" },
  { title: "Best Backing for Custom Patches", desc: "Compare sew-on, iron-on, Velcro, adhesive and no backing for different applications.", href: "/resources/best-backing-for-custom-patches" },
];

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Resources</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Custom Patch <span className="text-blue-400">Resources</span></h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Helpful guides for B2B buyers sourcing custom patches. Learn about patch types, sizing, backing options and more.</p></div></section>
      <section className="py-24"><div className="mx-auto max-w-7xl px-6"><div className="grid gap-6 md:grid-cols-3">{guides.map((r)=>(<Link key={r.href} href={r.href} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"><div className="mb-6 h-12 w-12 rounded-2xl bg-blue-100"/><h2 className="text-xl font-bold">{r.title}</h2><p className="mt-4 text-sm leading-7 text-slate-600">{r.desc}</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition group-hover:gap-2">Read Guide →</span></Link>))}</div></div></section>
      <section className="bg-blue-600 py-20 text-white"><div className="mx-auto max-w-4xl px-6 text-center"><h2 className="text-3xl font-bold md:text-4xl">Ready to Start Your Custom Patch Project?</h2><div className="mt-10"><Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">Request a Quote →</Link></div></div></section>
    </main>
  );
}
