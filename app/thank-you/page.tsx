import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | KaKa Patches",
  description:
    "Thank you for submitting your custom patch quote request. KaKa Patches will review your artwork and project requirements.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-950 to-blue-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-4xl px-6 py-24 md:py-32 text-center"><div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"><svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">Thank You</p><h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Thank You for Your <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Custom Patch Request</span></h1><p className="mt-6 mx-auto max-w-2xl text-lg leading-8 text-slate-300">Your quote request has been received. Our team will review your artwork and project requirements and respond with a factory-direct quote — typically within 1 business day.</p>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[{step:"01",t:"Requirement Review",d:"Our team reviews your artwork, patch type preferences, quantity and delivery requirements."},{step:"02",t:"Quote Preparation",d:"We prepare a detailed factory-direct quote with pricing, lead time and production recommendations."},{step:"03",t:"Artwork Confirmation",d:"Once you approve the quote, we confirm artwork details and prepare for production."}].map((s)=>(<div key={s.step} className="rounded-3xl border border-white/10 bg-white/5 p-7 text-left backdrop-blur-sm"><div className="text-2xl font-bold text-blue-400">{s.step}</div><h3 className="mt-3 text-lg font-bold text-white">{s.t}</h3><p className="mt-2 text-sm leading-7 text-slate-300">{s.d}</p></div>))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4"><Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500">View Products <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link><Link href="/resources" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Read Patch Guides</Link><Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Submit Another Quote</Link></div></div></section>
    </main>
  );
}
