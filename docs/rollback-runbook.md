# Rollback Runbook

**Project:** KaKa Patches Website
**Last updated:** 2026-08-10
**Related:** [docs/production-deployment-runbook.md](production-deployment-runbook.md), [docs/production-release-readiness.md](production-release-readiness.md)

---

## When to Roll Back

Initiate rollback if any of these conditions are met during or after deployment:

| Severity | Condition | Time to act |
|----------|-----------|-------------|
| **Critical** | Any product page returns HTTP 500 | Immediately |
| **Critical** | Admin panel is publicly accessible without authentication | Immediately |
| **Critical** | Database connection errors in production logs | Immediately |
| **Critical** | Sitemap returns 500 or is empty | Immediately |
| **High** | Quote form submissions fail consistently (≥3 consecutive failures) | Within 15 minutes |
| **High** | Email delivery fails for all submissions | Within 30 minutes |
| **Medium** | UTM/attribution fields missing from new inquiries | Within 24 hours (fix-forward acceptable) |
| **Medium** | Per-design quantity rendering broken in email | Within 24 hours (fix-forward acceptable) |
| **Low** | Minor visual regression on a single page | Fix-forward preferred |

### Do NOT roll back for:
- A single failed quote submission (retry; check logs)
- Artwork upload failures (check `BLOB_READ_WRITE_TOKEN` first)
- Slow page loads (investigate; may be cold start)
- Test inquiries appearing in admin (data issue, not code issue)

---

## Rollback Type 1: Application Rollback (Revert Deploy)

**Scope:** Roll back the Vercel deployment to the previous known-good version. Database is untouched. This is the fastest and least risky rollback.

### When to use
- Code regression (page crashes, form bugs)
- Build-time issues missed in verification
- Any issue that did NOT involve a database migration failure

### Procedure

#### Via Vercel Dashboard (recommended)

