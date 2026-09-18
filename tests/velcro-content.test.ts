import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolveCategory } from "../lib/product-catalog";
import { validateProduct } from "../lib/admin/products";
import product from "../content/products/custom-velcro-patches.json";

describe("custom Velcro patches page brief", () => {
  it("preserves its canonical identity, exact title and single plain H1", () => {
    expect(validateProduct(product as Parameters<typeof validateProduct>[0])).toEqual([]);
    expect(product.slug).toBe("custom-velcro-patches");
    expect(product.urlPrefix).toBe("/products");
    expect(product.h1).toBe("Custom Velcro Patches");
    expect(product.seoTitle).toBe("Custom Velcro Patches Manufacturer | KaKa Patches");
    expect(product.metaDescription.length).toBeGreaterThanOrEqual(140);
    expect(product.metaDescription.length).toBeLessThanOrEqual(160);
    expect(product.layout).toBe("compact");
    expect(JSON.stringify(product)).not.toMatch(/custom custom/i);
  });

  it("provides eight best-fit buyers and four linked alternative decisions", () => {
    expect(product.decisionGuide.bestFor).toHaveLength(8);
    expect(product.decisionGuide.alternatives).toHaveLength(4);
    const links = product.decisionGuide.alternatives.map((item) => item.href);
    expect(links).toEqual(expect.arrayContaining([
      "/products/custom-embroidered-patches", "/products/custom-pvc-patches",
      "/products/custom-woven-patches", "#customization",
    ]));
  });

  it("prefills the correct quote category for all eight applications", () => {
    expect(product.applicationGallery).toHaveLength(8);
    for (const application of product.applicationGallery) {
      const url = new URL(application.href, "https://www.kakapatches.com");
      expect(url.pathname).toBe("/request-a-quote");
      expect(url.searchParams.get("product")).toBe("Custom Velcro Patches");
      expect(resolveCategory(url.searchParams.get("product")!)).toBe(product.quoteLabel);
    }
  });

  it("includes all related products, FAQ topics and the incoming uniform link", () => {
    expect(product.relatedProductSlugs).toEqual([
      "custom-embroidered-patches", "custom-pvc-patches",
      "custom-woven-patches", "custom-chenille-patches",
    ]);
    expect(product.faqs).toHaveLength(8);
    expect(new Set(product.faqs.map((faq) => faq.question)).size).toBe(8);
    expect(product.faqs.some((faq) => faq.answer.includes("200 pcs per design"))).toBe(true);
    const uniforms = readFileSync("app/applications/custom-patches-for-uniforms/page.tsx", "utf8");
    expect(uniforms).toContain('href="/products/custom-velcro-patches"');
  });
});
