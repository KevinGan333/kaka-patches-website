/**
 * Canonical product catalog for the Request a Quote form.
 *
 * Display names are the `product_category` values persisted to the database,
 * so they are intentionally stable: renaming a category here would break the
 * admin filter and CSV export against historical inquiries. New categories are
 * appended without touching existing names.
 */
export interface ProductCategoryGroup {
  label: string;
  items: string[];
}

export const PRODUCT_GROUPS: ProductCategoryGroup[] = [
  {
    label: "Patches, Labels & Transfers",
    items: [
      "Custom Embroidered Patches",
      "Custom Woven Patches",
      "Custom PVC Patches",
      "Custom Chenille Patches",
      "Custom Leather Patches",
      "Custom Printed Patches",
      "Custom Velcro Patches",
      "Custom Woven Labels",
      "Custom Printed Labels",
      "Custom Printed Labels & Care Labels",
      "Custom Heat Transfer Labels",
      "Custom Heat Transfer Patches",
      "Embroidered Phone Case Patches",
    ],
  },
  {
    label: "Badges & Magnets",
    items: ["Custom Tinplate Badges", "Custom Embroidered Fridge Magnets"],
  },
  {
    label: "Textile Accessories",
    items: [
      "Custom Keychains",
      "Custom Embroidered Stickers",
      "Custom Plush Charms",
      "Custom Pin-Back Buttons",
      "Custom Embroidered Bookmarks",
      "Custom Card Holders and Wallets",
      "Custom Stuffed Hanging Ornaments",
    ],
  },
  {
    label: "Sachets & Cultural Gifts",
    items: ["Custom Sachets", "Custom Omamori Bags"],
  },
];

/** Slug → display name, so `?product=custom-embroidered-patches` prefills correctly. */
export const SLUG_TO_CATEGORY: Record<string, string> = {
  "custom-embroidered-patches": "Custom Embroidered Patches",
  "custom-woven-patches": "Custom Woven Patches",
  "custom-pvc-patches": "Custom PVC Patches",
  "custom-chenille-patches": "Custom Chenille Patches",
  "custom-leather-patches": "Custom Leather Patches",
  "custom-printed-patches": "Custom Printed Patches",
  "custom-velcro-patches": "Custom Velcro Patches",
  "custom-woven-labels": "Custom Woven Labels",
  "custom-printed-labels": "Custom Printed Labels",
  "custom-printed-labels-care-labels": "Custom Printed Labels & Care Labels",
  "custom-heat-transfer-labels": "Custom Heat Transfer Labels",
  "custom-heat-transfer-patches": "Custom Heat Transfer Patches",
  "embroidered-phone-case-patches": "Embroidered Phone Case Patches",
  "custom-tinplate-badges": "Custom Tinplate Badges",
  "custom-embroidered-fridge-magnets": "Custom Embroidered Fridge Magnets",
  "custom-keychains": "Custom Keychains",
  "custom-embroidered-stickers": "Custom Embroidered Stickers",
  "custom-plush-charms": "Custom Plush Charms",
  "custom-pin-back-buttons": "Custom Pin-Back Buttons",
  "custom-embroidered-bookmarks": "Custom Embroidered Bookmarks",
  "custom-card-holders-wallets": "Custom Card Holders and Wallets",
  "custom-stuffed-hanging-ornaments": "Custom Stuffed Hanging Ornaments",
  "custom-sachets": "Custom Sachets",
  "custom-omamori-bags": "Custom Omamori Bags",
};

export const ALL_CATEGORIES = PRODUCT_GROUPS.flatMap((g) => g.items);

/** Resolve a `?product=` query value to a display name, or null if unknown. */
export function resolveCategory(value: string): string | null {
  if (!value) return null;
  const decoded = decodeURIComponent(value);
  if (ALL_CATEGORIES.includes(decoded)) return decoded;
  const slug = decoded.trim().toLowerCase();
  return SLUG_TO_CATEGORY[slug] || null;
}
