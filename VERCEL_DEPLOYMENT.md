# Vercel Deployment Guide

## ✅ Current Configuration Review

Based on your Vercel setup, here's what needs to be adjusted:

### 1. Project Name
**Current:** `Elite Web`  
**Recommended:** `Elite-Surgical-Coders` or `elite-surgical-coders`

### 2. Framework Preset
✅ **Correct:** Next.js

### 3. Root Directory
✅ **Correct:** `./`

### 4. Build Command
✅ **Correct:** `npm run build` or `next build`

**However, you need to add Prisma generation!** Update to:
```
npm run db:generate && npm run build
```

Or create a custom build script in `package.json`:
```json
"build": "prisma generate && next build"
```

### 5. Output Directory
✅ **Correct:** `Next.js default` (or leave empty)

### 6. Install Command
✅ **Correct:** Default (`npm install`, `yarn install`, etc.)

### 7. Environment Variables ⚠️ **IMPORTANT**

**Remove:** `EXAMPLE_NAME` variable

**Add these required environment variables:**

#### Required Variables:
```
DATABASE_URL=your-postgres-database-url
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
INTERNAL_NOTIFICATION_EMAIL=notifications@elitesurgicalcoders.com
```

#### Public Variables (NEXT_PUBLIC_*):
```
NEXT_PUBLIC_PHONE=+1-555-123-4567
NEXT_PUBLIC_EMAIL=info@elitesurgicalcoders.com
NEXT_PUBLIC_ADDRESS=80-02 Kew Gardens Road, Kew Gardens, NY 11415
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

#### Optional Variables:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## ⚠️ Important: Database Setup

**SQLite won't work on Vercel!** You need to switch to Postgres:

### Option 1: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to your project
2. Navigate to "Storage" tab
3. Create a new Postgres database
4. Copy the connection string
5. Update `DATABASE_URL` environment variable

### Option 2: External Postgres (Supabase, Neon, etc.)
1. Create a Postgres database on Supabase/Neon/Railway
2. Get the connection string
3. Add to `DATABASE_URL` in Vercel

### Update Prisma Schema
After setting up Postgres, update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run migrations:
```bash
npx prisma migrate dev --name init
```

## 📋 Vercel Configuration Checklist

- [ ] Change project name to `Elite-Surgical-Coders`
- [ ] Update build command to include Prisma: `npm run db:generate && npm run build`
- [ ] Remove `EXAMPLE_NAME` environment variable
- [ ] Add all required environment variables (see above)
- [ ] Set up Postgres database (not SQLite)
- [ ] Update Prisma schema to use Postgres
- [ ] Run Prisma migrations
- [ ] Test the deployment

## 🚀 Deployment Steps

1. **Click "Deploy"** in Vercel
2. **Wait for build** to complete
3. **Check build logs** for any errors
4. **Test the live site:**
   - Visit your Vercel URL
   - Test contact form
   - Check blog posts load
   - Verify Google Maps (if API key added)

## 🔧 Post-Deployment

1. **Update sitemap URL:**
   - Set `NEXT_PUBLIC_SITE_URL` to your actual domain
   - Submit sitemap to Google Search Console

2. **Configure custom domain** (if you have one):
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS instructions

3. **Test email functionality:**
   - Submit a test contact form
   - Verify emails are sent correctly

## 🐛 Common Issues

**Build fails with Prisma error:**
- Make sure build command includes `prisma generate`
- Check that `DATABASE_URL` is set correctly

**Database connection errors:**
- Verify `DATABASE_URL` format is correct
- Check database is accessible from Vercel
- Ensure Prisma schema uses `postgresql` not `sqlite`

**Environment variables not working:**
- Make sure public variables start with `NEXT_PUBLIC_`
- Redeploy after adding new variables

## 📝 Recommended Build Command

Update your `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

This ensures Prisma client is generated during build and after install.

