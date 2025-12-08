# Production Readiness Checklist

Complete checklist to ensure your Elite Surgical Coders website is production-ready before deployment.

## ✅ Code Quality Checks

### 1. TypeScript & Linting
- [x] **TypeScript compilation:** No errors (`npx tsc --noEmit` passed)
- [x] **ESLint:** No linting errors
- [x] **Type safety:** All components properly typed

### 2. Error Handling
- [x] **Blog system:** Graceful error handling for missing files/directories
- [x] **API routes:** Try-catch blocks for database and email operations
- [x] **Database:** Handles connection failures gracefully
- [x] **Email:** Continues even if email sending fails

### 3. Build Process
- [x] **Build command:** `npm run build` works locally
- [x] **Prisma generation:** Included in build script
- [x] **Static generation:** Blog posts generate without errors

---

## 🔧 Vercel Configuration (CRITICAL)

### Step 1: Environment Variables (MUST DO BEFORE DEPLOYMENT)

Go to **Vercel Dashboard → Settings → Environment Variables** and add:

#### Required for Build:
```
✅ DATABASE_URL=file:./dev.db
   (Temporary - will be replaced with Postgres)
```

#### Required for Contact Form:
```
✅ SMTP_HOST=smtp.gmail.com
✅ SMTP_PORT=587
✅ SMTP_USER=your-email@gmail.com
✅ SMTP_PASS=your-app-password
✅ SMTP_FROM=your-email@gmail.com
✅ INTERNAL_NOTIFICATION_EMAIL=notifications@elitesurgicalcoders.com
```

#### Required for Site Functionality:
```
✅ NEXT_PUBLIC_PHONE=+1-XXX-XXX-XXXX
✅ NEXT_PUBLIC_EMAIL=info@elitesurgicalcoders.com
✅ NEXT_PUBLIC_ADDRESS=80-02 Kew Gardens Road, Kew Gardens, NY 11415
✅ NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   (Update after deployment with actual URL)
```

#### Optional (Recommended):
```
⏸️ NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
⏸️ NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
⏸️ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

**⚠️ IMPORTANT:** 
- Select **Production, Preview, Development** for all variables
- For Gmail, create an "App Password" (not your regular password)
- Update `NEXT_PUBLIC_SITE_URL` after first deployment

### Step 2: Build Settings

Go to **Settings → General → Build & Development Settings**:

- [ ] **Build Command:** `npm run build` ✅ (Correct)
- [ ] **Output Directory:** `.next` ✅ (Default)
- [ ] **Install Command:** `npm install` ✅ (Default)
- [ ] **Node.js Version:** 18.x or 20.x ✅

### Step 3: Database Setup (REQUIRED FOR PRODUCTION)

**⚠️ CRITICAL:** SQLite does NOT work on Vercel. You MUST use Postgres.

#### Option A: Vercel Postgres (Recommended)

1. [ ] Go to **Storage** tab in Vercel project
2. [ ] Click **"Create Database"** → **"Postgres"**
3. [ ] Name it (e.g., `elite-surgical-coders-db`)
4. [ ] Select region closest to your users
5. [ ] Click **"Create"**
6. [ ] Vercel automatically adds `POSTGRES_PRISMA_URL`
7. [ ] Update `DATABASE_URL` to use `$POSTGRES_PRISMA_URL`
8. [ ] Update `prisma/schema.prisma` to use `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
9. [ ] Run migration locally:
   ```bash
   npx prisma migrate dev --name init
   ```
10. [ ] Commit and push changes
11. [ ] Update Vercel build command to:
    ```
    prisma migrate deploy && npm run build
    ```

#### Option B: External Postgres (Supabase, Neon, etc.)

1. [ ] Create Postgres database on external provider
2. [ ] Copy connection string
3. [ ] Add as `DATABASE_URL` in Vercel
4. [ ] Update `prisma/schema.prisma` to `postgresql`
5. [ ] Run migrations
6. [ ] Commit and push

---

## 📦 Pre-Deployment Steps

### Step 1: Test Build Locally
```bash
npm install
npm run build
npm start
```
- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] No console errors

### Step 2: Verify All Files Are Committed
```bash
git status
```
- [ ] All changes committed
- [ ] No uncommitted files (except `.env` which should be in `.gitignore`)

### Step 3: Push to GitHub
```bash
git push origin main
```
- [ ] Code pushed successfully
- [ ] Latest changes are on GitHub

### Step 4: Verify Repository
- [ ] Check GitHub: `https://github.com/skumar54uncc/elitesurgicalcoders`
- [ ] All files are present
- [ ] `content/blog` directory exists
- [ ] Blog posts are included

---

## 🚀 Deployment Steps

### Step 1: Initial Deployment
1. [ ] Import project to Vercel from GitHub
2. [ ] Add `DATABASE_URL=file:./dev.db` (temporary)
3. [ ] Click "Deploy"
4. [ ] Wait for build to complete
5. [ ] Note the deployment URL

### Step 2: Add All Environment Variables
1. [ ] Add all required environment variables (see above)
2. [ ] Update `NEXT_PUBLIC_SITE_URL` with actual Vercel URL
3. [ ] Redeploy

