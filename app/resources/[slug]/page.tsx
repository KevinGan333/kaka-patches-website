import type { Metadata } from "next";
import { getContentBySlug } from "@/lib/admin/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getContentBySlug("resources", slug);
  if (!guide || guide.status !== "published") return { title: "Resources | KaKa Patches" };
  return {
    title: guide.seoTitle || guide.title,
    description: guide.seoDescription || guide.excerpt,
    openGraph: { title: guide.seoTitle || guide.title, description: guide.seoDescription || guide.excerpt },
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = await getContentBySlug("resources", slug);
  if (!guide || guide.status !== "published") notFound();

  return (
    <main className="bg-[#FDFBF7] text-slate-900">
      <section className="bg-gradient-to-br from-slate-950 to-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-8 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Resources · {guide.category}</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">{guide.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">{guide.excerpt}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-8">
          <MarkdownRenderer content={guide.contentMarkdown || guide.content || ""} />
          <div className="mt-8 flex flex-wrap gap-2">{guide.tags.map((t: string) => (<span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{t}</span>))}</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-950 to-slate-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to Apply This Guide?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-300">Upload your artwork and tell us about your project. Our team will help with recommendations.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-500">Request a Quote <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link>
            <Link href="/resources" className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/20 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.04]">All Resources</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Related</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Custom Patch Products →</Link>
            <Link href="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Blog Articles →</Link>
            <Link href="/request-a-quote" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Request a Quote →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
