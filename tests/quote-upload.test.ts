import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mocks = vi.hoisted(() => ({
  createQuoteRequest: vi.fn(),
  updateQuoteEmailStatus: vi.fn(),
  blobPut: vi.fn(),
}));

vi.mock("@/lib/admin/quote-db", () => ({
  createQuoteRequest: mocks.createQuoteRequest,
  updateQuoteEmailStatus: mocks.updateQuoteEmailStatus,
}));
vi.mock("@vercel/blob", () => ({
  put: mocks.blobPut,
}));

import { POST } from "@/app/api/quote/route";

function buildFormData(withArtwork: boolean) {
  const form = new FormData();
  form.set("name", "Test Buyer");
  form.set("email", "buyer@example.com");
  form.set("quantity", "100");
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
