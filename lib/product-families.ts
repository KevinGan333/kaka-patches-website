import type { ProductPage } from "@/lib/admin/products";

export interface ProductFamily {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  h1: string;
  h1Accent: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  heroImageSlot: string;
}

/**
 * The four B2B product families introduced with the product-page redesign,
 * plus the standalone application page (phone case patches) which is surfaced
 * through the catalog but does not have a dedicated family landing page.
 */
export const PRODUCT_FAMILIES: ProductFamily[] = [
  {
    slug: "patches-labels-transfers",
    name: "Patches, Labels & Transfers",
    shortName: "Patches & Labels",
    eyebrow: "Patches, Labels & Transfers",
    h1: "Custom Patches, Labels & Heat Transfers for",
    h1Accent: "B2B Buyers",
    description:
      "Embroidered, woven, PVC, chenille and printed patches — plus woven, printed and heat-transfer labels — for apparel brands, uniform suppliers, sports teams and promotional buyers.",
    metaTitle: "Custom Patches, Labels & Transfers for B2B Buyers | KaKa Patches",
    metaDescription:
      "Factory-direct custom patches, labels and heat transfers for clothing brands, uniform suppliers, sports teams and promotional buyers. Embroidered, woven, PVC, chenille and printed options.",
    heroImageSlot: "/images/product-families/patches-labels-transfers.webp",
  },
  {
    slug: "badges-magnets",
    name: "Badges & Magnets",
    shortName: "Badges & Magnets",
    eyebrow: "Badges & Magnets",
    h1: "Custom Badges & Fridge Magnets for",
    h1Accent: "Brands & Events",
    description:
      "Custom tinplate badges and embroidered fridge magnets for corporate branding, tourism souvenirs, events, fan merchandise and promotional giveaways.",
    metaTitle: "Custom Badges & Fridge Magnets for B2B Buyers | KaKa Patches",
    metaDescription:
      "Factory-direct custom tinplate badges and embroidered fridge magnets for brands, tourism, events and promotional buyers. Low MOQ and full customization support.",
    heroImageSlot: "/images/product-families/badges-magnets.webp",
  },
  {
    slug: "textile-accessories",
    name: "Textile Accessories",
    shortName: "Textile Accessories",
    eyebrow: "Textile Accessories",
    h1: "Custom Embroidered Textile Accessories for",
    h1Accent: "Brand Merchandise",
    description:
      "Embroidered keychains, bookmarks, card holders, plush charms and hanging ornaments — soft-textile brand merchandise manufactured to your exact specifications.",
    metaTitle: "Custom Textile Accessories for B2B Buyers | KaKa Patches",
    metaDescription:
      "Factory-direct custom embroidered keychains, bookmarks, card holders and textile accessories for brands, events, bookstores and promotional buyers.",
    heroImageSlot: "/images/product-families/textile-accessories.webp",
  },
  {
    slug: "sachets-cultural-gifts",
    name: "Sachets & Cultural Gifts",
    shortName: "Sachets & Gifts",
    eyebrow: "Sachets & Cultural Gifts",
    h1: "Custom Sachets & Cultural Gifts for",
    h1Accent: "Retail & Hospitality",
    description:
      "Custom scented sachets and traditional omamori pouches for retail gift sets, hospitality, fragrance brands, shrines and cultural merchandise projects.",
    metaTitle: "Custom Sachets & Cultural Gifts for B2B Buyers | KaKa Patches",
    metaDescription:
      "Factory-direct custom sachets and omamori pouches for retail gift sets, hospitality, fragrance and cultural merchandise buyers. Full customization support.",
    heroImageSlot: "/images/product-families/sachets-cultural-gifts.webp",
  },
];

const FAMILY_INDEX = new Map(PRODUCT_FAMILIES.map((f) => [f.slug, f]));

/**
 * Fallback family assignment for products that predate the `familySlug` field.
 * Kept as an explicit map so every live product resolves to a family without
 * requiring a rewrite of the existing content JSON files.
 */
const SLUG_TO_FAMILY: Record<string, string> = {
  // Patches, Labels & Transfers
  "custom-embroidered-patches": "patches-labels-transfers",
  "custom-woven-patches": "patches-labels-transfers",
  "custom-pvc-patches": "patches-labels-transfers",
  "custom-chenille-patches": "patches-labels-transfers",
  "custom-leather-patches": "patches-labels-transfers",
  "custom-printed-patches": "patches-labels-transfers",
  "custom-velcro-patches": "patches-labels-transfers",
  "custom-woven-labels": "patches-labels-transfers",
  "custom-printed-labels": "patches-labels-transfers",
  "custom-heat-transfer-labels": "patches-labels-transfers",
  "custom-heat-transfer-patches": "patches-labels-transfers",
  "custom-printed-labels-care-labels": "patches-labels-transfers",
  // Badges & Magnets
  "custom-tinplate-badges": "badges-magnets",
  "custom-embroidered-fridge-magnets": "badges-magnets",
  // Textile Accessories
  "custom-keychains": "textile-accessories",
  "custom-embroidered-keychains": "textile-accessories",
  "custom-embroidered-stickers": "textile-accessories",
  "custom-plush-charms": "textile-accessories",
  "custom-pin-back-buttons": "textile-accessories",
  "custom-embroidered-bookmarks": "textile-accessories",
  "custom-card-holders-wallets": "textile-accessories",
  "custom-stuffed-hanging-ornaments": "textile-accessories",
  // Sachets & Cultural Gifts
  "custom-sachets": "sachets-cultural-gifts",
  "custom-omamori-bags": "sachets-cultural-gifts",
  "custom-omamori-pouches": "sachets-cultural-gifts",
};

export function getFamilyBySlug(slug: string): ProductFamily | null {
  return FAMILY_INDEX.get(slug) ?? null;
}

export function getFamilyForProduct(product: Pick<ProductPage, "familySlug" | "slug">): ProductFamily | null {
  const slug = product.familySlug || SLUG_TO_FAMILY[product.slug];
  return slug ? getFamilyBySlug(slug) : null;
}

export function getFamilySlugForProduct(product: Pick<ProductPage, "familySlug" | "slug">): string | null {
  return product.familySlug || SLUG_TO_FAMILY[product.slug] || null;
}
