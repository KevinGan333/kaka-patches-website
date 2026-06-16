import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Choose Patch Size — Sizing Guide | KaKa Patches",
  description: "Learn how to choose the right custom patch size for jackets, hats, uniforms, bags and more. Size recommendations for common B2B applications.",
};

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Resources</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">How to Choose Patch Size</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Patch sizing guide for jackets, hats, uniforms, bags, labels and large back patches.</p></div></section>
      <section className="py-24"><div className="mx-auto max-w-4xl px-6 space-y-10">
        <div><h2 className="text-2xl font-bold">Jackets & Outerwear</h2><p className="mt-3 leading-8 text-slate-600">Chest patches: 3–4 inches. Back patches: 8–12 inches. Sleeve patches: 2–3 inches.</p></div>
        <div><h2 className="text-2xl font-bold">Caps & Hats</h2><p className="mt-3 leading-8 text-slate-600">Front panel patches: 2–3 inches. Side patches: 1.5–2 inches.</p></div>
        <div><h2 className="text-2xl font-bold">Uniforms</h2><p className="mt-3 leading-8 text-slate-600">Shoulder or chest badges: 2–3 inches. Name patches: 1–2 inches. Organization patches: 3–4 inches.</p></div>
        <div><h2 className="text-2xl font-bold">Bags & Backpacks</h2><p className="mt-3 leading-8 text-slate-600">Large center patches: 4–6 inches. Small accent patches: 2–3 inches.</p></div>
        <div><h2 className="text-2xl font-bold">Clothing Labels & Tags</h2><p className="mt-3 leading-8 text-slate-600">Brand labels: 1–2 inches. Hang tags and brand tags: 1.5–2.5 inches.</p></div>
        <p className="leading-8 text-slate-600">If you are unsure about sizing, provide your intended application and our team can recommend a suitable size based on your design and usage.</p>
        <div className="text-center pt-8"><Link href="/resources" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">← Back to Resources</Link></div>
      </div></section>
      <section className="bg-blue-600 py-20 text-white"><div className="mx-auto max-w-4xl px-6 text-center"><h2 className="text-3xl font-bold md:text-4xl">Need Custom Patches?</h2><div className="mt-10"><Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">Request a Quote →</Link></div></div></section>
    </main>
  );
}
