# Favicon (logo in Google / browser tab)

Google shows a small icon next to your site in results. It comes from your site’s **favicon**.

## What the code does now

- `app/layout.tsx` declares an icon at **`/logo/Logo.svg`** (same file as the header logo).
- Ensure **`public/logo/Logo.svg`** exists in the repo and deploys to Vercel.

## Strongly recommended: add `favicon.ico`

Google prefers a square **PNG or ICO**, often **48×48** or larger.

1. Open [RealFaviconGenerator](https://realfavicongenerator.net/) or similar.
2. Upload your logo (square crop works best).
3. Download the package and place in **`public/`**:
   - **`favicon.ico`** (required for broad support)
   - Optional: **`apple-touch-icon.png`** (180×180) for iOS bookmarks
4. In **`app/layout.tsx`**, extend `metadata.icons` to include:

```ts
icons: {
  icon: [
    { url: "/favicon.ico", sizes: "48x48" },
    { url: "/logo/Logo.svg", type: "image/svg+xml" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
},
```

5. Deploy, then wait **several days**; Google refreshes favicons on its own schedule. You can request re-indexing of the homepage in **Google Search Console**.

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
