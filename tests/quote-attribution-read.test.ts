import { beforeEach, describe, expect, it, vi } from "vitest";
import { captureTouch } from "@/lib/attribution";
import { getAllQuoteRequests, getQuoteRequestById, exportQuoteRequestsCsv, updateQuoteStatus, addQuoteNote } from "@/lib/admin/quote-db";

const { db } = vi.hoisted(() => ({ db: vi.fn() }));
vi.mock("@/lib/db", () => ({ getDb: () => db }));

const touch = captureTouch("https://www.kakapatches.com/products", "https://www.google.com/", Date.parse("2026-10-08T13:00:00Z"));
const attribution = { version: 1, first: touch, session: touch, submissionPage: "/request-a-quote" };
const row = { id: "existing-inquiry", name: "Customer", message: "Keep original requirements", notes: [], first_landing_page: "/products" };

beforeEach(() => db.mockReset());

describe("reading attribution from stored inquiries", () => {
  it.each([null, undefined, {}, { version: 1 }, { version: 1, first: touch }, { version: 1, session: touch }, "{}", "invalid JSON"])("keeps inquiries readable with absent or incomplete attribution: %j", async raw => {
    const record = { ...row, attribution: raw };
    // The query builder returns a thenable SQL query; these unfiltered reads
    // only need its resolved rows.
    db.mockResolvedValue([record]);
    const detail = await getQuoteRequestById(row.id);
    expect(detail).toEqual({ ...row, attribution: null });
    expect(await getAllQuoteRequests()).toEqual([detail]);
    expect(await updateQuoteStatus(row.id, "reviewed")).toEqual(detail);
    expect(await addQuoteNote(row.id, "Follow up")).toEqual(detail);
    const csv = await exportQuoteRequestsCsv();
    expect(csv).toContain("Unknown (not recorded)");
    expect(csv).toContain("Keep original requirements");
    expect(csv).toContain('"/products"');
    expect(record.attribution).toEqual(raw);
  });

  it.each([attribution, JSON.stringify(attribution)])("preserves recorded channels from object or serialized JSON", async raw => {
    db.mockResolvedValue([{ ...row, attribution: raw }]);
    expect((await getQuoteRequestById(row.id))?.attribution).toEqual(attribution);
    expect((await getAllQuoteRequests())[0].attribution).toEqual(attribution);
    expect(await exportQuoteRequestsCsv()).toContain("google / Organic search");
  });

  it("keeps a missing inquiry distinct from missing attribution", async () => {
    db.mockResolvedValue([]);
    expect(await getQuoteRequestById("missing")).toBeNull();
  });
});
