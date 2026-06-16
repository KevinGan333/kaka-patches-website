import type { Metadata } from "next";
import Link from "next/link";
import { getContentList } from "@/lib/admin/content";

export const metadata: Metadata = {
  title: "Custom Patch Blog — Buying Tips & Product Insights | KaKa Patches",
  description: "Read KaKa Patches blog articles about custom embroidered patches, woven patches, PVC patches, chenille patches, patch sizing, backing options, artwork tips, and B2B patch buying guidance.",
};

export default async function BlogPage() {
  const posts = await getContentList("blog");
  const published = posts.filter(p => p.status === "published");

  return (
    <main className="bg-[#FDFBF7] text-slate-900">
      <section className="bg-gradient-to-br from-slate-950 to-slate-900 text-white">
        <div className="mx-auto max-w-[1440px] px-8 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Blog</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight md:text-5xl lg:text-6xl">Custom Patch Blog</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Insights, buying tips, product ideas and custom patch guidance for apparel brands, teams, uniform suppliers and promotional buyers.</p>
          <div className="mt-8">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-500">Request a Quote <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-8">
          {published.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-20 text-center"><p className="text-slate-400 text-lg">Blog articles are coming soon.</p></div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {published.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">{p.category}</span>
                  <h2 className="mt-4 text-xl font-bold leading-[1.3] text-slate-900 group-hover:text-blue-600 transition">{p.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-500">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">Read Article <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-950 to-slate-900 py-24 text-white">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">Need Help Choosing the Right Patch?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-300">Upload your artwork and tell us your requirements. Our team will prepare a factory-direct quote.</p>
          <div className="mt-8"><Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-blue-500">Request a Quote <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link></div>
        </div>
      </section>
    </main>
  );
}
