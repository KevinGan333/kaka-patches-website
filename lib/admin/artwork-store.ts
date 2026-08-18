// Server-only: selects the customer-artwork Vercel Blob store by deployment
// environment. This module must only be imported by server code (route handlers
// and server helpers) — never by a client component. It reads `process.env` at
// request time and never uses a NEXT_PUBLIC variable.

const PRODUCTION_ENV = "production";

/**
 * Resolve the customer-artwork Blob store ID for the current deployment.
 *
 * - Production (`VERCEL_ENV === "production"`) uses `BLOB_STORE_ID`.
 * - Preview and Development use `KAKA_PREVIEW_BLOB_STORE_ID`.
 *
 * There is intentionally no cross-environment fallback: Preview must never fall
 * back to the Production store, and Production must never use the Preview store.
 *
 * Throws a controlled error when the required store ID is missing so callers can
 * fail loudly before persisting anything.
 */
export function getArtworkBlobStoreId(): string {
  const isProduction = process.env.VERCEL_ENV === PRODUCTION_ENV;
  const storeId = isProduction
    ? process.env.BLOB_STORE_ID
    : process.env.KAKA_PREVIEW_BLOB_STORE_ID;

  if (!storeId) {
    const required = isProduction ? "BLOB_STORE_ID" : "KAKA_PREVIEW_BLOB_STORE_ID";
    const environment = isProduction ? "Production" : "Preview/Development";
    throw new Error(
      `Customer artwork Blob store is not configured: ${required} is missing for ${environment}.`
    );
  }

  return storeId;
}
