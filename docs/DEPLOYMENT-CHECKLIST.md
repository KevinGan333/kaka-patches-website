# KaKa Patches — Deployment Checklist

## Required Environment Variables (Vercel)

| Variable | Purpose | Example |
|---|---|---|
| `RESEND_API_KEY` | Send quote notification emails | `re_xxxx...` |
| `QUOTE_TO_EMAIL` | Recipient for quote emails | `gkw0118@gmail.com` |
| `QUOTE_FROM_EMAIL` | Sender identity (verified in Resend) | `KaKa Patches <onboarding@resend.dev>` |
| `ADMIN_USERNAME` | Admin panel login username | `admin` |
| `ADMIN_PASSWORD` | Admin panel login password | (strong password) |
| `ADMIN_SESSION_SECRET` | HMAC signing secret for admin sessions | (long random string) |

Add all variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

## Storage Audit

| Path | Content | Local | Vercel Production |
|---|---|---|---|
| `data/quote-requests/` | Quote JSON files | ✅ Works | ❌ Ephemeral filesystem — **needs database** |
| `data/quote-uploads/` | Customer artwork uploads | ✅ Works | ❌ Ephemeral filesystem — **needs object storage** |
| `content/blog/` | Blog post JSON files | ✅ Works | ✅ Git-managed (committed) |
| `content/resources/` | Resource guide JSON files | ✅ Works | ✅ Git-managed (committed) |
| `public/uploads/content/` | Content article images | ✅ Works | ❌ Ephemeral filesystem — **needs object storage** |

## Production Migration Plan

### Phase 1 — Quote Storage (required before Vercel deploy)
- **Quote records:** Migrate `data/quote-requests/` JSON files → PostgreSQL (Vercel Postgres or Supabase)
- **Quote artwork:** Migrate `data/quote-uploads/` → Vercel Blob / S3 / Cloudflare R2
- **API:** Update `app/api/quote/route.ts` to use database + blob storage

### Phase 2 — Content Storage (recommended)
- **Option A:** Keep blog/resources as Git-managed JSON in `content/` (works for small sites)
- **Option B:** Move to headless CMS (Contentful, Sanity, etc.)
- **Content images:** Migrate `public/uploads/content/` → object storage

## Pre-Deployment Test Checklist

- [ ] `npm run build` passes with zero errors
- [ ] `/` homepage loads
- [ ] `/products` loads
- [ ] `/applications` loads
- [ ] `/custom-process` loads
- [ ] `/about-us` loads
- [ ] `/resources` loads with published guides
- [ ] `/blog` loads with published posts
- [ ] `/request-a-quote` form submits
- [ ] Email received in Gmail
- [ ] `/thank-you` loads
- [ ] `/sitemap.xml` valid
- [ ] `/robots.txt` valid
- [ ] `/admin/login` works
- [ ] Admin dashboard loads
- [ ] All env variables set in Vercel

## Git Info

- **Branch:** `master` (root commit `ce00c33`)
- **Remote:** Not yet configured
- **.gitignore:** `.env*`, `data/quote-requests/`, `data/quote-uploads/` excluded

## Add GitHub Remote

```bash
git remote add origin https://github.com/YOUR_USERNAME/kaka-patches-website.git
git push -u origin master
```
