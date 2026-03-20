# Favicon (logo in Google / browser tab)

Google shows a small icon next to your site in results. It comes from your site’s **favicon**.

## Next steps after RealFaviconGenerator

**Do not paste the HTML into `index.html`** — this project uses Next.js. The `<head>` tags are already represented in **`app/layout.tsx`**.

1. **Download** the favicon package from RealFaviconGenerator (**Step 1** on their site).
2. **Unzip** and copy **every file** from the package into your project’s **`public/`** folder (same level as `logo/`), for example:
   - `favicon.ico`
   - `favicon.svg`
   - `favicon-96x96.png`
   - `apple-touch-icon.png`
   - `site.webmanifest`
   - `web-app-manifest-192x192.png`
   - `web-app-manifest-512x512.png`  
   *(Names may vary slightly — if something is missing, remove that line from `metadata.icons` in `app/layout.tsx` or rename files to match.)*
3. **Commit** the new files and **push** → Vercel deploys.
4. **Check** your live site: open `https://www.elitesurgicalcoders.com/favicon.ico` — it should download or display (not 404).
5. On RealFaviconGenerator **Step 4**, enter your live URL and click **Check** (optional).
6. **Google** can take **days** to update the icon in search; use **Search Console** → URL Inspection → **Request indexing** for the homepage after deploy.

### `apple-mobile-web-app-title`

That title is set in code as **`appleWebApp.title`** in `app/layout.tsx` (`"Elite Surgical Coders"`). Change it there if you want a shorter home-screen name.

### If your zip uses different filenames

Open `site.webmanifest` in the zip — it lists paths. Either keep those paths and filenames when copying into `public/`, or adjust `app/layout.tsx` `metadata.icons` to match what you actually have.

---

# Ranking in Google, Bing, etc.

## Brand searches (e.g. “elite surgical coders”)

You’re already in a good position when people search your **business name**. Keep **NAP** consistent (name, address, phone) on site, **Google Business Profile**, and directories.

## Broader searches (e.g. “surgical coding New York”)

Those are **competitive**. There is no guaranteed “top” placement, but this helps:

| Action | Why |
|--------|-----|
| **Google Search Console** | Verify property, submit `https://www.elitesurgicalcoders.com/sitemap.xml`, fix coverage issues. |
| **Bing Webmaster Tools** | Import from Google or verify site; submit sitemap. |
| **Quality content** | Clear service pages, real headings, helpful copy (you already have service/specialty pages). |
| **Technical** | Fast site, HTTPS, mobile-friendly, `NEXT_PUBLIC_SITE_URL` correct, no broken links. |
| **Local SEO** | Accurate **Google Business Profile**, same address/phone as site, reviews over time. |
| **Links** | Legitimate links from partners, associations, local listings (avoid spammy link schemes). |

## About the snippet Google shows

The title and description in results come from **your page metadata** and sometimes **Google’s rewrite**. If you still see old text (“what we Offer…”), it may be from a **previous Squarespace site** or **Google Business** until Google re-crawls. Request indexing for key URLs in Search Console after major changes.