1. Go to [Vercel Dashboard](https://vercel.com) → `kaka-patches-website`
2. Click **Deployments**
3. Find the **previous production deployment** (the one before the current deploy)
4. Click the **"..."** menu → **Promote to Production**
5. Vercel instantly switches traffic to the previous deployment
6. Verify the rollback: spot-check 3 product pages for HTTP 200

#### Via Vercel CLI

```bash
# List recent deployments
npx vercel list --prod

# Rollback to a specific deployment
npx vercel rollback <deployment-id>
```

#### Via Git (if auto-deploy is on)

```bash
# The previous commit is the deploy target. Find it:
git log --oneline -5

# Revert the deployment by pushing a revert commit
git revert <deploy-commit-sha>
git push origin main
```

The Vercel Git integration will auto-deploy the revert.

### What this does NOT affect
- Database (new columns remain — they are additive and harmless)
- Existing inquiries (unchanged)
- Blob storage (unchanged)
- Environment variables (unchanged)

---

## Rollback Type 2: Database Rollback / Recovery

**Scope:** Restore the database to its pre-migration state. Used only when the migration caused data corruption or the new columns need to be removed (rare).

### When to use
- Migration corrupted existing data (extremely unlikely — `ADD COLUMN` is non-blocking with safe defaults)
- New columns were added with wrong types and need to be dropped before re-adding
- Accidental data modification occurred during migration

### Procedure A: Neon Point-in-Time Recovery (PITR) — preferred

1. Go to [Neon Console](https://console.neon.tech) → project `ep-flat-shape-ay72odgc`
2. Click **Branches** → **Create Branch**
3. Select **Point in Time**
4. Choose a timestamp **just before the migration was run**
5. Name: `rollback-YYYY-MM-DD`
6. Click **Create Branch**
7. This creates a new branch with the database at the pre-migration state
8. To swap production to this branch:
   - Go to **Settings** → **Compute** in the Neon dashboard
   - Update the connection endpoint to the rollback branch
   - OR: Update `DATABASE_URL` in Vercel environment variables to point to the rollback branch

### Procedure B: Restore from logical backup

Only if PITR is unavailable:

```bash
# WARNING: This DROPs and recreates the quote_requests table.
# All inquiries submitted after the backup timestamp will be lost.

# 1. Verify the backup file SHA256
certutil -hashfile C:\Users\Administrator\kaka-backups\kaka-prod-backup-2026-08-10T09-27-49-034Z.sql SHA256

# 2. Restore (requires psql with production DATABASE_URL)
psql "<DATABASE_URL>" < C:\Users\Administrator\kaka-backups\kaka-prod-backup-2026-08-10T09-27-49-034Z.sql
```

### Procedure C: Drop new columns only (no data loss)

If the migration succeeded but the columns need to be removed:

```sql
ALTER TABLE quote_requests DROP COLUMN IF EXISTS utm_content;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS utm_term;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS first_landing_page;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS referrer;
ALTER TABLE quote_requests DROP COLUMN IF EXISTS style_reference;
```

**Risk:** None. These columns are nullable and no production inquiry has populated them yet.

---

## Rollback Type 3: Cache / CDN Rollback

**Scope:** Purge Vercel Edge Cache or CDN cache if stale/corrupted pages are served.

### When to use
- Old page versions are cached and served after deployment
- Sitemap is cached from a previous build
- Stale 404 pages are cached

### Procedure

#### Vercel Edge Cache

```bash
# Purge all cache (Vercel CLI)
npx vercel cache purge --prod
```

Or via Vercel Dashboard → project → Settings → Edge Config → Purge Cache.

#### Cloudflare / External CDN

If a CDN sits in front of Vercel, purge its cache per the provider's instructions.

### Verify after purge

```bash
curl -I https://www.kakapatches.com/products/custom-embroidered-patches
# Check: x-vercel-cache: MISS (not HIT)
```

---

## Rollback Type 4: Emergency Hotfix Deploy

**Scope:** Fix a critical bug without rolling back the entire deployment. Used when the issue is isolated to one file.

### Procedure

1. Create a hotfix branch:
   ```bash
   git checkout -b hotfix/<issue-description>
   ```

2. Fix the issue, commit, push

3. Deploy the hotfix branch via Vercel Dashboard → Deployments → select the hotfix branch → Promote to Production

4. Merge the hotfix back to `main`:
   ```bash
   git checkout main
   git merge hotfix/<issue-description>
   git push origin main
   ```

---

## Artwork / Blob Storage Recovery

Vercel Blob storage is **independent of both application deployment and database migration**. Blob data is not affected by any of the rollback procedures above.

### Artwork is safe during:
- Application rollback ✓
- Database migration/rollback ✓
- Cache purge ✓

### If artwork blobs are accidentally deleted:

1. Check Vercel Blob → Settings → **Retention policy**. Deleted blobs may be recoverable within the retention window.
2. If no retention policy is set, artwork is irrecoverable. Contact Vercel support immediately.
3. **Prevention:** The current codebase has **no deletion code** for blobs — only `put()`. Accidental deletion can only happen via Vercel Dashboard or API, not via application code.

---

## Communication During Rollback

If a production-affecting rollback is in progress:

1. **Notify the team** that a rollback is underway
2. **State the reason** (which rollback condition was triggered)
3. **Estimate duration** (application rollback: < 2 minutes; database recovery: < 15 minutes)
4. **Confirm when complete** and which version is now serving
5. **Document the incident** — what triggered it, what was done, and what prevents recurrence

---

## Quick Reference: Recovery Time by Type

| Rollback Type | Estimated Time | Data Loss Risk |
|---------------|---------------|----------------|
| Application (Vercel redeploy) | < 2 minutes | None |
| Application (Git revert) | 3-5 minutes (build time) | None |
| Database (PITR branch) | < 5 minutes | Inquiries between migration and rollback |
| Database (logical restore) | < 5 minutes | Inquiries after backup timestamp |
| Database (drop columns only) | < 1 second | None |
| Cache purge | < 1 minute | None |
| Hotfix deploy | 3-5 minutes (build time) | None |
