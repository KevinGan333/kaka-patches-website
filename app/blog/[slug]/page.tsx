import type { Metadata } from "next";
import { getContentBySlug } from "@/lib/admin/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);
  if (!post || post.status !== "published") return { title: "Blog | KaKa Patches" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getContentBySlug("blog", slug);
  if (!post || post.status !== "published") notFound();

  return (
    <main className="bg-[#FDFBF7] text-slate-900">
      <section className="bg-gradient-to-br from-slate-950 to-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-8 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Blog · {post.category}</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">{post.excerpt}</p>
          {post.publishedAt && <p className="mt-4 text-sm text-slate-400">Published {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-8">
          <MarkdownRenderer content={post.contentMarkdown || post.content || ""} />
          <div className="mt-8 flex flex-wrap gap-2">{post.tags.map((t: string) => (<span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{t}</span>))}</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-950 to-slate-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Need Custom Patches for Your Project?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-300">Upload your artwork and tell us your requirements. Our team will prepare a factory-direct quote.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/request-a-quote" className="inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-500">Request a Quote <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></Link>
            <Link href="/blog" className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/20 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.04]">More Articles</Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">Related</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Custom Patch Products →</Link>
            <Link href="/resources" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Buying Guides →</Link>
            <Link href="/request-a-quote" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Request a Quote →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
