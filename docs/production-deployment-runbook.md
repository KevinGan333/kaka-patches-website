# Production Deployment Runbook

**Project:** KaKa Patches Website (`KevinGan333/kaka-patches-website`)
**Last updated:** 2026-08-10
**Target commit:** `5e293c0ae593aafb49604d51ca020b27111ab936`

---

## Pre-Flight Checklist

Before starting the deployment, verify each of these:

- [ ] **Backup is current** — Logical backup created and SHA256 recorded. See [docs/production-release-readiness.md](production-release-readiness.md) Section 2.
- [ ] **`BLOB_READ_WRITE_TOKEN` is set** — Verified in Vercel → Settings → Environment Variables. Artwork uploads fail without it.
- [ ] **`DATABASE_URL` is set** — Verified in Vercel environment. Same as the target database.
- [ ] **All other env vars present** — `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL`.
- [ ] **Build passes locally** — `npm run build` exits 0 with all routes compiled.
- [ ] **0 lint errors** — `npx eslint .` clean.
- [ ] **0 TypeScript errors** — `npx tsc --noEmit` clean.
- [ ] **Someone is available to check email** — Verify Resend domain status at [resend.com/domains](https://resend.com/domains). The sales inbox must receive the new quote format.

---

## Step 1: Create Production Backup (if not already current)

If it has been more than a few hours since the last backup, or if new production inquiries have arrived:

### Option A: Neon Branch (recommended)

1. Go to [Neon Console](https://console.neon.tech) → project `ep-flat-shape-ay72odgc`
2. Click **Branches** → **Create Branch**
3. Name: `pre-deploy-2026-08-10` (use current date)
4. Select **Create from current state**
5. This creates an isolated, serverless copy — no impact on production

### Option B: Logical SQL dump

```bash
node scripts/backup-db.mjs
```

Save the SHA256 checksum. Store backup file outside the repository.

---

## Step 2: Run Database Migration

The migration script is idempotent and pre-verified. It adds 5 nullable TEXT columns to `quote_requests`.

### Command

```bash
npx tsx scripts/init-db.ts
```

Requires `DATABASE_URL` pointing to production Neon database.

### Expected output

```
✅ Added column: utm_content
✅ Added column: utm_term
✅ Added column: first_landing_page
✅ Added column: referrer
✅ Added column: style_reference
```

If columns already exist (re-run), the script prints "Already exists" for each and exits cleanly.

### Verify migration

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'quote_requests'
  AND column_name IN ('utm_content', 'utm_term', 'first_landing_page', 'referrer', 'style_reference');
```

All 5 columns must be present with `data_type = 'text'`.

### Rollback if migration fails

No rollback needed — `ADD COLUMN ... TEXT` is non-blocking and the columns are nullable with safe defaults. If the script errors, fix the connection string or environment and re-run. The script is idempotent.

---

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (recommended)

1. Go to [Vercel Dashboard](https://vercel.com) → `kaka-patches-website`
2. Select the **Deployments** tab
3. The latest push to `main` should auto-deploy. If not, trigger **Redeploy** from the latest commit.
4. Wait for build completion — check the build log for errors.

### Option B: Vercel CLI

```bash
npx vercel --prod
```

Review the preview URL before promoting to production.

### Option C: Git push (if auto-deploy is configured)

```bash
git push origin main
```

Vercel auto-deploys on push to `main` if the Git integration is configured.

---

## Step 4: Post-Deployment Smoke Tests

Execute these within 5 minutes of deployment completing.

### 4.1 Product Pages (all 19 routes must return 200)

```
GET https://www.kakapatches.com/products/custom-embroidered-patches
GET https://www.kakapatches.com/products/custom-woven-patches
GET https://www.kakapatches.com/products/custom-pvc-patches
GET https://www.kakapatches.com/products/custom-chenille-patches
GET https://www.kakapatches.com/products/custom-printed-patches
GET https://www.kakapatches.com/products/custom-leather-patches
GET https://www.kakapatches.com/products/custom-velcro-patches
GET https://www.kakapatches.com/products/custom-woven-labels
GET https://www.kakapatches.com/products/custom-printed-labels
GET https://www.kakapatches.com/products/custom-heat-transfer-labels
GET https://www.kakapatches.com/custom-accessories/custom-keychains
GET https://www.kakapatches.com/custom-accessories/custom-embroidered-stickers
GET https://www.kakapatches.com/custom-accessories/custom-plush-charms
GET https://www.kakapatches.com/custom-accessories/custom-pin-back-buttons
GET https://www.kakapatches.com/custom-accessories/custom-embroidered-bookmarks
GET https://www.kakapatches.com/custom-accessories/custom-embroidered-fridge-magnets
GET https://www.kakapatches.com/custom-accessories/custom-card-holders-wallets
GET https://www.kakapatches.com/custom-accessories/custom-sachets
GET https://www.kakapatches.com/custom-accessories/custom-omamori-bags
```

**Expected:** All return HTTP 200. Each page has:
- Meta title visible in `<title>` tag
- BreadcrumbList JSON-LD present in `<head>`
- "Request a Quote" CTA link present
- No broken images

### 4.2 SEO Artifacts

```
GET https://www.kakapatches.com/sitemap.xml     → 200, contains all 19 product/accessory URLs
GET https://www.kakapatches.com/robots.txt       → 200, contains Sitemap: directive
```

### 4.3 Canonical URLs

Spot-check 3 product pages for correct `<link rel="canonical">`:
- `/products/custom-embroidered-patches` → canonical is `https://www.kakapatches.com/products/custom-embroidered-patches`
- `/custom-accessories/custom-keychains` → canonical is `https://www.kakapatches.com/custom-accessories/custom-keychains`

### 4.4 Admin Auth

```
GET https://www.kakapatches.com/admin/login        → 200 (login page loads)
GET https://www.kakapatches.com/admin/quotes        → 401 or redirect to login (unauthenticated)
POST https://www.kakapatches.com/api/quote          → 200 or 400 or 429 (not 500)
```

### 4.5 Breadcrumbs

Check 3 product pages for correct breadcrumb rendering:
- Home > Products > [Product Name]
- Home > Custom Accessories > [Accessory Name]

---

## Step 5: Quote Submission Verification

### 5.1 Simple form submission (no artwork, @example.com email)

Submit a quote via the production form:

1. Navigate to `https://www.kakapatches.com/request-a-quote?product=custom-embroidered-patches`
2. Fill in:
   - Product: Custom Embroidered Patches
   - Quantity Per Design: `50`
   - Number of Designs: `1` (if prompted)
   - Name: `Smoke Test`
   - Email: `smoke-test@example.com`
   - Company: `KaKa QA`
3. Submit

**Expected:** HTTP 200, `"success": true`. Note the `quoteNumber` returned.

### 5.2 Attribution test

Submit from: `https://www.kakapatches.com/request-a-quote?product=custom-pvc-patches&utm_source=google&utm_medium=cpc&utm_campaign=deploy_test`

Verify in admin → quote detail that `utm_source`, `utm_medium`, `utm_campaign` are stored.

### 5.3 Email receipt

Check the sales inbox (`QUOTE_TO_EMAIL`) for the smoke test email. Verify:
- Quote number in subject line
- Product Category correct
- Quantity correct
- UTM fields present (if applicable)
- Style Reference field present (may be empty)
- No raw HTML or broken formatting

---

## Step 6: SEO Validation

### 6.1 Meta titles and descriptions

Spot-check 5 product pages via View Source (`Ctrl+U`):
- `<title>` matches the expected product name
- `<meta name="description">` is present with unique content
- `<script type="application/ld+json">` contains BreadcrumbList

### 6.2 Sitemap

- `sitemap.xml` lists all 19 product URLs
- All URLs have correct `<loc>` values
- No draft/unpublished URLs appear

### 6.3 robots.txt

- Contains `Sitemap:` directive pointing to sitemap.xml
- Does not disallow any product pages

---

## Step 7: Monitor

### First 15 minutes

- Watch Vercel deployment logs for runtime errors
- Check Neon dashboard for abnormal connection spikes
- Submit 1-2 test quotes to confirm end-to-end flow
- Monitor sales inbox for bounce-backs or delivery failures

### First 24 hours

- Check Google Search Console for crawl errors (if connected)
- Review any real customer inquiries for field completeness (UTM, style reference, per-design quantities)
- Confirm Resend email delivery stats at [resend.com](https://resend.com)

---

## Rollback Decision Criteria

Initiate rollback immediately if ANY of these occur:

| Condition | Action |
|-----------|--------|
| Any product page returns 500 | Rollback |
| Sitemap returns 500 or is empty | Rollback |
| Quote form submissions consistently fail (≥3 failures) | Rollback |
| Admin panel is publicly accessible without auth | Rollback |
| Email delivery fails for all submissions | Investigate; rollback if > 15 min |
| Database connection errors in Vercel logs | Rollback if persistent |
| Build fails during deployment | Do not promote; fix and re-deploy |

See [docs/rollback-runbook.md](rollback-runbook.md) for detailed rollback procedures.

---

## Post-Deployment Cleanup

Once deployment is confirmed stable (24 hours, 0 rollback conditions):

- [ ] Remove or label test inquiries in admin Quotes page (those with `@example.com`)
- [ ] Archive the pre-deployment backup with a retention note
- [ ] Update this runbook's target commit if subsequent hotfixes are deployed
- [ ] Verify Google Search Console is crawling the updated pages (if connected)
