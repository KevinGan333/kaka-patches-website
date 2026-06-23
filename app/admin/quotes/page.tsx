"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Quote {
  id: string; quote_number: string; created_at: string; status?: string;
  name: string; email: string; company?: string;
  quantity?: string; patch_type?: string; patch_size?: string; delivery?: string;
  artwork_filename?: string; artwork_url?: string;
  email_sent?: boolean; email_error?: string;
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
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (typeFilter !== "all") params.set("patchType", typeFilter);
        if (emailFilter !== "all") params.set("emailSent", emailFilter);
        if (artworkFilter !== "all") params.set("artworkUploaded", artworkFilter);
        if (sortBy !== "newest") params.set("sort", sortBy);
        const qs = params.toString();
        const res = await fetch(`/api/admin/quotes${qs ? "?" + qs : ""}`);
        if (res.status === 401) { router.push("/admin/login"); return; }
        const data = await res.json();
        setQuotes(data.quotes || []);
      } catch { console.error("Failed to load"); }
      finally { setLoading(false); }
    }
    load();
  }, [router, search, statusFilter, typeFilter, emailFilter, artworkFilter, sortBy]);

  async function quickUpdate(id: string, status: string) {
    await fetch(`/api/admin/quotes/${id}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  }

  const patchTypes = useMemo(() => [...new Set(quotes.map(q => q.patch_type).filter(Boolean))] as string[], [quotes]);

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Quote Requests <span className="text-sm font-normal text-slate-400">({quotes.length})</span></h1>
        <button onClick={() => window.open("/api/admin/quotes/export", "_blank")} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50">Export CSV</button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2.5">
        <input type="text" placeholder="Search name, email, quote #..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-56" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">All Statuses</option>
          {["new","reviewed","quoted","waiting_for_customer","in_production","closed"].map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">All Patch Types</option>
          {patchTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={emailFilter} onChange={e => { setEmailFilter(e.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="all">All Email</option>
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
        </select>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading...</p>}

      {!loading && quotes.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center"><p className="text-slate-400">No quote requests yet.</p></div>
      )}

      {!loading && quotes.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2.5 font-semibold text-slate-600">Date</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Quote #</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Name</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600 hidden md:table-cell">Company</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600 hidden lg:table-cell">Patch Type</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Qty</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Art</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Email</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Status</th>
              <th className="px-3 py-2.5 font-semibold text-slate-600">Actions</th>
            </tr></thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{new Date(q.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-slate-400">{q.quote_number}</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-800">{q.name}</td>
                  <td className="px-3 py-2.5 text-slate-600 hidden md:table-cell">{q.company || "—"}</td>
                  <td className="px-3 py-2.5 text-slate-600 hidden lg:table-cell">{q.patch_type || "—"}</td>
                  <td className="px-3 py-2.5 text-slate-700 font-medium">{q.quantity}</td>
                  <td className="px-3 py-2.5">{q.artwork_filename ? <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Yes</span> : <span className="text-slate-300 text-[10px]">—</span>}</td>
                  <td className="px-3 py-2.5">{q.email_sent ? <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Sent</span> : q.email_error ? <span className="inline-block rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">Failed</span> : <span className="text-amber-500 text-[10px]">—</span>}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={q.status} /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/admin/quotes/${q.id}`} className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-50">View</Link>
                      {(!q.status || q.status === "new") && <button onClick={() => quickUpdate(q.id, "reviewed")} className="rounded border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100">Mark Reviewed</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    reviewed: "bg-slate-100 text-slate-700",
    quoted: "bg-emerald-50 text-emerald-700",
    waiting_for_customer: "bg-amber-50 text-amber-700",
    in_production: "bg-violet-50 text-violet-700",
    closed: "bg-gray-100 text-gray-500",
  };
  const s = status || "new";
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${colors[s] || colors["new"]}`}>{s.replace(/_/g, " ")}</span>;
}
