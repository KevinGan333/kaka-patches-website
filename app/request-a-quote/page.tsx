import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote — Custom Patch Inquiry | KaKa Patches",
  description: "Upload your artwork and request a factory-direct quote for custom embroidered, woven, PVC and chenille patches. B2B bulk order support.",
};

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-7xl px-6 py-24 md:py-28"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Get Started</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Request a <span className="text-blue-400">Quote</span></h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Upload your artwork and tell us your patch requirements. Our team will review your project and prepare a factory-direct quote — typically within 1 business day.</p><p className="mt-4 text-sm text-slate-400">You can submit your request now and send artwork later.</p></div></section>
      <section className="py-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-3">
          <div className="lg:col-span-2"><QuoteForm /></div>
          <div className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <h3 className="text-lg font-bold text-slate-900">What happens next?</h3>
              <div className="mt-6 space-y-5">
                {[
                  { s:"1", t:"We review your requirements", d:"Our team checks your patch type, size, backing and quantity details." },
                  { s:"2", t:"We confirm patch specifications", d:"We confirm patch type, size and backing options with you." },
                  { s:"3", t:"You receive a quote by email", d:"A factory-direct quote is sent — typically within 1 business day." },
                  { s:"4", t:"Production starts after confirmation", d:"Once you approve the quote, production begins with quality checks at every stage." },
                ].map(step=>(<div key={step.s} className="flex gap-3"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{step.s}</div><div><p className="text-sm font-bold text-slate-800">{step.t}</p><p className="mt-0.5 text-xs leading-6 text-slate-500">{step.d}</p></div></div>))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
