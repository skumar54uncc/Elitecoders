# Vercel Deployment Guide

Complete step-by-step guide to deploy Elite Surgical Coders website to Vercel.

## 📋 Prerequisites

- GitHub repository: `https://github.com/skumar54uncc/elitesurgicalcoders`
- Vercel account (sign up at [vercel.com](https://vercel.com) - free tier available)
- Email service credentials (Gmail, SendGrid, etc.) for contact form

---

## 🚀 Step 1: Import Project to Vercel

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in or create an account (you can use GitHub to sign in)

2. **Import Repository:**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select **"GitHub"** and authorize Vercel if needed
   - Find and select: `skumar54uncc/elitesurgicalcoders`
   - Click **"Import"**

3. **Configure Project:**
   - **Project Name:** `elite-surgical-coders` (or your preferred name)
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (already configured in package.json)
   - **Output Directory:** `.next` (Next.js default)
   - **Install Command:** `npm install` (default)

4. **Click "Deploy"** (we'll add environment variables after)

---

## ⚙️ Step 2: Configure Environment Variables

**⚠️ CRITICAL:** You MUST add these environment variables before the build will succeed.

### Go to Project Settings:
1. After initial deployment attempt (or in project settings)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below:

### Required Environment Variables:

#### 1. DATABASE_URL (Required for Build)
```
Name: DATABASE_URL
Value: file:./dev.db
Environment: Production, Preview, Development (select all)
```
**Note:** This is temporary for build. For production, you'll need Postgres (see Step 3).

#### 2. Email Configuration (SMTP)
```
Name: SMTP_HOST
Value: smtp.gmail.com
Environment: Production, Preview, Development

Name: SMTP_PORT
Value: 587
Environment: Production, Preview, Development

Name: SMTP_USER
Value: your-email@gmail.com
Environment: Production, Preview, Development

Name: SMTP_PASS
Value: your-app-password
Environment: Production, Preview, Development
```
**Note:** For Gmail, you need to create an "App Password" in your Google Account settings.

```
Name: SMTP_FROM
Value: your-email@gmail.com
Environment: Production, Preview, Development
```

#### 3. Internal Notifications
```
Name: INTERNAL_NOTIFICATION_EMAIL
Value: notifications@elitesurgicalcoders.com
Environment: Production, Preview, Development
```

#### 4. Public Contact Information
```
Name: NEXT_PUBLIC_PHONE
Value: +1-555-123-4567
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_EMAIL
Value: info@elitesurgicalcoders.com
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_ADDRESS
Value: 80-02 Kew Gardens Road, Kew Gardens, NY 11415
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_SITE_URL
Value: https://your-vercel-domain.vercel.app
Environment: Production, Preview, Development
```
**Note:** Update `NEXT_PUBLIC_SITE_URL` after deployment with your actual Vercel URL or custom domain.

#### 5. Optional: Analytics
```
Name: NEXT_PUBLIC_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
Environment: Production, Preview, Development

Name: NEXT_PUBLIC_GTM_ID
Value: GTM-XXXXXXX
Environment: Production, Preview, Development
```

#### 6. Optional: Google Maps
```
Name: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
Value: your-google-maps-api-key
Environment: Production, Preview, Development
```

---

## 🗄️ Step 3: Set Up Database (REQUIRED for Production)

**⚠️ IMPORTANT:** SQLite does NOT work on Vercel. You MUST use Postgres.

### Option A: Vercel Postgres (Recommended - Easiest)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click **"Storage"** tab
   - Click **"Create Database"**
   - Select **"Postgres"**
   - Choose a name (e.g., `elite-surgical-coders-db`)
   - Select a region (closest to your users)
   - Click **"Create"**

2. **Vercel automatically adds:**
   - `POSTGRES_URL` environment variable
   - `POSTGRES_PRISMA_URL` (for Prisma)
   - `POSTGRES_URL_NON_POOLING` (for migrations)

3. **Update DATABASE_URL:**
   - Go to **Settings** → **Environment Variables**
   - Update `DATABASE_URL` to: `$POSTGRES_PRISMA_URL`
   - Or copy the value from `POSTGRES_PRISMA_URL`

4. **Update Prisma Schema:**
   - In your local project, edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

5. **Create and Push Migration:**
   ```bash
   npx prisma migrate dev --name init
   git add .
   git commit -m "Switch to Postgres for Vercel deployment"
   git push origin main
   ```

6. **Update Build Command (Optional):**
   - In Vercel: **Settings** → **General** → **Build & Development Settings**
   - Update **Build Command** to:
     ```
     prisma migrate deploy && npm run build
     ```
   - This runs migrations automatically on each deployment

### Option B: External Postgres (Supabase, Neon, Railway, etc.)

1. **Create Postgres Database:**
   - Sign up for [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app)
   - Create a new Postgres database
   - Copy the connection string

2. **Add to Vercel:**
   - Go to **Settings** → **Environment Variables**
   - Add/Update `DATABASE_URL` with your Postgres connection string:
     ```
     postgresql://user:password@host:5432/dbname?sslmode=require
     ```

3. **Update Prisma Schema:**
   - Same as Option A, step 4

4. **Run Migrations:**
   - Same as Option A, step 5

---

## 🔄 Step 4: Redeploy

After adding all environment variables:

1. **Go to Deployments tab**
2. **Click "Redeploy"** on the latest deployment
3. **Or push a new commit** to trigger automatic deployment:
   ```bash
   git commit --allow-empty -m "Trigger Vercel deployment"
   git push origin main
   ```

---

## ✅ Step 5: Verify Deployment

1. **Check Build Logs:**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Review build logs for any errors

2. **Test Your Site:**
   - Visit your Vercel URL (e.g., `https://elite-surgical-coders.vercel.app`)
   - Test all pages:
     - Home page
     - Services
     - Contact form (submit a test)
     - Blog/Resources page
     - All navigation links

3. **Test Contact Form:**
   - Submit a test contact form
   - Verify you receive:
     - Internal notification email
     - Auto-reply email to submitter

---

## 🌐 Step 6: Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Enter your domain (e.g., `elitesurgicalcoders.com`)
   - Click **"Add"**

2. **Configure DNS:**
   - Vercel will provide DNS records
   - Add them to your domain registrar:
     - **CNAME record:** `www` → `cname.vercel-dns.com`
     - **A record:** `@` → Vercel's IP addresses (if provided)

3. **Update Environment Variable:**
   - Update `NEXT_PUBLIC_SITE_URL` to your custom domain
   - Redeploy

---

## 🔧 Troubleshooting

### Build Fails with "Missing DATABASE_URL"
- **Solution:** Add `DATABASE_URL` environment variable (even if temporary: `file:./dev.db`)

### Build Fails with Prisma Error
- **Solution:** Ensure `DATABASE_URL` is set and Prisma schema is correct
- Check build logs for specific Prisma errors

### Database Connection Errors
- **Solution:** 
  - Verify `DATABASE_URL` format is correct
  - For Vercel Postgres, use `$POSTGRES_PRISMA_URL`
  - Ensure migrations have been run
  - Check database is accessible

### Contact Form Not Sending Emails
- **Solution:**
  - Verify all SMTP environment variables are set
  - For Gmail, ensure you're using an "App Password" (not regular password)
  - Check Vercel function logs for email errors

### Environment Variables Not Working
- **Solution:**
  - Ensure public variables start with `NEXT_PUBLIC_`
  - Redeploy after adding new variables
  - Check variable names match exactly (case-sensitive)

### SQLite Errors in Production
- **Solution:** You MUST switch to Postgres. SQLite doesn't work on Vercel's serverless platform.

---

## 📝 Quick Reference

### Build Command
```
npm run build
```
(This already includes `prisma generate`)

### Environment Variables Checklist
- [ ] `DATABASE_URL` (Postgres connection string for production)
- [ ] `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- [ ] `INTERNAL_NOTIFICATION_EMAIL`
- [ ] `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_ADDRESS`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] (Optional) `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- [ ] (Optional) `NEXT_PUBLIC_GTM_ID`
- [ ] (Optional) `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Post-Deployment Checklist
- [ ] All pages load correctly
- [ ] Contact form submits successfully
- [ ] Emails are received (internal + auto-reply)
- [ ] Blog posts display correctly
- [ ] Google Maps loads (if API key added)
- [ ] Mobile responsive design works
- [ ] All links and navigation work

---

## 🆘 Need Help?

- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Prisma with Vercel:** [prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

## 🎉 Success!

Once deployed, your website will be live at:
- **Vercel URL:** `https://your-project-name.vercel.app`
- **Custom Domain:** `https://yourdomain.com` (if configured)

The site will automatically redeploy on every push to the `main` branch!

