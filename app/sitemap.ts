import type { MetadataRoute } from "next";
import { getContentList } from "@/lib/admin/content";
import { getProductList } from "@/lib/admin/products";
import { PRODUCT_FAMILIES } from "@/lib/product-families";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.kakapatches.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/product-families`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...PRODUCT_FAMILIES.map((f) => ({
      url: `${baseUrl}/product-families/${f.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${baseUrl}/custom-accessories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/applications`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/applications/custom-patches-for-clothing-brands`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/applications/custom-patches-for-sports-teams`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/applications/custom-patches-for-uniforms`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/custom-process`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/request-a-quote`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // Dynamic product URLs from CMS
  const allProducts = await getProductList();
  const publishedProducts = allProducts.filter((p) => p.status === "published");
  const productUrls: MetadataRoute.Sitemap = publishedProducts.map((p) => ({
    url: `${baseUrl}${p.urlPrefix}/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Add published blog posts
  const blogPosts = await getContentList("blog");
  const publishedBlog = blogPosts.filter(p => p.status === "published");
  const blogUrls: MetadataRoute.Sitemap = publishedBlog.map(p => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Add published resources
  const resources = await getContentList("resources");
  const publishedRes = resources.filter(r => r.status === "published");
  const resUrls: MetadataRoute.Sitemap = publishedRes.map(r => ({
    url: `${baseUrl}/resources/${r.slug}`,
    lastModified: r.updatedAt ? new Date(r.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productUrls, ...blogUrls, ...resUrls];
}
