import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote — Custom Patch Inquiry | KaKa Patches",
  description: "Upload your artwork and request a factory-direct quote for custom embroidered, woven, PVC and chenille patches. B2B bulk order support.",
};

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-7xl px-6 py-24 md:py-28"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Get Started</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Request a <span className="text-blue-400">Quote</span></h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Upload your artwork and tell us your patch requirements. Our team will review your project and prepare a factory-direct quote — typically within 1 business day.</p></div></section>
      <section className="py-24"><div className="mx-auto max-w-3xl px-6"><QuoteForm /></div></section>
    </main>
  );
}
