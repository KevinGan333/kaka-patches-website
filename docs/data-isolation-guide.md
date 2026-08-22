# Preview/Development Data and Storage Isolation Guide

**Date:** 2026-08-11
**Status:** Database isolated ✅ | Blob storage isolated ✅ | Production BLOB token needs restoration ⚠️

---

## 1. Isolation Architecture

Preview and Development environments now use completely separate infrastructure from Production:

| Resource | Production | Preview/Development |
|----------|-----------|---------------------|
| Neon project ID | `red-rice-02024918` | `winter-boat-34162455` |
| Neon project name | `neon-aureolin-branch` (Vercel integration) | `kaka-patches-preview` (Vercel integration) |
| Endpoint | `ep-shy-frost-aiskro1x-pooler` (us-east-1) | `ep-misty-snow-axq0rcim` (us-east-2) |
| PG version | 17.10 | Latest |
| Database | `neondb` | `neondb` |
| Inquiries | 14 (all real) | 0 |
| Blob store | `store_DLhAIb5KjmxDqKh7` | `store_hKUqw8uZupYzMNk3` |
| Blob name | kaka-patches-uploads | kaka-patches-preview-uploads |
| Blob access | Private | Public |
| Blob files | 0 | 0 |

---

## 2. How Isolation Was Configured

### 2.1 Database Isolation

1. Created a new Neon project via Vercel integration:
   ```bash
   vercel integration add neon \
     --name kaka-patches-preview \
     --prefix PREVIEW_DB_ \
     -e preview -e development \
     --plan free_v3
   ```
   This provisioned `winter-boat-34162455`, a completely separate Neon project (not a branch of production).

2. Overrode `DATABASE_URL` in Vercel for Preview + Development:
   ```bash
   vercel env add DATABASE_URL preview --sensitive --force
   vercel env add DATABASE_URL development --no-sensitive --force
   ```
   These point to `ep-misty-snow-axq0rcim` — the isolated Preview endpoint.

3. Ran schema initialization:
   ```bash
   DATABASE_URL="<isolated-preview-url>" npx tsx scripts/init-db.ts
   ```
   Created `quote_requests` table (37 columns, 5 indexes) on the empty Preview database.

4. Production `DATABASE_URL` (from `neon-aureolin-branch` integration) is unchanged — applies to Production environment only.

### 2.2 Blob Storage Isolation

1. Removed `BLOB_READ_WRITE_TOKEN` and `BLOB_STORE_ID` from Preview and Development environments:
   ```bash
   vercel env rm BLOB_READ_WRITE_TOKEN preview --yes
   vercel env rm BLOB_STORE_ID preview --yes
   ```

2. Created a new public Blob store connected only to Preview + Development:
   ```bash
   vercel blob create-store kaka-patches-preview-uploads \
     --access public \
     --yes \
     --environment preview \
     --environment development
   ```
   This created `store_hKUqw8uZupYzMNk3` and automatically set `BLOB_READ_WRITE_TOKEN` for Preview + Development.

3. Production `BLOB_READ_WRITE_TOKEN` was accidentally removed during step 1 — needs manual restoration (see Section 4).

### 2.3 Email and Admin Variables

Email (`RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL`) and admin credentials are still shared across environments. This is acceptable because:
- Preview uses Resend sandbox mode and `@example.com` addresses
- Admin credentials are the same for all environments

---

## 3. Vercel Environment Variable Map (Current)

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `DATABASE_URL` | Neon integration (original, 49d) | Env override → `winter-boat-34162455` | Env override → `winter-boat-34162455` |
| `DATABASE_URL_UNPOOLED` | Neon integration (all envs) | Neon integration (all envs) | Neon integration (all envs) |
| `DATABASE_POSTGRES_URL` | Neon integration (all envs) | Neon integration (all envs) | Neon integration (all envs) |
| `BLOB_READ_WRITE_TOKEN` | ❌ MISSING | Isolated store `store_hKUqw8uZupYzMNk3` | Isolated store `store_hKUqw8uZupYzMNk3` |
| `BLOB_WEBHOOK_PUBLIC_KEY` | Shared (all envs) | Shared (all envs) | — |
| `RESEND_API_KEY` | Shared | Shared | — |
| `QUOTE_TO_EMAIL` | Shared | Shared | — |
| `QUOTE_FROM_EMAIL` | Shared | Shared | — |
| `ADMIN_USERNAME` | Shared | Shared | — |
| `ADMIN_PASSWORD` | Shared | Shared | — |
| `ADMIN_SESSION_SECRET` | Shared | Shared | — |

> **Note:** The `DATABASE_*_UNPOOLED` and related variables from the original Neon integration still show "Production, Preview, Development" but are NOT used by the application code (`lib/db.ts` reads only `DATABASE_URL`). The Preview/Development `DATABASE_URL` override takes precedence at runtime.

---

## 4. ⚠️ Critical: Restore Production BLOB_READ_WRITE_TOKEN

The production `BLOB_READ_WRITE_TOKEN` was accidentally removed when isolating the Preview Blob store. **Production artwork uploads will fail until this is restored.**

### Restoration Steps (Kevin — Vercel Dashboard)

1. Go to [Vercel Dashboard → Stores → Blob → kaka-patches-uploads](https://vercel.com/kevinkans-projects/~/stores/blob/store_DLhAIb5KjmxDqKh7)
2. Navigate to **Settings → Tokens**
3. Copy the existing read-write token, or create a new one
4. Go to [Vercel Project → Settings → Environment Variables](https://vercel.com/kevinkans-projects/kaka-patches-website/settings/environment-variables)
5. Click **Add Variable**
   - Key: `BLOB_READ_WRITE_TOKEN`
   - Value: (paste the token)
   - Environments: **Production** only
   - Type: **Sensitive**
6. Click **Save**

---

## 5. Verification Checklist

- [x] Preview database has 0 inquiries
- [x] Production database has 14 inquiries (unchanged)
- [x] Preview Blob store has 0 files
- [x] Production Blob store has 0 files (unchanged)
- [x] Preview deployment is READY at `https://kaka-patches-website-r9ilpo9mq-kevinkans-projects.vercel.app`
- [x] No production deployment occurred
- [x] No production migration occurred
- [x] No production data was modified, deleted, or reseeded
- [ ] Production `BLOB_READ_WRITE_TOKEN` restored (Kevin)
- [ ] Browser artwork-upload test through Preview URL (Kevin)
- [ ] Verify artwork in Preview Blob store only (after Kevin's test)
- [ ] Verify production inquiry count still 14 (after Kevin's test)
