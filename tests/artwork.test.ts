import { describe, it, expect } from "vitest";
import {
  sanitizeDownloadFilename,
  buildContentDisposition,
  isInlineRenderableContentType,
  isPreviewableImage,
  resolveContentType,
  adminArtworkEndpoint,
} from "@/lib/admin/artwork";

describe("sanitizeDownloadFilename", () => {
  it("strips CR/LF and other header-injection characters", () => {
    expect(sanitizeDownloadFilename("a\r\nb")).toBe("ab");
    expect(sanitizeDownloadFilename("a\nb\rc")).toBe("abc");
    expect(sanitizeDownloadFilename("bad\x00name\x1f")).toBe("badname");
  });

  it("replaces quotes and backslashes", () => {
    expect(sanitizeDownloadFilename('a"b\\c')).toBe("a_b_c");
  });

  it("falls back to a neutral name when empty", () => {
    expect(sanitizeDownloadFilename("")).toBe("artwork");
    expect(sanitizeDownloadFilename("\r\n")).toBe("artwork");
  });
});

describe("buildContentDisposition", () => {
  it("emits inline for non-attachment and attachment for download", () => {
    expect(buildContentDisposition("art.png", false)).toContain("inline;");
    expect(buildContentDisposition("art.png", true)).toContain("attachment;");
  });

  it("encodes Chinese filenames with RFC 5987 filename*", () => {
    const value = buildContentDisposition("设计稿.png", true);
    expect(value).toContain("attachment;");
    expect(value).toContain("filename*=UTF-8''");
    // The encoded Chinese characters must not appear raw in the header.
    expect(value).not.toContain("设计稿");
  });

  it("strips CR/LF so the value cannot terminate the header", () => {
    const value = buildContentDisposition("evil\r\nX-Evil: 1.png", true);
    expect(value).not.toContain("\r");
    expect(value).not.toContain("\n");
  });
});

describe("isInlineRenderableContentType", () => {
  it("allows safe raster image types", () => {
    for (const mime of ["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif", "image/bmp"]) {
      expect(isInlineRenderableContentType(mime)).toBe(true);
    }
  });

  it("forces SVG and non-image types to download", () => {
    expect(isInlineRenderableContentType("image/svg+xml")).toBe(false);
    expect(isInlineRenderableContentType("application/pdf")).toBe(false);
    expect(isInlineRenderableContentType("application/octet-stream")).toBe(false);
  });

  it("ignores charset parameters and is case-insensitive", () => {
    expect(isInlineRenderableContentType("Image/PNG; charset=binary")).toBe(true);
    expect(isInlineRenderableContentType(null)).toBe(false);
    expect(isInlineRenderableContentType(undefined)).toBe(false);
  });
});

describe("isPreviewableImage", () => {
  it("prefers the MIME type and falls back to filename extension", () => {
    expect(isPreviewableImage("image/png", null)).toBe(true);
    expect(isPreviewableImage(null, "artwork.png")).toBe(true);
    expect(isPreviewableImage("application/pdf", "artwork.png")).toBe(true);
    expect(isPreviewableImage(null, "artwork.svg")).toBe(false);
    expect(isPreviewableImage(null, "notes.pdf")).toBe(false);
    expect(isPreviewableImage(null, null)).toBe(false);
  });
});

describe("resolveContentType", () => {
  it("returns a valid blob content type", () => {
    expect(resolveContentType("image/png", null)).toBe("image/png");
  });

  it("falls back to the stored DB type when blob metadata is absent", () => {
    expect(resolveContentType(null, "image/jpeg")).toBe("image/jpeg");
  });

  it("rejects values that do not look like a MIME type", () => {
    expect(resolveContentType("image/png\r\nX-Evil: 1", null)).toBe("application/octet-stream");
    expect(resolveContentType("<script>", null)).toBe("application/octet-stream");
    expect(resolveContentType(null, null)).toBe("application/octet-stream");
  });
});

describe("adminArtworkEndpoint", () => {
  it("builds the authenticated route from the DB id, never a Blob URL", () => {
    expect(adminArtworkEndpoint("abc-123")).toBe("/api/admin/quotes/abc-123/artwork");
    expect(adminArtworkEndpoint("abc-123", true)).toBe("/api/admin/quotes/abc-123/artwork?download=1");
    expect(adminArtworkEndpoint("abc-123")).not.toContain("blob.vercel-storage.com");
  });
});
