"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";

interface Quote {
  id: string; submittedAt: string; status?: string;
  customer?: { name?: string; email?: string; company?: string };
  requirements?: { quantity?: string; patchType?: string; patchSize?: string; delivery?: string };
  artwork?: { originalFileName?: string } | null;
  email?: { sent?: boolean; error?: string } | null;
}

export default function AdminQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [emailFilter, setEmailFilter] = useState("all");
  const [artworkFilter, setArtworkFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const perPage = 20;

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

  async function quickUpdate(id: string, status: string) {
    await fetch(`/api/admin/quotes/${id}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  }

  const filtered = useMemo(() => {
    let list = [...quotes];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(q =>
        q.id.toLowerCase().includes(s) || (q.customer?.name || "").toLowerCase().includes(s) ||
        (q.customer?.email || "").toLowerCase().includes(s) || (q.customer?.company || "").toLowerCase().includes(s) ||
        (q.requirements?.patchType || "").toLowerCase().includes(s)
      );
    }
    if (statusFilter !== "all") list = list.filter(q => (q.status || "New") === statusFilter);
    if (typeFilter !== "all") list = list.filter(q => q.requirements?.patchType === typeFilter);
    if (emailFilter === "sent") list = list.filter(q => q.email?.sent === true);
    else if (emailFilter === "failed") list = list.filter(q => q.email?.sent === false && q.email?.error);
    else if (emailFilter === "not_sent") list = list.filter(q => !q.email?.sent && !q.email?.error);
    if (artworkFilter === "uploaded") list = list.filter(q => q.artwork?.originalFileName);
    else if (artworkFilter === "missing") list = list.filter(q => !q.artwork?.originalFileName);

    if (sortBy === "oldest") list.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    else if (sortBy === "qty-high") list.sort((a, b) => Number(b.requirements?.quantity || 0) - Number(a.requirements?.quantity || 0));
    else if (sortBy === "qty-low") list.sort((a, b) => Number(a.requirements?.quantity || 0) - Number(b.requirements?.quantity || 0));

    return list;
  }, [quotes, search, statusFilter, typeFilter, emailFilter, artworkFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const patchTypes = useMemo(() => [...new Set(quotes.map(q => q.requirements?.patchType).filter(Boolean))] as string[], [quotes]);

  function shortId(id: string) { return id.length > 16 ? id.slice(0, 12) + "..." : id; }

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quote Requests <span className="text-sm font-normal text-slate-400">({filtered.length})</span></h1>
        <button onClick={() => window.open("/api/admin/quotes/export", "_blank")} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50">Export CSV</button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2.5">
        <input type="text" placeholder="Search name, email, company, ID..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-56" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">All Statuses</option>
          {["New","Reviewed","Quoted","Waiting for Customer","In Production","Closed"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">All Patch Types</option>
          {patchTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={emailFilter} onChange={e => { setEmailFilter(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">All Email Status</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="not_sent">Not Sent</option>
        </select>
        <select value={artworkFilter} onChange={e => { setArtworkFilter(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">All Artwork</option>
          <option value="uploaded">Uploaded</option>
          <option value="missing">Missing</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="qty-high">Qty: High to Low</option>
          <option value="qty-low">Qty: Low to High</option>
        </select>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading...</p>}

      {!loading && filtered.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center"><p className="text-slate-400">No quote requests match your filters.</p></div>
      )}

      {!loading && filtered.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-3 py-2.5 font-semibold text-slate-600">Date</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600">Quote ID</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600">Name</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600 hidden md:table-cell">Company</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600">Qty</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600 hidden lg:table-cell">Patch Type</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600">Art</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600">Email</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600">Status</th>
                <th className="px-3 py-2.5 font-semibold text-slate-600">Actions</th>
              </tr></thead>
              <tbody>
                {paged.map(q => (
                  <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{new Date(q.submittedAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-slate-400" title={q.id}>{shortId(q.id)}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">{q.customer?.name}</td>
                    <td className="px-3 py-2.5 text-slate-600 hidden md:table-cell">{q.customer?.company || "—"}</td>
                    <td className="px-3 py-2.5 text-slate-700 font-medium">{q.requirements?.quantity}</td>
                    <td className="px-3 py-2.5 text-slate-600 hidden lg:table-cell">{q.requirements?.patchType || "—"}</td>
                    <td className="px-3 py-2.5">{q.artwork?.originalFileName ? <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Yes</span> : <span className="text-slate-300 text-[10px]">—</span>}</td>
                    <td className="px-3 py-2.5">{q.email?.sent ? <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Sent</span> : q.email?.error ? <span className="inline-block rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">Failed</span> : <span className="text-amber-500 text-[10px]">—</span>}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={q.status} /></td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/quotes/${q.id}`} className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 hover:border-blue-200">View</Link>
                        {(!q.status || q.status === "New") && <button onClick={() => quickUpdate(q.id, "Reviewed")} className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100">Mark Reviewed</button>}
                        {(q.status && q.status !== "Quoted" && q.status !== "Closed") && <button onClick={() => quickUpdate(q.id, "Quoted")} className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 hidden lg:inline">Mark Quoted</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
