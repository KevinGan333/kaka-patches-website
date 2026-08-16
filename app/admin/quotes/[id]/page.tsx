"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";

interface QuoteNote {
  id: string;
  content: string;
  created_at?: string;
  createdAt?: string;
}

// Matches flat structure from quote-db.ts
interface Quote {
  id: string;
  quote_number: string;
  name: string;
  email: string;
  company?: string;
  quantity?: string;
  quantity_per_design?: string;
  number_of_designs?: string;
  delivery?: string;
  product_category?: string;
  patch_type?: string;
  patch_size?: string;
  backing?: string;
  border_option?: string;
  design_notes?: string;
  project_type?: string;
  packaging_preference?: string;
  message?: string;
  artwork_filename?: string;
  artwork_url?: string;
  artwork_size?: number;
  artwork_type?: string;
  email_sent?: boolean;
  email_error?: string;
  status?: string;
  notes?: QuoteNote[];
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: string;
  updated_at?: string;
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-2.5 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-slate-800 text-right max-w-[55%]">{value || "—"}</span>
    </div>
  );
}

const statusOptions = ["New", "Reviewed", "Quoted", "Waiting for Customer", "In Production", "Closed"];

const statusMap: Record<string, string> = {
  "New": "new", "Reviewed": "reviewed", "Quoted": "quoted",
  "Waiting for Customer": "waiting_for_customer", "In Production": "in_production", "Closed": "closed",
};
const reverseStatusMap: Record<string, string> = {
  "new": "New", "reviewed": "Reviewed", "quoted": "Quoted",
  "waiting_for_customer": "Waiting for Customer", "in_production": "In Production", "closed": "Closed",
};

