import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getArtworkBlobStoreId } from "@/lib/admin/artwork-store";

const ENV_KEYS = ["VERCEL_ENV", "BLOB_STORE_ID", "KAKA_PREVIEW_BLOB_STORE_ID"] as const;

let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = {};
  for (const key of ENV_KEYS) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("getArtworkBlobStoreId", () => {
  it("selects BLOB_STORE_ID in Production", () => {
    process.env.VERCEL_ENV = "production";
    process.env.BLOB_STORE_ID = "store_prod";
    expect(getArtworkBlobStoreId()).toBe("store_prod");
  });

  it("selects KAKA_PREVIEW_BLOB_STORE_ID in Preview", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.KAKA_PREVIEW_BLOB_STORE_ID = "store_preview";
    expect(getArtworkBlobStoreId()).toBe("store_preview");
  });

  it("selects KAKA_PREVIEW_BLOB_STORE_ID in Development and when VERCEL_ENV is unset", () => {
    process.env.VERCEL_ENV = "development";
    process.env.KAKA_PREVIEW_BLOB_STORE_ID = "store_preview";
    expect(getArtworkBlobStoreId()).toBe("store_preview");

    delete process.env.VERCEL_ENV;
    expect(getArtworkBlobStoreId()).toBe("store_preview");
  });

  it("never falls back to the Production store in Preview", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.BLOB_STORE_ID = "store_prod";
    // KAKA_PREVIEW_BLOB_STORE_ID intentionally left unset.
    expect(() => getArtworkBlobStoreId()).toThrow(/KAKA_PREVIEW_BLOB_STORE_ID/);
  });

  it("never selects the Preview store in Production", () => {
    process.env.VERCEL_ENV = "production";
    process.env.KAKA_PREVIEW_BLOB_STORE_ID = "store_preview";
    // BLOB_STORE_ID intentionally left unset.
    expect(() => getArtworkBlobStoreId()).toThrow(/BLOB_STORE_ID/);
  });

  it("throws a controlled error when the required store ID is missing", () => {
    process.env.VERCEL_ENV = "production";
    expect(() => getArtworkBlobStoreId()).toThrow(/not configured/);
  });
});
