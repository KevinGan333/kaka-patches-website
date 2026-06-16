"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminContentPage() {
  const router = useRouter();
  const [blogStats, setBlogStats] = useState({ total: 0, published: 0, draft: 0 });
  const [resStats, setResStats] = useState({ total: 0, published: 0, draft: 0 });
  const [latestBlog, setLatestBlog] = useState<any[]>([]);
  const [latestRes, setLatestRes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [blogRes, resRes] = await Promise.all([
          fetch("/api/admin/content/blog"),
          fetch("/api/admin/content/resources"),
        ]);
        if (blogRes.status === 401 || resRes.status === 401) { router.push("/admin/login"); return; }
        const blogData = (await blogRes.json()).items || [];
        const resData = (await resRes.json()).items || [];
        setBlogStats({ total: blogData.length, published: blogData.filter((b: any) => b.status === "published").length, draft: blogData.filter((b: any) => b.status === "draft").length });
        setResStats({ total: resData.length, published: resData.filter((r: any) => r.status === "published").length, draft: resData.filter((r: any) => r.status === "draft").length });
        setLatestBlog(blogData.slice(0, 5));
        setLatestRes(resData.slice(0, 5));
      } catch { console.error("Failed to load"); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  if (loading) return <div className="px-6 py-8"><h1 className="text-2xl font-bold text-slate-900">Content</h1><p className="mt-4 text-sm text-slate-400">Loading...</p></div>;

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Content</h1>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Blog Posts", total: blogStats.total, pub: blogStats.published, draft: blogStats.draft, color: "text-blue-600" },
          { label: "Resources", total: resStats.total, pub: resStats.published, draft: resStats.draft, color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className={`mt-1 text-3xl font-extrabold ${s.color}`}>{s.total}</p>
            <div className="mt-2 flex gap-3 text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold">{s.pub} published</span>
              <span className="text-slate-400 font-semibold">{s.draft} draft</span>
            </div>
          </div>
        ))}
        <div className="flex items-end gap-3 pb-3">
          <Link href="/admin/content/blog/new" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">New Blog Post</Link>
          <Link href="/admin/content/resources/new" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50">New Resource</Link>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Latest Blog */}
        <div>
          <div className="flex items-center justify-between mb-3"><h2 className="text-base font-bold text-slate-900">Latest Blog Posts</h2><Link href="/admin/content/blog" className="text-xs font-semibold text-blue-600">Manage →</Link></div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {latestBlog.length === 0 ? <p className="p-6 text-sm text-slate-400 text-center">No blog posts yet.</p> :
              <table className="w-full text-xs"><tbody>{latestBlog.map((p: any) => (
                <tr key={p.slug} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{p.title}</td>
                  <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.status === "published" ? "bg-emerald-50 text-emerald-700" : p.status === "draft" ? "bg-slate-100 text-slate-500" : "bg-red-50 text-red-600"}`}>{p.status}</span></td>
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : ""}</td>
                  <td className="px-4 py-2.5"><Link href={`/admin/content/blog/${p.slug}/edit`} className="text-blue-600 font-semibold">Edit</Link></td>
                </tr>
              ))}</tbody></table>
            }
          </div>
        </div>
        {/* Latest Resources */}
        <div>
          <div className="flex items-center justify-between mb-3"><h2 className="text-base font-bold text-slate-900">Latest Resources</h2><Link href="/admin/content/resources" className="text-xs font-semibold text-blue-600">Manage →</Link></div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {latestRes.length === 0 ? <p className="p-6 text-sm text-slate-400 text-center">No resources yet.</p> :
              <table className="w-full text-xs"><tbody>{latestRes.map((r: any) => (
                <tr key={r.slug} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{r.title}</td>
                  <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${r.status === "published" ? "bg-emerald-50 text-emerald-700" : r.status === "draft" ? "bg-slate-100 text-slate-500" : "bg-red-50 text-red-600"}`}>{r.status}</span></td>
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">{r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : ""}</td>
                  <td className="px-4 py-2.5"><Link href={`/admin/content/resources/${r.slug}/edit`} className="text-blue-600 font-semibold">Edit</Link></td>
                </tr>
              ))}</tbody></table>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