export default function QuoteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/admin/quotes/${id}`);
        if (res.status === 401) { router.push("/admin/login"); return; }
        const data = await res.json();
        if (!cancelled && data.quote) {
          setQuote(data.quote);
          setStatus(reverseStatusMap[data.quote.status] || data.quote.status || "New");
        }
      } catch { if (!cancelled) console.error("Load failed"); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [id, router]);

  async function saveStatus(newStatus: string) {
    setSaving(true); setSaved(false);
    await fetch(`/api/admin/quotes/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusMap[newStatus] || newStatus.toLowerCase() }),
    });
    setStatus(newStatus);
    setQuote(prev => prev ? { ...prev, status: statusMap[newStatus] || newStatus.toLowerCase() } : prev);
    setSaved(true); setTimeout(() => setSaved(false), 2000); setSaving(false);
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/quotes/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: noteText.trim() }),
    });
    const data = await res.json();
    if (data.quote) { setQuote(data.quote); setNoteText(""); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><p className="text-slate-400">Loading...</p></div>;
  if (!quote) return <div className="flex min-h-screen items-center justify-center"><div className="text-center"><p className="text-lg font-bold">Quote Not Found</p><Link href="/admin/quotes" className="mt-2 inline-block text-sm text-blue-600">← Back</Link></div></div>;

  const displayName = quote.name || "Unknown";
  const displayEmail = quote.email || "";
  const productCat = quote.product_category || quote.patch_type || "";

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center gap-3 text-sm">
        <Link href="/admin/quotes" className="font-semibold text-blue-600 hover:text-blue-700">← Quotes</Link>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-700">{displayName}</span>
        <span className="text-xs text-slate-400 font-mono">{quote.quote_number}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Quote Summary</h2>
              <StatusBadge status={status} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div><span className="text-slate-400">ID:</span> <span className="font-mono font-semibold">{quote.id}</span></div>
              <div><span className="text-slate-400">Quote #:</span> <span className="font-mono font-semibold">{quote.quote_number}</span></div>
              <div><span className="text-slate-400">Submitted:</span> <span className="font-semibold">{quote.created_at ? new Date(quote.created_at).toLocaleString() : "-"}</span></div>
              <div><span className="text-slate-400">Email:</span> {quote.email_sent ? <span className="text-emerald-600 font-bold">Sent</span> : quote.email_error ? <span className="text-red-500 font-bold">Failed</span> : <span className="text-amber-500">—</span>}</div>
              <div><span className="text-slate-400">Artwork:</span> {quote.artwork_filename ? <span className="text-emerald-600 font-bold">Uploaded</span> : <span className="text-slate-400">None</span>}</div>
              <div><span className="text-slate-400">Source:</span> <span className="font-semibold">{quote.source || "website"}</span></div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Customer</h3>
            <Row label="Name" value={quote.name} />
            <Row label="Email" value={quote.email} />
            <Row label="Company" value={quote.company} />
            <div className="mt-4 flex gap-2">
              <a href={`mailto:${displayEmail}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Send Email</a>
              <button onClick={() => { navigator.clipboard.writeText(displayEmail); }} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Copy Email</button>
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Product Details</h3>
            <Row label="Product Category" value={productCat} />
            <Row label="No. of Designs" value={quote.number_of_designs} />
            <Row label="Qty Per Design" value={quote.quantity_per_design} />
            <Row label="Total Qty" value={quote.quantity} />
            <Row label="Patch / Product Size" value={quote.patch_size} />
            <Row label="Backing" value={quote.backing} />
            <Row label="Border" value={quote.border_option} />
            <Row label="Design Notes" value={quote.design_notes} />
          </div>

          {/* Project Info */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Project Info</h3>
            <Row label="Project Type" value={quote.project_type} />
            <Row label="Packaging" value={quote.packaging_preference} />
            <Row label="Delivery" value={quote.delivery} />
            {quote.message && <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">{quote.message}</div>}
          </div>

          {/* Artwork */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Artwork</h3>
            {quote.artwork_filename ? (
              <div className="space-y-2 text-sm">
                <Row label="Filename" value={quote.artwork_filename} />
                <Row label="Type" value={quote.artwork_type} />
                <Row label="Size" value={quote.artwork_size ? `${(quote.artwork_size / 1024).toFixed(1)} KB` : undefined} />
                <Row label="Blob URL" value={quote.artwork_url} />
              </div>
            ) : <p className="text-sm text-slate-400">No artwork uploaded.</p>}
          </div>

          {/* UTM */}
          {(quote.utm_source || quote.utm_medium || quote.utm_campaign) && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Marketing Attribution</h3>
              <Row label="UTM Source" value={quote.utm_source} />
              <Row label="UTM Medium" value={quote.utm_medium} />
              <Row label="UTM Campaign" value={quote.utm_campaign} />
            </div>
          )}

          {/* System Info */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">System Info</h3>
            <Row label="Quote Number" value={quote.quote_number} />
            <Row label="Created" value={quote.created_at ? new Date(quote.created_at).toLocaleString() : "-"} />
            <Row label="Updated" value={quote.updated_at ? new Date(quote.updated_at).toLocaleString() : "-"} />
            <Row label="Email Sent" value={quote.email_sent ? "Yes" : "No"} />
            {quote.email_error && <Row label="Email Error" value={quote.email_error} />}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Status</h3>
            <div className="space-y-2">
              {statusOptions.map(s => (
                <button key={s} onClick={() => saveStatus(s)} disabled={saving}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                    status === s ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}>{s}</button>
              ))}
            </div>
            {saved && <p className="mt-3 text-xs text-emerald-600 font-semibold">Status saved ✓</p>}
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Internal Notes</h3>
            {quote.notes && quote.notes.length > 0 && (
              <div className="mb-4 space-y-3 max-h-60 overflow-y-auto">
                {quote.notes.map((n) => (
                  <div key={n.id} className="rounded-lg bg-slate-50 p-3 text-xs">
                    <p className="text-slate-700">{n.content}</p>
                    <p className="mt-1 text-slate-400">{new Date(n.created_at || n.createdAt || "").toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Add a note..." />
            <button onClick={addNote} disabled={saving || !noteText.trim()}
              className="mt-2 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40">
              Add Note
            </button>
            {saved && <p className="mt-2 text-xs text-emerald-600 font-semibold">Note saved ✓</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
