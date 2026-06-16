import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact KaKa Patches | Custom Patch Manufacturer",
  description: "Contact KaKa Patches for custom patch inquiries, bulk order questions and artwork support. B2B custom patch manufacturer.",
};

export default function Page() {
  return (
    <main className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white"><div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.25),transparent)]" /><div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">Contact</p><h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Contact <span className="text-blue-400">KaKa Patches</span></h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Have questions about custom patches? We're here to help with patch type recommendations, artwork questions and bulk order inquiries.</p></div></section>
      <section className="py-24"><div className="mx-auto max-w-3xl px-6 text-center"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Get in Touch</p><h2 className="mt-4 text-3xl font-bold md:text-4xl">The Fastest Way to Get a Quote</h2><p className="mt-5 text-lg leading-8 text-slate-600">For artwork review, patch type recommendations and pricing, the Request a Quote form is the fastest way to reach our team.</p><div className="mt-10"><Link href="/request-a-quote" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500">Request a Quote →</Link></div></div></section>
    </main>
  );
}
