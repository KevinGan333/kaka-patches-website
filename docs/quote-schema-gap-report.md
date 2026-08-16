# Quote Request Schema Gap Report

Date: 2026-08-16 · Prepared by: Claude · Status: **Not applied to Production**

This report documents the difference between the Production `quote_requests` table
and the schema required by `feature/product-page-redesign`. It is **read-only** —
no Production change was made. The accompanying migration is additive and
idempotent and must only be run after Kevin approves the redesign Preview **and**
confirms a database backup/restore point.

---

## 1. Source of truth

- **Production schema** was read live from the Production database
  (`information_schema.columns`, `pg_constraint`, `pg_indexes`) — not inferred from
  local env files or docs.
- **Required schema** was taken from `feature/product-page-redesign`:
  - `lib/admin/quote-db.ts` (`createQuoteRequest` INSERT column list)
  - `scripts/init-db.ts` (column definitions + index definitions)

---

## 2. Current Production columns (23)

| # | Column | Type | Nullable | Default |
|---|---|---|---|---|
| 1 | `id` | uuid | NO | `gen_random_uuid()` |
| 2 | `quote_number` | text | NO | — |
| 3 | `name` | text | NO | — |
| 4 | `email` | text | NO | — |
| 5 | `company` | text | YES | — |
| 6 | `quantity` | text | YES | — |
| 7 | `delivery` | text | YES | — |
| 8 | `patch_type` | text | YES | — |
| 9 | `patch_size` | text | YES | — |
| 10 | `backing` | text | YES | — |
| 11 | `border_option` | text | YES | — |
| 12 | `message` | text | YES | — |
| 13 | `artwork_filename` | text | YES | — |
| 14 | `artwork_url` | text | YES | — |
| 15 | `artwork_size` | integer | YES | — |
| 16 | `artwork_type` | text | YES | — |
| 17 | `email_sent` | boolean | YES | `false` |
| 18 | `email_error` | text | YES | — |
| 19 | `status` | text | YES | `'new'` |
| 20 | `notes` | jsonb | YES | `'[]'::jsonb` |
| 21 | `source` | text | YES | `'website'` |
| 22 | `created_at` | timestamptz | YES | `now()` |
| 23 | `updated_at` | timestamptz | YES | `now()` |

**Constraints present:** `PRIMARY KEY (id)`, `UNIQUE (quote_number)`.

**Indexes present:** `idx_quote_requests_created_at`, `idx_quote_requests_email`,
`idx_quote_requests_patch_type`, `idx_quote_requests_quote_number`,
`idx_quote_requests_status` (plus the PK/UNIQUE backing indexes).

---

## 3. Columns required by the redesign but MISSING in Production (14)

These are referenced by `createQuoteRequest` on the redesign branch. Their absence
makes every quote INSERT fail with `column "…" does not exist` once the redesign
is deployed.

| Column | Type | Nullable | Default | Why (redesign data layer) |
|---|---|---|---|---|
| `quantity_per_design` | text | YES | `''` | per-design qty list |
| `number_of_designs` | text | YES | `''` | design count |
| `product_category` | text | YES | `''` | primary product field |
| `design_notes` | text | YES | `''` | free-form design notes |
| `project_type` | text | YES | `''` | project type |
| `packaging_preference` | text | YES | `''` | packaging choice |
| `utm_source` | text | YES | — | attribution |
| `utm_medium` | text | YES | — | attribution |
| `utm_campaign` | text | YES | — | attribution |
| `utm_content` | text | YES | — | attribution |
| `utm_term` | text | YES | — | attribution |
| `first_landing_page` | text | YES | — | attribution |
| `referrer` | text | YES | — | attribution |
| `style_reference` | text | YES | `''` | buyer SKU/style code |

All are additive, nullable (or constant `DEFAULT ''`), so existing rows are not
rewritten and remain valid.

---

## 4. Indexes / constraints required but MISSING

- **Constraint:** none missing — `PRIMARY KEY (id)` and `UNIQUE (quote_number)`
  already exist.
- **Index (1 missing):** `idx_quote_requests_product_category` on
  `(product_category)`. Depends on the `product_category` column, so the column
  must be added first. The other four indexes from `init-db.ts` already exist.

---

## 5. Backward compatibility of existing Production code

`main`'s `createQuoteRequest` inserts only the base columns that already exist in
Production. After the additive migration, those inserts are unaffected (the 14 new
columns are nullable/defaulted and simply unused). **No existing code breaks.**

---

## 6. Migration

File: `scripts/migrate-quote-schema-gap.ts`

Operations (all idempotent, additive):

```sql
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS quantity_per_design  TEXT DEFAULT '';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS number_of_designs    TEXT DEFAULT '';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS product_category      TEXT DEFAULT '';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS design_notes          TEXT DEFAULT '';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS project_type          TEXT DEFAULT '';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS packaging_preference  TEXT DEFAULT '';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS utm_source            TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS utm_medium            TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS utm_campaign          TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS utm_content           TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS utm_term              TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS first_landing_page    TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS referrer              TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS style_reference       TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_quote_requests_product_category
  ON quote_requests (product_category);
```

**Guarantees:** no `DROP`, no destructive rename, no delete, no table recreation,
no historical-data rewrite. On PostgreSQL 11+, `ADD COLUMN … DEFAULT <constant>`
is a metadata-only operation and does not rewrite the table.

---

## 7. Test results (isolated Preview DB only)

1. **Idempotency** — ran against the isolated Preview DB (`quote_requests` already
   has the full 37-column schema): all 14 columns + 1 index reported
   "already exists, skipping"; verification **14/14 columns, 1/1 index**. No error.
2. **Adds-columns path** — created a throwaway table with Production's exact
   23-column schema, ran the same statements: **23 → 37 columns** (all 14 added,
   `missing after migration: 0`), index created, second run remained 37 columns
   (no error). Temp table dropped.

Production was **not** touched. The migration has **not** been applied to
Production.

---

## 8. Minor pre-existing discrepancy (documented, not changed)

Production's `company`, `quantity`, `delivery`, `patch_type`, `patch_size`,
`backing`, `border_option`, and `message` are nullable with **no** default, whereas
`init-db.ts` defines them as `TEXT DEFAULT ''`. This is harmless (the redesign
INSERT always supplies values) and is intentionally left as-is to avoid any
destructive alteration of existing columns.
