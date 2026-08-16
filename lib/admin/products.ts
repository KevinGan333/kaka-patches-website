import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export interface ProductHighlight {
  label: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductTypeOption {
  title: string;
  description: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface DecisionGuide {
  bestFor?: string[];
  notIdealFor?: string[];
  recommendedApplications?: string[];
  alternativeText?: string;
  alternativeSlug?: string;
}

export interface DetailGalleryItem {
  title: string;
  caption: string;
  imageSlot?: string;
}

export interface CustomizationOption {
  name: string;
  description: string;
  bestFor?: string;
  imageSlot?: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface ApplicationGalleryItem {
  title: string;
  description: string;
  imageSlot?: string;
  href?: string;
}

export interface ShippingStep {
  title: string;
  description: string;
}

export interface ProductPage {
  type: "product";
  // Identity
  name: string;
  slug: string;
  group: "patches" | "labels-transfers" | "accessories";
  urlPrefix: "/products" | "/custom-accessories";

  // Publishing
  status: "draft" | "published" | "archived";
  displayOrder: number;
  availableForQuote: boolean;
  quoteFormKey: string;

  // Public-facing naming (B2B redesign) — decoupled from the legacy internal
  // identity (`name`) and quote category (`quoteFormKey`) so the persisted
  // `product_category` values stay stable for admin filters / CSV / old data.
  displayName?: string; // public display name on cards, breadcrumb and schema
  seoTitle?: string;    // public <title> / OpenGraph title
  quoteLabel?: string;  // stable quote-form category label (= stored product_category)

  // SEO
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;

  // Hero
  heroBadge: string;
  h1: string;
  heroSubtitle: string;
  heroHighlights: ProductHighlight[];

  // Family taxonomy (B2B redesign)
  family?: string;      // e.g. "Patches, Labels & Transfers"
  familySlug?: string;  // e.g. "patches-labels-transfers"
  buyerSummary?: string;
  customizationChips?: string[];

  // Section C — buyer decision guide
  decisionGuide?: DecisionGuide;

  // Section D — production detail gallery
  detailGallery?: DetailGalleryItem[];

  // Section E — visual customization explorer
  customizationExplorer?: CustomizationOption[];

  // Section F — specification table
  specifications?: SpecRow[];

  // Section G — application gallery
  applicationGallery?: ApplicationGalleryItem[];

  // Section I — compliance / documentation items
  complianceItems?: string[];

  // Section K — shipping & payment workflow
  shippingSteps?: ShippingStep[];

  // Section M — related applications + educational blog links
  relatedApplications?: string[];
  relatedBlogSlugs?: string[];

  // Overview
  overviewParagraphs: string[];
  buyerTypes: string[];

  // Applications
  applications: string[];

  // Features
  features: ProductFeature[];

  // Custom Options
  customOptionsTitle: string;
  customOptions: string[];

  // Type / Backing Options (dark section)
  typeOptionsTitle: string;
  typeOptions: ProductTypeOption[];

  // FAQ
  faqs: ProductFaq[];

  // CTA
  ctaHeading: string;

  // Related
  relatedProductSlugs: string[];

  // MOQ / disclaimer
  moqDisclaimer: string;
  packagingDelivery: string;

  // Images
  images: ProductImage[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

const baseDir = path.join(process.cwd(), "content", "products");

export function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

export function validateProduct(data: Partial<ProductPage>): string[] {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Product name is required.");
  if (!data.slug?.trim()) errors.push("Slug is required.");
  if (!data.group) {
    errors.push("Product group is required.");
  } else if (!["patches", "labels-transfers", "accessories"].includes(data.group)) {
    errors.push("Invalid product group.");
  }
  if (!data.urlPrefix) {
    errors.push("URL prefix is required.");
  } else if (!["/products", "/custom-accessories"].includes(data.urlPrefix)) {
    errors.push("Invalid URL prefix.");
  }
  if (!data.h1?.trim()) errors.push("H1 is required.");
  if (!data.metaTitle?.trim()) errors.push("Meta title is required.");
  if (!data.metaDescription?.trim()) errors.push("Meta description is required.");
  return errors;
}

export async function getProductList(): Promise<ProductPage[]> {
  try { await mkdir(baseDir, { recursive: true }); } catch { /* dir exists */ }
  let files: string[] = [];
  try { files = await readdir(baseDir); } catch { return []; }
  const items = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        try {
          const c = await readFile(path.join(baseDir, f), "utf-8");
          return JSON.parse(c) as ProductPage;
        } catch {
          return null;
        }
      })
  );
  return (items.filter(Boolean) as ProductPage[]).sort(
    (a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99)
  );
}

export async function getProductBySlug(slug: string): Promise<ProductPage | null> {
  try {
    const fp = path.join(baseDir, `${slug}.json`);
    const c = await readFile(fp, "utf-8");
    return JSON.parse(c) as ProductPage;
  } catch {
    return null;
  }
}

export async function createProduct(data: ProductPage): Promise<ProductPage> {
  const dir = baseDir;
  await mkdir(dir, { recursive: true });
  const fp = path.join(dir, `${data.slug}.json`);
  await writeFile(fp, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

export async function updateProduct(
  slug: string,
  updates: Partial<ProductPage>
): Promise<ProductPage | null> {
  const existing = await getProductBySlug(slug);
  if (!existing) return null;
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  if (updates.status === "published" && !existing.publishedAt) {
    merged.publishedAt = new Date().toISOString();
  }
  if (updates.status === "archived") {
    merged.publishedAt = null;
  }
  const fp = path.join(baseDir, `${slug}.json`);
  await writeFile(fp, JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}

export async function archiveProduct(slug: string): Promise<ProductPage | null> {
  return updateProduct(slug, { status: "archived" });
}

/**
 * Load a product from the _fallbacks directory when the main CMS record is absent.
 * This guarantees legacy owner-managed pages remain accessible even if the CMS
 * JSON file is deleted, moved, or not yet created by the seed script.
 */
export async function getFallbackProduct(slug: string): Promise<ProductPage | null> {
  try {
    const fp = path.join(baseDir, "_fallbacks", `${slug}.json`);
    const c = await readFile(fp, "utf-8");
    return JSON.parse(c) as ProductPage;
  } catch {
    return null;
  }
}

export async function checkDuplicateProductSlug(
  slug: string,
  excludeSlug?: string
): Promise<boolean> {
  const existing = await getProductBySlug(slug);
  return existing !== null && existing.slug !== excludeSlug;
}
