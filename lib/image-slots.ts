import fs from "fs";
import path from "path";

/**
 * Resolve a real image URL for a product image slot.
 *
 * 1. If an explicit `src` is supplied (e.g. from the CMS `images` array), use it.
 * 2. Otherwise, if the canonical `slotPath` exists on disk under `public/`, use it.
 * 3. Otherwise return null so the caller renders a designed placeholder.
 *
 * This lets the owner drop an approved image at the documented path and have it
 * appear automatically, without a code change.
 */
export function resolveImageSrc(slotPath?: string, explicitSrc?: string): string | null {
  if (explicitSrc && explicitSrc.trim()) return explicitSrc;
  if (!slotPath || !slotPath.trim()) return null;
  const clean = slotPath.startsWith("/") ? slotPath.slice(1) : slotPath;
  try {
    const abs = path.join(process.cwd(), "public", clean);
    if (fs.existsSync(abs)) return slotPath;
  } catch {
    /* ignore — fall through to placeholder */
  }
  return null;
}

export interface SlotSpec {
  title: string;
  slotPath: string;
  ratio: string;
  alt?: string;
  explicitSrc?: string;
}
