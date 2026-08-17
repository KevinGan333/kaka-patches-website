// Pure, isomorphic helpers for private customer-artwork delivery.
//
// This module intentionally has no Node-only imports so it can be imported from
// both server route handlers and client components. All functions are pure string
// transformations and are unit-tested in tests/artwork.test.ts.

/** Raster image MIME types that are safe to render inline in a browser.
 * SVG is deliberately excluded: it can carry executable script and must be
 * forced to download rather than rendered inline. */
const INLINE_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/bmp",
]);

/** File extensions that map to a safe inline raster type, used as a fallback
 * when only a filename (and no MIME type) is stored. */
const INLINE_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "avif", "bmp"];

/**
 * Strip CR, LF, and other control characters (plus quotes/backslashes) from a
 * filename so it cannot be used to inject headers via a Content-Disposition
 * value. Falls back to a neutral name when the result is empty.
 */
export function sanitizeDownloadFilename(filename: string): string {
  const cleaned = filename
    .replace(/[\r\n\x00-\x1f\x7f]/g, "")
    .replace(/["\\]/g, "_")
    .trim();

  return cleaned || "artwork";
}

/**
 * Build a safe `Content-Disposition` header value. Uses an ASCII fallback plus an
 * RFC 5987 `filename*=UTF-8''…` parameter so non-ASCII filenames (e.g. Chinese)
 * survive the transfer without header injection.
 */
export function buildContentDisposition(filename: string, attachment: boolean): string {
  const safe = sanitizeDownloadFilename(filename);
  const asciiFallback = safe.replace(/[^\x20-\x7e]/g, "_") || "artwork";
  const encoded = encodeURIComponent(safe).replace(/['()*]/g, (c) =>
    "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );

  return `${attachment ? "attachment" : "inline"}; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

/** Whether a MIME type may be rendered inline by the browser (safe raster only). */
export function isInlineRenderableContentType(contentType: string | null | undefined): boolean {
  if (!contentType) return false;
  const mime = contentType.toLowerCase().split(";")[0].trim();
  return INLINE_IMAGE_MIME_TYPES.has(mime);
}

/**
 * Whether an artwork record should show an inline preview, using the stored MIME
 * type first and the filename extension as a fallback.
 */
export function isPreviewableImage(
  contentType: string | null | undefined,
  filename: string | null | undefined
): boolean {
  if (isInlineRenderableContentType(contentType)) return true;
  const ext = (filename || "").split(".").pop()?.toLowerCase() || "";
  return INLINE_IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Resolve a safe `Content-Type` header value. Rejects any value that does not look
 * like a plain `type/subtype` token (guarding against header injection) and falls
 * back to `application/octet-stream`.
 */
export function resolveContentType(
  blobContentType: string | null | undefined,
  dbArtworkType: string | null | undefined
): string {
  const candidate = (blobContentType || dbArtworkType || "").trim();
  if (/^[a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+$/.test(candidate)) {
    return candidate;
  }
  return "application/octet-stream";
}

/**
 * Build the authenticated admin artwork endpoint for a quote. This is the ONLY URL
 * the admin UI should use for artwork — never a raw private Blob URL.
 */
export function adminArtworkEndpoint(id: string, download?: boolean): string {
  const base = `/api/admin/quotes/${encodeURIComponent(id)}/artwork`;
  return download ? `${base}?download=1` : base;
}
