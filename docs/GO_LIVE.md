# Go live: Vercel + Squarespace domain + `elitesurgicalcoders@gmail.com`

Use this checklist when pointing **elitesurgicalcoders.com** (Squarespace) at your **Vercel** app and using the client’s Gmail for SMTP + display.

Repo: [github.com/skumar54uncc/Elitecoders](https://github.com/skumar54uncc/Elitecoders)

---

## 1. Gmail (client: `elitesurgicalcoders@gmail.com`)

1. Sign in to that Google account.
2. Enable **2-Step Verification** (Google Account → Security).
3. Create an **App password**: [App passwords](https://myaccount.google.com/apppasswords) → Mail → generate 16-character password (not the normal Gmail password).

---

## 2. Vercel → Environment variables

In **Vercel** → Project **elitecoders** → **Settings** → **Environment Variables** (apply to **Production** at minimum):

| Variable | Value / notes |
|----------|----------------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `elitesurgicalcoders@gmail.com` |
| `SMTP_PASS` | Gmail **app password** (16 chars, no spaces) |
| `SMTP_FROM` | `elitesurgicalcoders@gmail.com` |
| `INTERNAL_NOTIFICATION_EMAIL` | `elitesurgicalcoders@gmail.com` ← receives **contact form** + **job application** notifications |
| `NEXT_PUBLIC_EMAIL` | `elitesurgicalcoders@gmail.com` ← shown on site (footer, contact, etc.) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.elitesurgicalcoders.com` (or `https://elitesurgicalcoders.com` if you standardize on apex) |
| `SESSION_SECRET` | Long random string (keep secret) |
| `DATABASE_URL` | Your Postgres URL |
| `DIRECT_URL` | Direct Postgres URL (if Prisma needs it) |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never expose as `NEXT_PUBLIC_*` |
| `NEXT_PUBLIC_PHONE` | Client’s real number |
| `NEXT_PUBLIC_ADDRESS` | As desired |

**Optional cleanup**

- `ADMIN_PASSWORD` is **not read by the app** for login; admin users live in the DB. You can **delete** `ADMIN_PASSWORD` from Vercel to avoid confusion.

After any env change: **Redeploy** (Deployments → … → Redeploy, or push to `main`).

---

## 3. Vercel → Custom domain

1. **Vercel** → Project → **Settings** → **Domains**.
2. Add **`elitesurgicalcoders.com`** and **`www.elitesurgicalcoders.com`**.
3. Vercel shows the DNS records to add (often **A** for `@` and **CNAME** for `www`). Copy them.

---

## 4. Squarespace → DNS (domain stays at Squarespace)

1. Log in: [account.squarespace.com/domains](https://account.squarespace.com/domains).
2. Open **elitesurgicalcoders.com** → **DNS** / **DNS settings** (wording varies).
3. **If a Squarespace “site” is still attached:**  
   - Either **disconnect** the domain from the old Squarespace website, or  
   - Point DNS to Vercel as below so traffic goes to Vercel (recommended: turn off or unpublish the old Squarespace site so you don’t maintain two sites).
4. Add/update records **exactly as Vercel shows**, for example:
   - **A** record for `@` → Vercel’s IP (e.g. `76.76.21.21` — use **your** Vercel UI value).
   - **CNAME** for `www` → `cname.vercel-dns.com` (or the target Vercel gives you).
5. Remove conflicting records that still point the root or `www` to **Squarespace hosting** (old default records).

Wait for DNS propagation (minutes to 48 hours). Vercel will issue **SSL** automatically when DNS is correct.

---

## 5. GitHub

1. Commit and push your latest code to **`main`** on [skumar54uncc/Elitecoders](https://github.com/skumar54uncc/Elitecoders):
   ```bash
   git add .
   git commit -m "Go-live: hide blog/careers, redirects, sitemap"
   git push origin main
   ```
2. Confirm **Vercel** is connected to this repo and deploys on push to `main`.
3. **Transfer to client (optional):**  
   - Add their GitHub user as collaborator, or  
   - Transfer repo ownership in GitHub → Settings → Danger zone.

---

## 6. After go-live

1. Open `https://www.elitesurgicalcoders.com` (or your chosen canonical URL).
2. Submit the **contact form**; confirm email arrives at `elitesurgicalcoders@gmail.com`.
3. **Google Search Console**: add property, verify (DNS or HTML), submit `https://YOUR-DOMAIN/sitemap.xml`.
4. In Vercel, set **one** canonical domain (redirect apex ↔ www if needed).

---

## Blog & careers (current behavior)

- **Navigation & footer:** Resources and Careers links are **removed**.
- **URLs:** `/resources`, `/resources/*`, `/careers`, `/careers/*` **redirect to `/`** (temporary; `permanent: false`).
- **Sitemap:** No blog/career URLs listed.
- **Admin:** `/admin` blog/career tools still exist if you need them later; they are not linked in the public header/footer.

To bring blog/careers back: restore nav/footer links, remove `redirects()` entries for those paths in `next.config.js`, and restore `sitemap.ts` dynamic URLs from `blog-db` / `career-db`.
