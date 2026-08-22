import { getDb } from "@/lib/db";

export type QuoteStatus = "new" | "reviewed" | "quoted" | "waiting_for_customer" | "in_production" | "closed";

export interface QuoteNote {
  id: string;
  content: string;
  created_at: string;
}

interface QuoteStatsRow {
  total: number;
  new_: number;
  reviewed: number;
  quoted: number;
  in_production: number;
  closed: number;
  email_sent: number;
  email_failed: number;
  artwork_uploaded: number;
  this_week: number;
}

export interface QuoteRequest {
  id: string;
  quote_number: string;
  name: string;
  email: string;
  company?: string;
  quantity?: string;              // kept for backward compat, total estimate
  quantity_per_design?: string;   // pcs per single design
  number_of_designs?: string;     // how many different designs
  delivery?: string;
  product_category?: string;      // replaces patch_type as primary product field
  patch_type?: string;            // kept for backward compat
  patch_size?: string;
  backing?: string;
  border_option?: string;
  design_notes?: string;
  style_reference?: string;
  project_type?: string;
  packaging_preference?: string;
  message?: string;
  artwork_filename?: string;
  artwork_url?: string;
  artwork_size?: number;
  artwork_type?: string;
  email_sent: boolean;
  email_error?: string;
  status: QuoteStatus;
  notes: QuoteNote[];
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  first_landing_page?: string;
  referrer?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteFilters {
  search?: string;
  status?: string;
  patchType?: string;
  emailSent?: string;
  artworkUploaded?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export function generateQuoteNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `KPQ-${date}-${rand}`;
}

export async function createQuoteRequest(data: Partial<QuoteRequest>): Promise<QuoteRequest> {
  const db = getDb();
  const quoteNumber = generateQuoteNumber();
  const result = await db`
    INSERT INTO quote_requests (
      quote_number, name, email, company, quantity, quantity_per_design, number_of_designs, delivery,
      product_category, patch_type, patch_size, backing, border_option, design_notes,
      project_type, packaging_preference, message,
      artwork_filename, artwork_url, artwork_size, artwork_type,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      first_landing_page, referrer,
      style_reference, status
    ) VALUES (
      ${quoteNumber}, ${data.name || ""}, ${data.email || ""}, ${data.company || ""},
      ${data.quantity || ""}, ${data.quantity_per_design || ""}, ${data.number_of_designs || ""},
      ${data.delivery || ""}, ${data.product_category || ""},
      ${data.patch_type || ""}, ${data.patch_size || ""}, ${data.backing || ""},
      ${data.border_option || ""}, ${data.design_notes || ""},
      ${data.project_type || ""}, ${data.packaging_preference || ""}, ${data.message || ""},
      ${data.artwork_filename || null}, ${data.artwork_url || null},
      ${data.artwork_size || null}, ${data.artwork_type || null},
      ${data.utm_source || null}, ${data.utm_medium || null}, ${data.utm_campaign || null},
      ${data.utm_content || null}, ${data.utm_term || null},
      ${data.first_landing_page || null}, ${data.referrer || null},
      ${data.style_reference || null},
      ${data.status || "new"}
    )
    RETURNING *
  `;
  return result[0] as unknown as QuoteRequest;
}

export async function getAllQuoteRequests(filters?: QuoteFilters): Promise<QuoteRequest[]> {
  const db = getDb();
  let query = db`SELECT * FROM quote_requests WHERE 1=1`;

  if (filters?.search) {
    const s = `%${filters.search}%`;
    query = db`${query} AND (quote_number ILIKE ${s} OR name ILIKE ${s} OR email ILIKE ${s} OR company ILIKE ${s} OR product_category ILIKE ${s} OR patch_type ILIKE ${s})`;
  }
  if (filters?.status && filters.status !== "all") {
    query = db`${query} AND status = ${filters.status}`;
  }
  if (filters?.patchType && filters.patchType !== "all") {
    query = db`${query} AND (product_category = ${filters.patchType} OR patch_type = ${filters.patchType})`;
  }
  if (filters?.emailSent === "sent") {
    query = db`${query} AND email_sent = true`;
  } else if (filters?.emailSent === "failed") {
    query = db`${query} AND email_sent = false AND email_error IS NOT NULL`;
  } else if (filters?.emailSent === "not_sent") {
    query = db`${query} AND email_sent = false AND email_error IS NULL`;
  }
  if (filters?.artworkUploaded === "uploaded") {
    query = db`${query} AND artwork_url IS NOT NULL`;
  } else if (filters?.artworkUploaded === "missing") {
    query = db`${query} AND artwork_url IS NULL`;
  }

  const sort = filters?.sort || "newest";
  if (sort === "oldest") query = db`${query} ORDER BY created_at ASC`;
  else query = db`${query} ORDER BY created_at DESC`;

  if (filters?.limit) {
    query = db`${query} LIMIT ${filters.limit}`;
    if (filters.offset) query = db`${query} OFFSET ${filters.offset}`;
  }

  return (await query) as unknown as QuoteRequest[];
}

export async function getQuoteRequestById(id: string): Promise<QuoteRequest | null> {
  const db = getDb();
  const result = await db`SELECT * FROM quote_requests WHERE id = ${id}`;
  return (result[0] || null) as unknown as QuoteRequest | null;
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<QuoteRequest | null> {
  const db = getDb();
  const result = await db`
    UPDATE quote_requests SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] || null) as unknown as QuoteRequest | null;
}

export async function addQuoteNote(id: string, content: string): Promise<QuoteRequest | null> {
  const db = getDb();
  const note = { id: `note-${Date.now()}`, content, created_at: new Date().toISOString() };
  const result = await db`
    UPDATE quote_requests
    SET notes = COALESCE(notes, '[]'::jsonb) || ${JSON.stringify([note])}::jsonb,
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return (result[0] || null) as unknown as QuoteRequest | null;
}

export async function updateQuoteEmailStatus(id: string, emailSent: boolean, emailError?: string): Promise<void> {
  const db = getDb();
  await db`
    UPDATE quote_requests
    SET email_sent = ${emailSent}, email_error = ${emailError || null}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function getQuoteStats(): Promise<{
  total: number; new_: number; reviewed: number; quoted: number;
  waiting: number; inProduction: number; closed: number;
  emailSent: number; emailFailed: number; artworkUploaded: number; thisWeek: number;
}> {
  const db = getDb();
  const result = await db`
    SELECT
      COUNT(*)::int as total,
      COUNT(*) FILTER (WHERE status = 'new')::int as new_,
      COUNT(*) FILTER (WHERE status = 'reviewed')::int as reviewed,
      COUNT(*) FILTER (WHERE status = 'quoted')::int as quoted,
      COUNT(*) FILTER (WHERE status = 'waiting_for_customer')::int as waiting,
      COUNT(*) FILTER (WHERE status = 'in_production')::int as in_production,
      COUNT(*) FILTER (WHERE status = 'closed')::int as closed,
      COUNT(*) FILTER (WHERE email_sent = true)::int as email_sent,
      COUNT(*) FILTER (WHERE email_sent = false AND email_error IS NOT NULL)::int as email_failed,
      COUNT(*) FILTER (WHERE artwork_url IS NOT NULL)::int as artwork_uploaded,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int as this_week
    FROM quote_requests
  `;
  const r = result[0] as QuoteStatsRow;
  return {
    total: r.total, new_: r.new_, reviewed: r.reviewed, quoted: r.quoted,
    waiting: r.in_production, inProduction: r.in_production, closed: r.closed,
    emailSent: r.email_sent, emailFailed: r.email_failed,
    artworkUploaded: r.artwork_uploaded, thisWeek: r.this_week,
  };
}

export async function exportQuoteRequestsCsv(): Promise<string> {
  const db = getDb();
  const rows = await db`SELECT * FROM quote_requests ORDER BY created_at DESC` as unknown as QuoteRequest[];
  const header = "Quote Number,Date,Status,Name,Email,Company,Product Category,Patch Size,Backing,Border,Designs,Qty/Design,Total Qty,Delivery,Project Type,Packaging,Message,Artwork,Email Sent,UTM Source,UTM Medium,UTM Campaign,Notes";
  const csvRows = rows.map(r => [
    r.quote_number, r.created_at, r.status, r.name, r.email,
    r.company, r.product_category || r.patch_type, r.patch_size, r.backing, r.border_option,
    r.number_of_designs, r.quantity_per_design, r.quantity,
    r.delivery, r.project_type, r.packaging_preference, r.message,
    r.artwork_filename || "",
    r.email_sent ? "Yes" : "No",
    r.utm_source || "", r.utm_medium || "", r.utm_campaign || "",
    (r.notes || []).map((n) => `[${n.created_at}] ${n.content}`).join(" | "),
  ].map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(","));
  return [header, ...csvRows].join("\n");
}
