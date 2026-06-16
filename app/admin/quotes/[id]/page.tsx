"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";

interface Quote {
  id: string; submittedAt: string; status?: string; statusUpdatedAt?: string;
  customer?: { name?: string; email?: string; company?: string };
  requirements?: { quantity?: string; delivery?: string; patchType?: string; patchSize?: string; backing?: string; border?: string; message?: string };
  artwork?: { originalFileName?: string; savedFilePath?: string; fileType?: string; fileSize?: number } | null;
  email?: { sent?: boolean; error?: string; id?: string } | null;
  adminNotes?: string; notes?: { id: string; content: string; createdAt: string }[];
}

const statusOptions = ["New", "Reviewed", "Quoted", "Waiting for Customer", "In Production", "Closed"];

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

  useEffect(() => { loadQuote(); }, [id]);

  async function loadQuote() {
    try {
      const res = await fetch(`/api/admin/quotes/${id}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (data.quote) { setQuote(data.quote); setStatus(data.quote.status || "New"); }
    } catch { console.error("Load failed"); }
    finally { setLoading(false); }
  }

  async function saveStatus(newStatus: string) {
    setSaving(true); setSaved(false);
    await fetch(`/api/admin/quotes/${id}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setStatus(newStatus);
    setQuote(prev => prev ? { ...prev, status: newStatus, statusUpdatedAt: new Date().toISOString() } : prev);
    setSaved(true); setTimeout(() => setSaved(false), 2000); setSaving(false);
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/quotes/${id}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: noteText.trim() }) });
    const data = await res.json();
    if (data.quote) { setQuote(data.quote); setNoteText(""); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><p className="text-slate-400">Loading...</p></div>;
  if (!quote) return <div className="flex min-h-screen items-center justify-center"><div className="text-center"><p className="text-lg font-bold">Quote Not Found</p><Link href="/admin/quotes" className="mt-2 inline-block text-sm text-blue-600">← Back</Link></div></div>;

  const Row = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex justify-between border-b border-slate-100 py-2.5 text-sm"><span className="font-semibold text-slate-500">{label}</span><span className="text-slate-800 text-right max-w-[55%]">{value || "—"}</span></div>
  );

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center gap-3 text-sm"><Link href="/admin/quotes" className="font-semibold text-blue-600 hover:text-blue-700">← Quotes</Link><span className="text-slate-300">/</span><span className="font-bold text-slate-700">{quote.customer?.name}</span></div>

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
              <div><span className="text-slate-400">Submitted:</span> <span className="font-semibold">{new Date(quote.submittedAt).toLocaleString()}</span></div>
              <div><span className="text-slate-400">Email:</span> {quote.email?.sent ? <span className="text-emerald-600 font-bold">Sent</span> : quote.email?.error ? <span className="text-red-500 font-bold">Failed</span> : <span className="text-amber-500">—</span>}</div>
              <div><span className="text-slate-400">Artwork:</span> {quote.artwork?.originalFileName ? <span className="text-emerald-600 font-bold">Uploaded</span> : <span className="text-slate-400">None</span>}</div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Customer</h3>
            <Row label="Name" value={quote.customer?.name} />
            <Row label="Email" value={quote.customer?.email} />
            <Row label="Company" value={quote.customer?.company} />
            <div className="mt-4 flex gap-2">
              <a href={`mailto:${quote.customer?.email}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Send Email</a>
              <button onClick={() => { navigator.clipboard.writeText(quote.customer?.email || ""); }} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Copy Email</button>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Patch Requirements</h3>
            <Row label="Patch Type" value={quote.requirements?.patchType} />
            <Row label="Patch Size" value={quote.requirements?.patchSize} />
            <Row label="Backing" value={quote.requirements?.backing} />
            <Row label="Border" value={quote.requirements?.border} />
            <Row label="Quantity" value={quote.requirements?.quantity} />
            <Row label="Delivery" value={quote.requirements?.delivery} />
            {quote.requirements?.message && <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">{quote.requirements.message}</div>}
          </div>

          {/* Artwork */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Artwork</h3>
            {quote.artwork ? (
              <div className="space-y-2 text-sm">
                <Row label="Filename" value={quote.artwork.originalFileName} />
                <Row label="Type" value={quote.artwork.fileType} />
                <Row label="Size" value={quote.artwork.fileSize ? `${(quote.artwork.fileSize / 1024).toFixed(1)} KB` : undefined} />
                <Row label="Saved Path" value={quote.artwork.savedFilePath} />
              </div>
            ) : <p className="text-sm text-slate-400">No artwork uploaded.</p>}
          </div>

          {/* System Info */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">System Info</h3>
            <Row label="JSON File" value={`${quote.id}.json`} />
            <Row label="Status Updated" value={quote.statusUpdatedAt ? new Date(quote.statusUpdatedAt).toLocaleString() : "—"} />
            <Row label="Email Sent" value={quote.email?.sent ? "Yes" : "No"} />
            {quote.email?.error && <Row label="Email Error" value={quote.email.error} />}
            {quote.email?.id && <Row label="Email ID" value={quote.email.id} />}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Status</h3>
            <div className="space-y-2">
              {statusOptions.map(s => (
                <button key={s} onClick={() => saveStatus(s)} disabled={saving} className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${status === s ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{s}</button>
              ))}
            </div>
            {saved && <p className="mt-3 text-xs text-emerald-600 font-semibold">Status saved ✓</p>}
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Internal Notes</h3>
            {quote.notes && quote.notes.length > 0 && (
              <div className="mb-4 space-y-3 max-h-60 overflow-y-auto">
                {quote.notes.map(n => (
                  <div key={n.id} className="rounded-lg bg-slate-50 p-3 text-xs"><p className="text-slate-700">{n.content}</p><p className="mt-1 text-slate-400">{new Date(n.createdAt).toLocaleString()}</p></div>
                ))}
              </div>
            )}
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Add a note..." />
            <button onClick={addNote} disabled={saving || !noteText.trim()} className="mt-2 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40">Add Note</button>
            {saved && <p className="mt-2 text-xs text-emerald-600 font-semibold">Note saved ✓</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
