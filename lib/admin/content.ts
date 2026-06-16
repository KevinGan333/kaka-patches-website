import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export type ContentType = "blog" | "resources";

export interface ContentItem {
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
  content: string;
  contentMarkdown?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt?: string;
}

const baseDir = path.join(process.cwd(), "content");

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

export function validateContent(data: Partial<ContentItem>): string[] {
  const errors: string[] = [];
  if (!data.title?.trim()) errors.push("Title is required.");
  if (!data.slug?.trim()) errors.push("Slug is required.");
  if (!data.excerpt?.trim()) errors.push("Excerpt is required.");
  if (!data.content?.trim() && !data.contentMarkdown?.trim()) errors.push("Content is required.");
  if (!data.seoTitle?.trim()) errors.push("SEO title is required.");
  if (!data.seoDescription?.trim()) errors.push("SEO description is required.");
  return errors;
}

export async function getContentList(type: ContentType): Promise<ContentItem[]> {
  const dir = path.join(baseDir, type);
  try { await mkdir(dir, { recursive: true }); } catch {}
  let files: string[] = [];
  try { files = await readdir(dir); } catch { return []; }
  const items = await Promise.all(
    files.filter(f => f.endsWith(".json")).map(async f => {
      try { const c = await readFile(path.join(dir, f), "utf-8"); return JSON.parse(c) as ContentItem; } catch { return null; }
    })
  );
  return items.filter(Boolean).sort((a, b) => new Date(b!.updatedAt).getTime() - new Date(a!.updatedAt).getTime()) as ContentItem[];
}

export async function getContentBySlug(type: ContentType, slug: string): Promise<ContentItem | null> {
  try {
    const fp = path.join(baseDir, type, `${slug}.json`);
    const c = await readFile(fp, "utf-8");
    return JSON.parse(c) as ContentItem;
  } catch { return null; }
}

export async function createContent(type: ContentType, data: ContentItem): Promise<ContentItem> {
  const dir = path.join(baseDir, type);
  await mkdir(dir, { recursive: true });
  const fp = path.join(dir, `${data.slug}.json`);
  await writeFile(fp, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

export async function updateContent(type: ContentType, slug: string, updates: Partial<ContentItem>): Promise<ContentItem | null> {
  const existing = await getContentBySlug(type, slug);
  if (!existing) return null;
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  if (updates.status === "published" && !existing.publishedAt) merged.publishedAt = new Date().toISOString();
  if (updates.status === "archived") merged.archivedAt = new Date().toISOString();
  const fp = path.join(baseDir, type, `${slug}.json`);
  await writeFile(fp, JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}

export async function archiveContent(type: ContentType, slug: string): Promise<ContentItem | null> {
  return updateContent(type, slug, { status: "archived" });
}

export async function checkDuplicateSlug(type: ContentType, slug: string, excludeSlug?: string): Promise<boolean> {
  const existing = await getContentBySlug(type, slug);
  return existing !== null && existing.slug !== excludeSlug;
}
