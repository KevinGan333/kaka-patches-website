"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/quotes");
        if (res.status === 401) { router.push("/admin/login"); return; }
        const data = await res.json();
        setQuotes(data.quotes || []);
      } catch { console.error("Failed to load"); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const isNew = (q: any) => !q.status || q.status === "New";
    const isWaiting = (q: any) => q.status === "Waiting for Customer";
    return {
      total: quotes.length,
      new_: quotes.filter(isNew).length,
      reviewed: quotes.filter((q: any) => q.status === "Reviewed").length,
      needFollowUp: quotes.filter((q: any) => isNew(q) || isWaiting(q)).length,
      quoted: quotes.filter((q: any) => q.status === "Quoted").length,
      inProduction: quotes.filter((q: any) => q.status === "In Production").length,
      emailSent: quotes.filter((q: any) => q.email?.sent === true).length,
      emailFailed: quotes.filter((q: any) => q.email?.sent === false && q.email?.error).length,
      artworkUploaded: quotes.filter((q: any) => q.artwork?.originalFileName).length,
      thisWeek: quotes.filter((q: any) => new Date(q.submittedAt) >= weekAgo).length,
      latest: quotes.slice(0, 5),
    };
  }, [quotes]);

  const cards = [
    { label: "Total Quotes", value: stats.total, color: "text-slate-800", hint: "All submitted requests" },
    { label: "New", value: stats.new_, color: "text-blue-600", hint: "Awaiting first review" },
    { label: "Need Follow-up", value: stats.needFollowUp, color: "text-amber-600", hint: "New + Waiting for Customer" },
    { label: "Quoted", value: stats.quoted, color: "text-emerald-600", hint: "Quote sent to customer" },
    { label: "In Production", value: stats.inProduction, color: "text-violet-600", hint: "Currently in production" },
    { label: "Email Sent", value: stats.emailSent, color: "text-emerald-500", hint: "Successfully delivered" },
    { label: "Email Failed", value: stats.emailFailed, color: "text-red-500", hint: "Requires manual check" },
    { label: "Artwork Uploaded", value: stats.artworkUploaded, color: "text-cyan-600", hint: "With attached files" },
    { label: "This Week", value: stats.thisWeek, color: "text-blue-500", hint: "Last 7 days" },
  ];

  if (loading) return <div className="px-6 py-8"><h1 className="text-2xl font-bold text-slate-900">Dashboard</h1><p className="mt-8 text-sm text-slate-400">Loading...</p></div>;

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
            <p className={`mt-1 text-3xl font-extrabold ${c.color}`}>{c.value}</p>
            <p className="mt-1 text-[11px] text-slate-400">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Latest Quote Requests</h2>
          <Link href="/admin/quotes" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All →</Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2.5 font-semibold text-slate-600">Date</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Name</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600 hidden md:table-cell">Patch Type</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Qty</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600 hidden sm:table-cell">Art</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600 hidden sm:table-cell">Email</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Status</th>
              <th className="px-3 py-2.5"></th>
            </tr></thead>
            <tbody>
              {stats.latest.map((q: any) => (
                <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{new Date(q.submittedAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-800">{q.customer?.name}</td>
                  <td className="px-3 py-2.5 text-slate-600 hidden md:table-cell">{q.requirements?.patchType || "—"}</td>
                  <td className="px-3 py-2.5 text-slate-700 font-medium">{q.requirements?.quantity}</td>
                  <td className="px-3 py-2.5 hidden sm:table-cell">{q.artwork?.originalFileName ? <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Uploaded</span> : <span className="text-slate-300">—</span>}</td>
                  <td className="px-3 py-2.5 hidden sm:table-cell">{q.email?.sent ? <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Sent</span> : q.email?.error ? <span className="inline-block rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">Failed</span> : <span className="text-amber-500 text-[10px]">—</span>}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={q.status} /></td>
                  <td className="px-3 py-2.5"><Link href={`/admin/quotes/${q.id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700">View →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/quotes" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Manage Quotes</Link>
        <button onClick={() => window.open("/api/admin/quotes/export", "_blank")} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50">Export CSV</button>
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50">View Website</Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    New: "bg-blue-50 text-blue-700", Reviewed: "bg-slate-100 text-slate-700", Quoted: "bg-emerald-50 text-emerald-700",
    "Waiting for Customer": "bg-amber-50 text-amber-700", "In Production": "bg-violet-50 text-violet-700", Closed: "bg-gray-100 text-gray-500",
  };
  const s = status || "New";
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${colors[s] || colors["New"]}`}>{s}</span>;
}
