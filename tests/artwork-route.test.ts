import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mocks = vi.hoisted(() => ({
  verifyAdminSession: vi.fn(),
  getQuoteRequestById: vi.fn(),
  blobGet: vi.fn(),
}));

vi.mock("@/lib/admin/auth", () => ({
  verifyAdminSession: mocks.verifyAdminSession,
}));
vi.mock("@/lib/admin/quote-db", () => ({
  getQuoteRequestById: mocks.getQuoteRequestById,
}));
vi.mock("@vercel/blob", () => ({
  get: mocks.blobGet,
}));

import { GET } from "@/app/api/admin/quotes/[id]/artwork/route";

const ARTWORK_URL = "https://store123.private.blob.vercel-storage.com/quote-artwork/a.png";

function makeQuote(overrides: Record<string, unknown> = {}) {
  return {
    id: "quote-1",
    quote_number: "KPQ-1",
    artwork_filename: "设计稿.png",
    artwork_url: ARTWORK_URL,
    artwork_type: "image/png",
    ...overrides,
  };
}

function callGet(url = "https://example.com/api/admin/quotes/quote-1/artwork") {
  return GET(new Request(url), { params: Promise.resolve({ id: "quote-1" }) });
}

function setPreviewStoreEnv() {
  process.env.VERCEL_ENV = "preview";
  process.env.KAKA_PREVIEW_BLOB_STORE_ID = "store_preview";
  delete process.env.BLOB_STORE_ID;
}

beforeEach(() => {
  vi.resetAllMocks();
  setPreviewStoreEnv();
});

afterEach(() => {
  delete process.env.VERCEL_ENV;
  delete process.env.BLOB_STORE_ID;
  delete process.env.KAKA_PREVIEW_BLOB_STORE_ID;
});

describe("GET /api/admin/quotes/[id]/artwork", () => {
  it("returns 401 when the admin session is invalid", async () => {
    mocks.verifyAdminSession.mockResolvedValue(false);
    const res = await callGet();
    expect(res.status).toBe(401);
    expect(mocks.getQuoteRequestById).not.toHaveBeenCalled();
  });

  it("returns 404 for a missing quote", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(null);
    const res = await callGet();
    expect(res.status).toBe(404);
  });

  it("returns 404 when the quote has no artwork", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote({ artwork_url: null }));
    const res = await callGet();
    expect(res.status).toBe(404);
    expect(mocks.blobGet).not.toHaveBeenCalled();
  });

  it("fetches the stored artwork_url privately", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote());
    mocks.blobGet.mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream(),
      blob: { contentType: "image/png", size: 10 },
    });

    await callGet();

    expect(mocks.blobGet).toHaveBeenCalledTimes(1);
    expect(mocks.blobGet).toHaveBeenCalledWith(
      ARTWORK_URL,
      expect.objectContaining({ access: "private", storeId: "store_preview" })
    );
  });

  it("streams inline for safe raster images with hardening headers", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote({ artwork_type: "image/png" }));
    mocks.blobGet.mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream(),
      blob: { contentType: "image/png", size: 10 },
    });

    const res = await callGet();

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(res.headers.get("Content-Disposition")).toContain("inline;");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("forces non-raster types to download even without ?download", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote({ artwork_type: "application/pdf" }));
    mocks.blobGet.mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream(),
      blob: { contentType: "application/pdf", size: 10 },
    });

    const res = await callGet();
    expect(res.headers.get("Content-Disposition")).toContain("attachment;");
  });

  it("honors ?download=1 with an attachment disposition", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote());
    mocks.blobGet.mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream(),
      blob: { contentType: "image/png", size: 10 },
    });

    const res = await callGet("https://example.com/api/admin/quotes/quote-1/artwork?download=1");
    expect(res.headers.get("Content-Disposition")).toContain("attachment;");
  });

  it("encodes a Chinese filename safely in Content-Disposition", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote());
    mocks.blobGet.mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream(),
      blob: { contentType: "image/png", size: 10 },
    });

    const res = await callGet("https://example.com/api/admin/quotes/quote-1/artwork?download=1");
    const disposition = res.headers.get("Content-Disposition") || "";
    expect(disposition).toContain("filename*=UTF-8''");
    expect(disposition).not.toContain("设计稿");
  });

  it("returns 502 for a storage failure", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote());
    mocks.blobGet.mockRejectedValue(new Error("Vercel Blob: store error"));

    const res = await callGet();
    expect(res.status).toBe(502);
  });

  it("returns 404 when the blob is missing", async () => {
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote());
    mocks.blobGet.mockResolvedValue(null);

    const res = await callGet();
    expect(res.status).toBe(404);
  });

  it("returns 502 when the artwork store ID is missing", async () => {
    delete process.env.VERCEL_ENV;
    delete process.env.KAKA_PREVIEW_BLOB_STORE_ID;
    mocks.verifyAdminSession.mockResolvedValue(true);
    mocks.getQuoteRequestById.mockResolvedValue(makeQuote());

    const res = await callGet();
    expect(res.status).toBe(502);
    expect(mocks.blobGet).not.toHaveBeenCalled();
  });
});
