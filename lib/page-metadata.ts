import type { Metadata } from "next";
import type { ProductPage } from "@/lib/admin/products";

export const SITE_ORIGIN = "https://www.kakapatches.com";

export function absoluteSiteUrl(path: string): string {
  return new URL(path, `${SITE_ORIGIN}/`).href;
}

export function productShareImage(product: ProductPage): string {
  const hero = product.images?.find((image) => image.url)?.url;
  if (hero) return hero;
  if (product.ogImage) return product.ogImage;
  const material = product.slug.match(/(?:^|custom-)(leather|printed|heat-transfer|woven|chenille|pvc)/)?.[1];
  const image = material === "heat-transfer" ? "printed" : material || "embroidered";
  return `/images/home/${image}.webp`;
}

/** Keep share cards in sync with the page's existing title and description. */
export function withPageMetadata(
  metadata: Metadata,
  path: string,
  image: string,
): Metadata {
  if (metadata.robots && typeof metadata.robots === "object" && metadata.robots.index === false) {
    return metadata;
  }
  const title = typeof metadata.title === "string" ? metadata.title : undefined;
  const description = metadata.description || undefined;
  const url = absoluteSiteUrl(path);
  const imageUrl = absoluteSiteUrl(image);
  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "KaKa Patches",
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
