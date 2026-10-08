import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mocks = vi.hoisted(() => ({
  createQuoteRequest: vi.fn(),
  updateQuoteEmailStatus: vi.fn(),
  blobPut: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock("@/lib/admin/quote-db", () => ({
  createQuoteRequest: mocks.createQuoteRequest,
  updateQuoteEmailStatus: mocks.updateQuoteEmailStatus,
}));
vi.mock("@vercel/blob", () => ({
  put: mocks.blobPut,
}));

vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.sendEmail }; } }));

import { captureTouch } from "@/lib/attribution";
import { POST } from "@/app/api/quote/route";

function buildFormData(withArtwork: boolean) {
  const form = new FormData();
  form.set("name", "Test Buyer");
  form.set("email", "buyer@example.com");
  form.set("quantity", "100");
  form.set("productCategory", "Custom Embroidered Patches");
  if (withArtwork) {
    form.set("artwork", new File([new Uint8Array([1, 2, 3])], "设计稿.png", { type: "image/png" }));
  }
  return form;
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.VERCEL_ENV = "preview";
  process.env.KAKA_PREVIEW_BLOB_STORE_ID = "store_preview";
});

afterEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.QUOTE_TO_EMAIL;
  delete process.env.QUOTE_FROM_EMAIL;
  delete process.env.VERCEL_ENV;
  delete process.env.BLOB_STORE_ID;
  delete process.env.KAKA_PREVIEW_BLOB_STORE_ID;
});

describe("POST /api/quote artwork upload", () => {
  it("uploads with private access", async () => {
    mocks.blobPut.mockResolvedValue({
      url: "https://store123.private.blob.vercel-storage.com/quote-artwork/art.png",
    });
    mocks.createQuoteRequest.mockResolvedValue({ id: "q1", quote_number: "KPQ-1" });

    const res = await POST(new Request("https://example.com/api/quote", {
      method: "POST",
      body: buildFormData(true),
    }));

    expect(res.status).toBe(200);
    expect(mocks.blobPut).toHaveBeenCalledWith(
      expect.any(String),
      expect.anything(),
      expect.objectContaining({ access: "private", storeId: "store_preview" })
    );
  });

  it("fails loudly and saves zero rows when the private upload fails", async () => {
    mocks.blobPut.mockRejectedValue(
      new Error("Vercel Blob: Cannot use public access on a private store.")
    );

    const res = await POST(new Request("https://example.com/api/quote", {
      method: "POST",
      body: buildFormData(true),
    }));

    expect(res.status).toBe(500);
    expect(mocks.createQuoteRequest).not.toHaveBeenCalled();
  });

  it("fails loudly and saves zero rows when the store ID is missing", async () => {
    delete process.env.VERCEL_ENV;
    delete process.env.KAKA_PREVIEW_BLOB_STORE_ID;

    const res = await POST(new Request("https://example.com/api/quote", {
      method: "POST",
      body: buildFormData(true),
    }));

    expect(res.status).toBe(500);
    expect(mocks.blobPut).not.toHaveBeenCalled();
    expect(mocks.createQuoteRequest).not.toHaveBeenCalled();
  });
});


describe("POST /api/quote attribution", () => {
  it("stores sanitized first/session sources and includes them in notification HTML", async () => {
    process.env.RESEND_API_KEY = "test-only";
    process.env.QUOTE_TO_EMAIL = "owner@example.com";
    process.env.QUOTE_FROM_EMAIL = "website@example.com";
    mocks.createQuoteRequest.mockResolvedValue({ id: "q2", quote_number: "KPQ-2" });
    mocks.sendEmail.mockResolvedValue({ data: { id: "email-2" } });
    const form = buildFormData(false);
    const first = captureTouch("https://www.kakapatches.com/products?utm_source=linkedin&utm_medium=social&utm_campaign=%3Cimg%3E", "", Date.now());
    const session = captureTouch("https://www.kakapatches.com/", "https://www.google.com/", Date.now());
    form.set("attribution", JSON.stringify({ version: 1, first, session, submissionPage: "/request-a-quote" }));
    const res = await POST(new Request("https://www.kakapatches.com/api/quote", { method: "POST", body: form, headers: { "x-real-ip": "attribution-test" } }));
    expect(res.status).toBe(200);
    expect(mocks.createQuoteRequest).toHaveBeenCalledWith(expect.objectContaining({ attribution: expect.objectContaining({ first, session, submissionPage: "/request-a-quote" }) }));
    const html = mocks.sendEmail.mock.calls[0][0].html;
    expect(html).toContain("linkedin / Social media");
    expect(html).toContain("google / Organic search");
    expect(html).toContain("/request-a-quote");
    expect(html).not.toContain("<img>");
  });
  it("accepts old forms without fabricating source data", async () => {
    mocks.createQuoteRequest.mockResolvedValue({ id: "q3", quote_number: "KPQ-3" });
    const res = await POST(new Request("https://www.kakapatches.com/api/quote", { method: "POST", body: buildFormData(false), headers: { "x-real-ip": "legacy-test" } }));
    expect(res.status).toBe(200);
    expect(mocks.createQuoteRequest).toHaveBeenCalledWith(expect.objectContaining({ attribution: null }));
  });
});
