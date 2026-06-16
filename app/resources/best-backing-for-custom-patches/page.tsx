import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Backing for Custom Patches — Attachment Guide | KaKa Patches",
  description: "Compare sew-on, iron-on, Velcro, adhesive and no backing for custom patches. Choose the right attachment method for your product and application.",
};

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Resources</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">Best Backing for Custom Patches</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Compare sew-on, iron-on, Velcro, adhesive and no backing for different custom patch applications.</p></div></section>
      <section className="py-24"><div className="mx-auto max-w-4xl px-6 space-y-10">
        <div><h2 className="text-2xl font-bold">Sew-on Backing</h2><p className="mt-3 leading-8 text-slate-600">The most durable and permanent attachment method. Best for uniforms, jackets, workwear and any product that needs maximum long-term durability. Withstands industrial laundering and heavy use.</p></div>
        <div><h2 className="text-2xl font-bold">Iron-on (Heat Seal) Backing</h2><p className="mt-3 leading-8 text-slate-600">Fast application during production using heat activation. Works on cotton, denim and most natural fabrics. Popular for apparel manufacturing, promotional patches and retail products where quick attachment is needed.</p></div>
        <div><h2 className="text-2xl font-bold">Velcro Backing</h2><p className="mt-3 leading-8 text-slate-600">Hook-and-loop for removable, interchangeable patches. Ideal for tactical gear, military uniforms, bags and products where patches need to be changed or updated regularly.</p></div>
        <div><h2 className="text-2xl font-bold">Adhesive Backing</h2><p className="mt-3 leading-8 text-slate-600">Peel-and-stick for temporary or promotional use. Convenient for event merchandise, packaging inserts, promotional giveaways and short-term applications.</p></div>
        <div><h2 className="text-2xl font-bold">No Backing</h2><p className="mt-3 leading-8 text-slate-600">Patches produced without backing — the buyer applies their own attachment method. Common for certain production workflows and when the end-user will determine attachment.</p></div>
        <div className="text-center pt-8"><Link href="/resources" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">← Back to Resources</Link></div>
      </div></section>
      <section className="bg-blue-600 py-20 text-white"><div className="mx-auto max-w-4xl px-6 text-center"><h2 className="text-3xl font-bold md:text-4xl">Need Custom Patches?</h2><div className="mt-10"><Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">Request a Quote →</Link></div></div></section>
    </main>
  );
}