### Step 3: Set Up Database
1. [ ] Create Vercel Postgres database
2. [ ] Update `DATABASE_URL` with Postgres connection
3. [ ] Update Prisma schema to `postgresql`
4. [ ] Run migrations
5. [ ] Commit and push
6. [ ] Redeploy

### Step 4: Test Deployment
- [ ] Home page loads
- [ ] All navigation links work
- [ ] Services page displays
- [ ] Resources/Blog page displays
- [ ] Individual blog posts load
- [ ] Contact form submits successfully
- [ ] Emails are received (internal + auto-reply)
- [ ] Google Maps loads (if API key added)
- [ ] Mobile responsive design works

---

## 🔍 Post-Deployment Verification

### Functionality Tests
- [ ] **Contact Form:**
  - [ ] Form validation works
  - [ ] Submission succeeds
  - [ ] Internal notification email received
  - [ ] Auto-reply email sent to submitter
  - [ ] Lead saved in database

- [ ] **Blog System:**
  - [ ] Blog posts display on `/resources`
  - [ ] Individual posts load correctly
  - [ ] Images load (if provided)
  - [ ] Markdown formatting works

- [ ] **SEO:**
  - [ ] Meta tags present
  - [ ] Open Graph tags work
  - [ ] Sitemap accessible: `/sitemap.xml`
  - [ ] Robots.txt accessible: `/robots.txt`

- [ ] **Performance:**
  - [ ] Pages load quickly
  - [ ] Images optimized
  - [ ] No console errors

### Security Checks
- [ ] **Environment Variables:**
  - [ ] No sensitive data in code
  - [ ] `.env` in `.gitignore`
  - [ ] All secrets in Vercel environment variables

- [ ] **API Routes:**
  - [ ] Input validation working
  - [ ] Error messages don't expose sensitive info
  - [ ] Rate limiting (if needed)

### Analytics (If Configured)
- [ ] Google Analytics tracking works
- [ ] Google Tag Manager fires correctly
- [ ] Events tracked properly

---

## 🐛 Common Issues & Fixes

### Build Fails
**Issue:** Build fails with Prisma error
**Fix:** 
1. Ensure `DATABASE_URL` is set in Vercel
2. Check build command is `npm run build`
3. Verify Prisma schema is correct

**Issue:** Build fails during blog generation
**Fix:**
1. Code updated with better error handling
2. Ensure `content/blog` directory exists
3. Check blog files have valid frontmatter

### Database Connection Errors
**Issue:** "Can't reach database server"
**Fix:**
1. Verify `DATABASE_URL` is correct
2. For Vercel Postgres, use `$POSTGRES_PRISMA_URL`
3. Check database is running
4. Verify network access

### Email Not Sending
**Issue:** Contact form submits but no emails
**Fix:**
1. Verify all SMTP variables are set
2. For Gmail, use App Password (not regular password)
3. Check email service isn't blocking
4. Review Vercel function logs

### Blog Posts Not Showing
**Issue:** Blog page is empty
**Fix:**
1. Verify `content/blog` directory exists
2. Check blog files have `.txt` or `.md` extension
3. Ensure frontmatter is valid
4. Check build logs for errors

---

## 📝 Final Checklist Before Going Live

### Code
- [x] All TypeScript errors fixed
- [x] All linting errors fixed
- [x] Error handling in place
- [x] Build succeeds locally

### Configuration
- [ ] All environment variables set in Vercel
- [ ] Database configured (Postgres, not SQLite)
- [ ] Email service configured and tested
- [ ] Analytics configured (if using)

### Content
- [ ] All pages have content
- [ ] Contact information is correct
- [ ] Blog posts are formatted correctly
- [ ] Images are optimized and loading

### Testing
- [ ] All pages load correctly
- [ ] Contact form works end-to-end
- [ ] Emails are received
- [ ] Mobile responsive
- [ ] No console errors

### SEO
- [ ] Meta tags on all pages
- [ ] Sitemap submitted to Google Search Console
- [ ] Robots.txt configured
- [ ] Structured data (JSON-LD) present

### Security
- [ ] No sensitive data exposed
- [ ] Environment variables secured
- [ ] Input validation working
- [ ] HTTPS enabled (automatic on Vercel)

---

## 🎯 Quick Deployment Command Reference

```bash
# 1. Test build locally
npm run build

# 2. Check for errors
npx tsc --noEmit
npm run lint

# 3. Commit changes
git add .
git commit -m "Ready for production deployment"
git push origin main

# 4. Vercel will auto-deploy
# Or manually trigger in Vercel dashboard
```

---

## 🆘 Need Help?

If you encounter issues:
1. Check Vercel build logs for specific errors
2. Review this checklist for missed items
3. Verify all environment variables are set
4. Test locally first before deploying

---

## ✅ Success Criteria

Your site is production-ready when:
- ✅ Build succeeds on Vercel
- ✅ All pages load without errors
- ✅ Contact form submits and emails are sent
- ✅ Database is connected and working
- ✅ Blog posts display correctly
- ✅ Mobile responsive design works
- ✅ No console errors
- ✅ SEO metadata is present

**Once all items are checked, your site is ready for production! 🎉**

