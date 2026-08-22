"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminArtworkEndpoint, isPreviewableImage } from "@/lib/admin/artwork";

// ── Data model ────────────────────────────────────────────────────────────────
// The detail API (`GET /api/admin/quotes/[id]`) returns the raw flat snake_case
// Postgres row from `getQuoteRequestById()` (SELECT *). Every field below mirrors
// that row. Optional fields that only exist on newer schemas (utm_*, product_category,
// packaging_preference, etc.) are declared so the page stays forward-compatible and
// simply renders "Not provided" when a column is absent on this database.
interface QuoteNote {
  id: string;
  content: string;
  created_at?: string;
}

// ── Data model ────────────────────────────────────────────────────────────────
// The detail API (`GET /api/admin/quotes/[id]`) returns the raw flat snake_case
// Postgres row from `getQuoteRequestById()` (SELECT *). Every field below mirrors
// that row. Optional fields that only exist on newer schemas (utm_*, product_category,
// packaging_preference, etc.) are declared so the page stays forward-compatible and
// simply renders "Not provided" when a column is absent on this database.
interface QuoteNote {
  id: string;
  content: string;
  created_at?: string;
}

interface Quote {
  id: string;
  quote_number: string;
  name: string;
  email: string;
  company?: string | null;
  quantity?: string | null;
  quantity_per_design?: string | null;
  number_of_designs?: string | null;
  delivery?: string | null;
  product_category?: string | null;
  patch_type?: string | null;
  patch_size?: string | null;
  backing?: string | null;
  border_option?: string | null;
  design_notes?: string | null;
  style_reference?: string | null;
  project_type?: string | null;
  packaging_preference?: string | null;
  message?: string | null;
  artwork_filename?: string | null;
  artwork_url?: string | null;
  artwork_size?: number | null;
  artwork_type?: string | null;
  email_sent?: boolean | null;
  email_error?: string | null;
  status?: string;
  notes?: QuoteNote[];
  source?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  first_landing_page?: string | null;
  referrer?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ── UI helpers ────────────────────────────────────────────────────────────────

const EMPTY = "Not provided";

function Row({ label, value }: { label: string; value?: string | number | null }) {
  const has = value !== undefined && value !== null && String(value).trim() !== "";
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 text-sm last:border-0">
      <span className="shrink-0 font-semibold text-slate-500">{label}</span>
      <span className={`break-words text-right ${has ? "text-slate-800" : "italic text-slate-400"}`}>
        {has ? String(value) : EMPTY}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-base font-bold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}

function formatBytes(size?: number | null): string | null {
  if (size === undefined || size === null) return null;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
}

const PREVIEWABLE_TYPES = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

function isPreviewableImage(artworkType?: string | null, filename?: string | null): boolean {
  const mime = (artworkType || "").toLowerCase();
  if (mime.startsWith("image/")) {
    return true;
  }
  const ext = (filename || "").split(".").pop()?.toLowerCase() || "";
  return PREVIEWABLE_TYPES.includes(ext);
}

function datetime(value?: string | null): string {
  if (!value) return EMPTY;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

// ── Status mapping (DB stores snake_case; API validates snake_case) ────────────
const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "New", value: "new" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Quoted", value: "quoted" },
  { label: "Waiting for Customer", value: "waiting_for_customer" },
  { label: "In Production", value: "in_production" },
  { label: "Closed", value: "closed" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function QuoteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/quotes/${id}`);
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return;
        }
        if (res.status === 404) {
          if (!cancelled) { setQuote(null); setError("not_found"); }
          return;
        }
        if (!res.ok) {
          if (!cancelled) setError("unable");
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          if (data.quote) {
            setQuote(data.quote);
            setStatus(data.quote.status || "new");
          } else {
            setError("not_found");
          }
        }
      } catch {
        if (!cancelled) setError("unable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, router]);

  async function saveStatus(newStatus: string) {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/quotes/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        setQuote((prev) => (prev ? { ...prev, status: newStatus } : prev));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      /* status save is non-blocking */
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteText.trim() }),
      });
      const data = await res.json();
      if (data.quote) {
        setQuote(data.quote);
        setNoteText("");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      /* note save is non-blocking */
    } finally {
      setSaving(false);
    }
  }

  // ── Explicit UI states ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading inquiry…</p>
      </div>
    );
  }

  if (error === "not_found" || (!quote && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-800">Inquiry not found</p>
          <p className="mt-1 text-sm text-slate-400">The inquiry may have been removed, or the link is invalid.</p>
          <Link href="/admin/quotes" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            ← Back to Quotes
          </Link>
        </div>
      </div>
    );
  }

  if (error === "unable") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-800">Unable to load inquiry details</p>
          <p className="mt-1 text-sm text-slate-400">Something went wrong while fetching this inquiry.</p>
          <Link href="/admin/quotes" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            ← Back to Quotes
          </Link>
        </div>
      </div>
    );
  }

  // quote is guaranteed non-null here
  const q = quote as Quote;
  const product = q.product_category || q.patch_type || null;
  const artworkPresent = Boolean(q.artwork_filename || q.artwork_url);
  const previewable = isPreviewableImage(q.artwork_type, q.artwork_filename);
  const artworkEndpoint = adminArtworkEndpoint(id);
  const artworkDownloadEndpoint = adminArtworkEndpoint(id, true);

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link href="/admin/quotes" className="font-semibold text-blue-600 hover:text-blue-700">← Quotes</Link>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-700">{q.name || "Unknown"}</span>
        <span className="text-xs font-mono text-slate-400">{q.quote_number}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main column ── */}
        <div className="space-y-6 lg:col-span-2">
          {/* A. Inquiry Identity */}
          <Section title="Inquiry Identity">
            <Row label="Inquiry number" value={q.quote_number} />
            <Row label="Database ID" value={q.id} />
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 text-sm last:border-0">
              <span className="shrink-0 font-semibold text-slate-500">Status</span>
              <StatusBadge status={q.status} />
            </div>
            <Row label="Submission date" value={datetime(q.created_at)} />
            <Row label="Source page" value={q.source} />
            <Row label="Email delivery" value={q.email_sent ? "Sent" : q.email_error ? "Failed" : "Not sent"} />
            {q.email_error && <Row label="Email error" value={q.email_error} />}
          </Section>

          {/* B. Contact Details */}
          <Section title="Contact Details">
            <Row label="Name" value={q.name} />
            <Row label="Company" value={q.company} />
            <Row label="Email" value={q.email} />
            <Row label="Phone" value={null} />
            <Row label="Country / region" value={null} />
            <div className="mt-4 flex gap-2">
              <a href={`mailto:${q.email}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Send Email</a>
              <button onClick={() => { navigator.clipboard?.writeText(q.email); }} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Copy Email</button>
            </div>
          </Section>

          {/* C. Project Requirements */}
          <Section title="Project Requirements">
            <Row label="Product / category" value={product} />
            <Row label="Quantity" value={q.quantity} />
            <Row label="No. of designs" value={q.number_of_designs} />
            <Row label="Qty per design" value={q.quantity_per_design} />
            <Row label="Size" value={q.patch_size} />
            <Row label="Backing / attachment" value={q.backing} />
            <Row label="Border / edge finish" value={q.border_option} />
            <Row label="Packaging" value={q.packaging_preference} />
            <Row label="Design notes" value={q.design_notes} />
            <Row label="Project type" value={q.project_type} />
            <Row label="Required delivery date" value={q.delivery} />
          </Section>

          {/* D. Customer Message */}
          <Section title="Customer Message">
            {q.message ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{q.message}</p>
            ) : (
              <p className="text-sm italic text-slate-400">{EMPTY}</p>
            )}
          </Section>

          {/* E. Artwork */}
          <Section title="Artwork">
            {artworkPresent ? (
              <div className="space-y-4">
                <Row label="Filename" value={q.artwork_filename} />
                <Row label="File type" value={q.artwork_type} />
                <Row label="File size" value={formatBytes(q.artwork_size)} />
                {q.artwork_url && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={artworkEndpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Open Artwork
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                    <a
                      href={artworkDownloadEndpoint}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Download
                    </a>
                  </div>
                )}
                {q.artwork_url && previewable ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={artworkEndpoint} alt={q.artwork_filename || "Uploaded artwork"} className="max-h-96 w-full object-contain" />
                  </div>
                ) : (
                  q.artwork_url && (
                    <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                      This file type cannot be previewed in the browser. Use{" "}
                      <a href={artworkEndpoint} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:text-blue-700">
                        Open Artwork
                      </a>{" "}
                      to view or download it.
                    </p>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm italic text-slate-400">No artwork provided</p>
            )}
          </Section>

          {/* F. Attribution */}
          <Section title="Attribution">
            <Row label="UTM source" value={q.utm_source} />
            <Row label="UTM medium" value={q.utm_medium} />
            <Row label="UTM campaign" value={q.utm_campaign} />
            <Row label="UTM content" value={q.utm_content} />
            <Row label="UTM term" value={q.utm_term} />
            <Row label="Referrer" value={q.referrer} />
            <Row label="Landing page" value={q.first_landing_page} />
          </Section>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-base font-bold text-slate-900">Status</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => saveStatus(s.value)}
                  disabled={saving}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                    status === s.value ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {saved && <p className="mt-3 text-xs font-semibold text-emerald-600">Status saved ✓</p>}
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-base font-bold text-slate-900">Internal Notes</h3>
            {q.notes && q.notes.length > 0 && (
              <div className="mb-4 max-h-60 space-y-3 overflow-y-auto">
                {q.notes.map((n) => (
                  <div key={n.id} className="rounded-lg bg-slate-50 p-3 text-xs">
                    <p className="whitespace-pre-wrap text-slate-700">{n.content}</p>
                    <p className="mt-1 text-slate-400">{datetime(n.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Add a note..."
            />
            <button
              onClick={addNote}
              disabled={saving || !noteText.trim()}
              className="mt-2 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
            >
              Add Note
            </button>
            {saved && <p className="mt-2 text-xs font-semibold text-emerald-600">Note saved ✓</p>}
          </div>

          {/* System */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-base font-bold text-slate-900">System Info</h3>
            <Row label="Created" value={datetime(q.created_at)} />
            <Row label="Updated" value={datetime(q.updated_at)} />
            <Row label="Email sent" value={q.email_sent ? "Yes" : "No"} />
          </div>
        </div>
      </div>
    </div>
  );
}
