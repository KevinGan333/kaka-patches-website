import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Embroidered vs Woven Patches — Comparison Guide | KaKa Patches",
  description: "Compare embroidered and woven custom patches. Learn about texture, detail level, durability and best applications for each patch type.",
};

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Resources</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">Embroidered vs Woven Patches</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Compare texture, detail level, durability and best applications for these two popular custom patch types.</p></div></section>
      <section className="py-24"><div className="mx-auto max-w-4xl px-6 space-y-10">
        <div><h2 className="text-2xl font-bold">Texture</h2><p className="mt-3 leading-8 text-slate-600">Embroidered patches have a raised, stitched texture using thicker threads that create a classic premium look. Woven patches have a smooth, flat surface using thinner threads in a tighter weave.</p></div>
        <div><h2 className="text-2xl font-bold">Detail Level</h2><p className="mt-3 leading-8 text-slate-600">Woven patches excel at fine details, small text and intricate logos. Embroidered patches are better for bold, classic designs where texture and traditional appearance are desired.</p></div>
        <div><h2 className="text-2xl font-bold">Durability</h2><p className="mt-3 leading-8 text-slate-600">Both types are highly durable. Embroidered patches are proven on uniforms and workwear. Woven patches maintain their clean detail through regular wear and washing.</p></div>
        <div><h2 className="text-2xl font-bold">When to Choose Each</h2><p className="mt-3 leading-8 text-slate-600"><strong>Choose embroidered</strong> for uniforms, jackets, hats, clubs, sports teams and promotional products where classic stitched texture adds value. <strong>Choose woven</strong> for clothing labels, fashion brands, detailed logos, corporate merchandise and premium apparel where fine detail matters most.</p></div>
        <div className="text-center pt-8"><Link href="/resources" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">← Back to Resources</Link></div>
      </div></section>
      <section className="bg-blue-600 py-20 text-white"><div className="mx-auto max-w-4xl px-6 text-center"><h2 className="text-3xl font-bold md:text-4xl">Need Help Choosing a Patch Type?</h2><div className="mt-10"><Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">Request a Quote →</Link></div></div></section>
    </main>
  );
}
