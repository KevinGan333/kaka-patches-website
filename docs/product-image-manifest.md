# Product Image Manifest

Every image position on the B2B product pages is a **reserved slot** with a canonical path under `public/`. Until a real asset is placed at that path, the `ProductImageSlot` component renders a designed placeholder showing the slot title, recommended aspect ratio, recommended pixel dimensions, the exact future asset path, and the note *"Replace with approved product or factory image."*

- **Format:** `.webp` (fallback: same basename with `.png`/`.jpg` resolves if a real image is present — see `lib/image-slots.ts`).
- **Where images resolve:** if an explicit CMS image URL is set (`product.images[].url`), it wins for the hero gallery. Otherwise the file at the canonical path is used. No file + no URL → placeholder (no broken-image icon).

---

## 1. Global / shared slots

### Product families (4) — hero banners
Used on `/products` and `/product-families/{slug}`.

| Family slug | Path | Ratio | Size |
|---|---|---|---|
| patches-labels-transfers | `/images/product-families/patches-labels-transfers.webp` | 16:9 | 1920 × 1080 px |
| badges-magnets | `/images/product-families/badges-magnets.webp` | 16:9 | 1920 × 1080 px |
| textile-accessories | `/images/product-families/textile-accessories.webp` | 16:9 | 1920 × 1080 px |
| sachets-cultural-gifts | `/images/product-families/sachets-cultural-gifts.webp` | 16:9 | 1920 × 1080 px |

### Landing-page hero (1)
| Slot | Path | Ratio | Size |
|---|---|---|---|
| Products hero banner | `/images/products/products-hero.webp` | 16:9 | 1920 × 1080 px |

### Applications gallery — landing (6)
Used in the "Applications" section of `/products`.

| Key | Path | Ratio | Size |
|---|---|---|---|
| Apparel & Uniforms | `/images/applications/apparel-uniforms.webp` | 16:9 | 1920 × 1080 px |
| Hats & Headwear | `/images/applications/hats-headwear.webp` | 16:9 | 1920 × 1080 px |
| Bags & Accessories | `/images/applications/bags-accessories.webp` | 16:9 | 1920 × 1080 px |
| Events & Merchandise | `/images/applications/events-merchandise.webp` | 16:9 | 1920 × 1080 px |
| Cultural Gifts | `/images/applications/cultural-gifts.webp` | 16:9 | 1920 × 1080 px |
| Promotional Products | `/images/applications/promotional-products.webp` | 16:9 | 1920 × 1080 px |

### Quality control (5 shared) — used on every product page
| Key | Path | Ratio | Size |
|---|---|---|---|
| Material Inspection | `/images/quality/material-inspection.webp` | 4:3 | 1600 × 1200 px |
| In-Process Inspection | `/images/quality/in-process-inspection.webp` | 4:3 | 1600 × 1200 px |
| Final Quality Inspection | `/images/quality/final-qc.webp` | 4:3 | 1600 × 1200 px |
| Sample Report Preview | `/images/quality/sample-report-preview.webp` | 4:3 | 1600 × 1200 px |
| Packaging Inspection | `/images/quality/packing-inspection.webp` | 4:3 | 1600 × 1200 px |

### Factory / workshop (7 shared) — used on every product page
| Key | Path | Ratio | Size |
|---|---|---|---|
| Artwork Review | `/images/factory/artwork-review.webp` | 4:3 | 1600 × 1200 px |
| Production Machine | `/images/factory/production-machine.webp` | 4:3 | 1600 × 1200 px |
| Material & Thread | `/images/factory/material-management.webp` | 4:3 | 1600 × 1200 px |
| Production Line | `/images/factory/production-line.webp` | 4:3 | 1600 × 1200 px |
| Quality Inspection | `/images/factory/quality-inspection.webp` | 4:3 | 1600 × 1200 px |
| Packing Line | `/images/factory/packing-line.webp` | 4:3 | 1600 × 1200 px |
| Warehouse & Shipment | `/images/factory/warehouse-shipment.webp` | 4:3 | 1600 × 1200 px |

---

## 2. Per-product slots

Each published product (slug in `content/products/*.json`) reserves the following under `/images/products/{slug}/`.

### Hero gallery (6) — ratio 4:3, 1600 × 1200 px
| Slot | Path |
|---|---|
| Hero product image | `/images/products/{slug}/hero-main.webp` |
| Detail view | `/images/products/{slug}/hero-detail.webp` |
| In application | `/images/products/{slug}/hero-application.webp` |
| Front view | `/images/products/{slug}/gallery-front.webp` |
| Back / attachment | `/images/products/{slug}/gallery-back.webp` |
| Close-up texture | `/images/products/{slug}/gallery-closeup.webp` |

`hero-main.webp` is also the **product card** image on `/products` and `/product-families/{slug}` (4:3).

### Detail gallery (6) — ratio 4:3, 1600 × 1200 px
| Slot | Path |
|---|---|
| Front view | `/images/products/{slug}/gallery-front.webp` |
| Back / attachment | `/images/products/{slug}/gallery-back.webp` |
| Close-up texture | `/images/products/{slug}/gallery-closeup.webp` |
| Edge / finishing | `/images/products/{slug}/gallery-finishing.webp` |
| Applied to end use | `/images/products/{slug}/hero-application.webp` |
| Packaging / bulk | `/images/products/{slug}/gallery-packaging.webp` |

### Customization explorer (4) — ratio 1:1, 1200 × 1200 px
| Slot | Path |
|---|---|
| Option 1 | `/images/products/{slug}/option-01.webp` |
| Option 2 | `/images/products/{slug}/option-02.webp` |
| Option 3 | `/images/products/{slug}/option-03.webp` |
| Option 4 | `/images/products/{slug}/option-04.webp` |

### Application gallery (3) — ratio 16:9, 1920 × 1080 px
| Slot | Path |
|---|---|
| Application 1 | `/images/products/{slug}/application-01.webp` |
| Application 2 | `/images/products/{slug}/application-02.webp` |
| Application 3 | `/images/products/{slug}/application-03.webp` |

---

## 3. Product slug list (24 published)

```
custom-card-holders-wallets
custom-chenille-patches
custom-embroidered-bookmarks
custom-embroidered-fridge-magnets
custom-embroidered-patches
custom-embroidered-stickers
custom-heat-transfer-labels
custom-heat-transfer-patches
custom-keychains
custom-leather-patches
custom-omamori-bags
custom-pin-back-buttons
custom-plush-charms
custom-printed-labels-care-labels
custom-printed-labels
custom-printed-patches
custom-pvc-patches
custom-sachets
custom-stuffed-hanging-ornaments
custom-tinplate-badges
custom-velcro-patches
custom-woven-labels
custom-woven-patches
embroidered-phone-case-patches
```

Per-product slot count = 6 (hero) + 6 (detail) + 4 (explorer) + 3 (application) = **19 image slots per product**.

---

## 4. Replacement workflow

1. Drop the approved asset at the canonical path above (e.g. `public/images/products/custom-embroidered-patches/hero-main.webp`).
2. The slot automatically swaps from placeholder to the real image on the next build (or dev reload).
3. To use an arbitrary CMS-hosted image instead, set `images[].url` in the product JSON (hero gallery only).
