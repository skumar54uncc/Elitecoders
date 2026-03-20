# Security notes

## What this codebase enforces

- **Admin session:** HMAC-signed cookie (`SESSION_SECRET` required in production at **runtime** on the server).
- **HTTP headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` (see `next.config.js`).
- **Public HTML from CMS:** Blog and career body HTML is passed through **sanitize-html** before `dangerouslySetInnerHTML` to reduce stored XSS risk.
- **Rate limits (in-memory):** Contact form, login, job applications, resume uploads — best-effort per IP; for strict/global limits use Redis/Upstash.
- **Job applications:** Resume URL must be an `https` URL on `*.supabase.co` under `/storage/v1/object/public/` (matches uploads from this app).
- **Dev / diagnostic APIs:** `/api/test-email`, `/api/test-storage`, `/api/setup-db` return **404 in production** unless `ENABLE_DEV_API=true` (avoid leaving this on).
- **Login errors:** Generic messages; no internal error strings returned on 500.

## Operational checklist

1. Set strong `**SESSION_SECRET`** (32+ random bytes) in production.
2. Use **HTTPS** only (`secure` cookies on Vercel/production).
3. Keep `**SUPABASE_SERVICE_ROLE_KEY`** server-only (never `NEXT_PUBLIC_*`).
4. Rotate SMTP and DB credentials if they were ever exposed.
5. Run `npm audit` periodically and patch dependencies.

## Known limitations

- In-memory rate limits reset per serverless instance and are not a substitute for WAF / edge rate limiting at scale.
- Admin users who can edit HTML in the CMS are trusted; sanitization is defense-in-depth.

