import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface QuoteData {
  id: string;
  submittedAt: string;
  status?: string;
  statusUpdatedAt?: string;
  adminNotes?: string;
  notes?: { id: string; content: string; createdAt: string }[];
  customer?: { name?: string; email?: string; company?: string };
  requirements?: { quantity?: string; delivery?: string; patchType?: string; patchSize?: string; backing?: string; border?: string; message?: string };
  artwork?: { originalFileName?: string; savedFilePath?: string; fileType?: string; fileSize?: number } | null;
  email?: { sent?: boolean; error?: string; id?: string } | null;
}

function normalize(q: QuoteData): QuoteData {
  return {
    id: q.id || "",
    submittedAt: q.submittedAt || "",
    status: q.status || "New",
    statusUpdatedAt: q.statusUpdatedAt || q.submittedAt || "",
    adminNotes: q.adminNotes || "",
    notes: Array.isArray(q.notes) ? q.notes : [],
    customer: { name: q.customer?.name || "-", email: q.customer?.email || "-", company: q.customer?.company || "-" },
    requirements: {
      quantity: q.requirements?.quantity || "-",
      delivery: q.requirements?.delivery || "-",
      patchType: q.requirements?.patchType || "-",
      patchSize: q.requirements?.patchSize || "-",
      backing: q.requirements?.backing || "-",
      border: q.requirements?.border || "-",
      message: q.requirements?.message || "",
    },
    artwork: q.artwork || null,
    email: q.email || null,
  };
}

const quoteDir = path.join(process.cwd(), "data", "quote-requests");

export async function getAllQuotes(): Promise<QuoteData[]> {
  let files: string[] = [];
  try { files = await readdir(quoteDir); } catch { return []; }
  const quotes = await Promise.all(
    files.filter(f => f.endsWith(".json")).map(async f => {
      try { const c = await readFile(path.join(quoteDir, f), "utf-8"); return JSON.parse(c); } catch { return null; }
    })
  );
  return quotes.filter(Boolean).map(normalize).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function getQuoteById(id: string): Promise<QuoteData | null> {
  try {
    const fp = path.join(quoteDir, `${id}.json`);
    const c = await readFile(fp, "utf-8");
    return normalize(JSON.parse(c));
  } catch { return null; }
}

export async function updateQuoteStatus(id: string, status: string): Promise<QuoteData | null> {
  const q = await getQuoteById(id);
  if (!q) return null;
  q.status = status;
  q.statusUpdatedAt = new Date().toISOString();
  await writeFile(path.join(quoteDir, `${id}.json`), JSON.stringify(q, null, 2), "utf-8");
  return q;
}

export async function addQuoteNote(id: string, content: string): Promise<QuoteData | null> {
  const q = await getQuoteById(id);
  if (!q) return null;
  if (!q.notes) q.notes = [];
  q.notes.unshift({ id: `note-${Date.now()}`, content, createdAt: new Date().toISOString() });
  await writeFile(path.join(quoteDir, `${id}.json`), JSON.stringify(q, null, 2), "utf-8");
  return q;
}

export async function updateQuote(id: string, updates: Partial<QuoteData>): Promise<QuoteData | null> {
  const q = await getQuoteById(id);
  if (!q) return null;
  if (updates.status !== undefined) { q.status = updates.status; q.statusUpdatedAt = new Date().toISOString(); }
  if (updates.adminNotes !== undefined) q.adminNotes = updates.adminNotes;
  if (updates.notes !== undefined) q.notes = updates.notes;
  await writeFile(path.join(quoteDir, `${id}.json`), JSON.stringify(q, null, 2), "utf-8");
  return q;
}
