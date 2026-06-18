import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact KaKa Patches | Custom Patch Manufacturer",
  description: "Contact KaKa Patches for custom patch inquiries, bulk order questions and artwork support. Email sales@kakapatches.com.",
};

export default function Page() {
  return (
    <main className="bg-[#FDFBF7] text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#030a1c] to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(37,99,235,0.15),transparent)]" />
        <div className="relative mx-auto max-w-[1440px] px-8 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Contact</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight md:text-5xl lg:text-6xl">
            Contact <span className="text-blue-400">KaKa Patches</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            For custom patch inquiries, artwork review, bulk order support and production questions, please contact our sales team.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Sales Team</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">Contact Our Sales Team</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            For patch type recommendations, artwork questions, pricing and bulk order inquiries, email us directly.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Email</p>
            <a href="mailto:sales@kakapatches.com" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
              sales@kakapatches.com
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-500">
              Request a Quote
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </Link>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            For immediate project discussion, the Request a Quote form is the fastest way to reach our production team.
          </p>
        </div>
      </section>
    </main>
  );
}
