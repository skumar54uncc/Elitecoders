# Vercel Build Fix

## Current Issue

The build is failing because:
1. **Missing `DATABASE_URL` environment variable** - Prisma requires this even for client generation
2. **SQLite doesn't work on Vercel** - Vercel's serverless platform has a read-only filesystem, so SQLite databases won't persist

## Immediate Fix (To Get Build Working)

### Step 1: Add DATABASE_URL in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name:** `DATABASE_URL`
   - **Value:** `file:./dev.db` (temporary placeholder for build)
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**

### Step 2: Verify Build Command

1. Go to **Settings** → **General** → **Build & Development Settings**
2. Ensure **Build Command** is set to:
   ```
   npm run build
   ```
   (NOT `npm run db:generate && npm run build`)

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger rebuild

## Important: SQLite Won't Work in Production

**SQLite is NOT compatible with Vercel's serverless platform.** You MUST switch to Postgres for production.

### Why SQLite Fails on Vercel:
- Vercel uses serverless functions with read-only filesystems
- SQLite requires write access to create/update database files
- Database files won't persist between function invocations

## Production Solution: Switch to Postgres

### Option 1: Vercel Postgres (Recommended - Easiest)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click **Storage** tab
   - Click **Create Database** → **Postgres**
   - Follow the setup wizard
   - Vercel will automatically add `POSTGRES_URL` environment variable

2. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Update Environment Variable:**
   - In Vercel, update `DATABASE_URL` to use `POSTGRES_URL`:
   - Go to **Settings** → **Environment Variables**
   - Update `DATABASE_URL` to: `$POSTGRES_URL` (or copy the value from POSTGRES_URL)

4. **Run Migrations:**
   - Add to build command: `prisma migrate deploy && npm run build`
   - Or run manually: `npx prisma migrate deploy`

### Option 2: External Postgres (Supabase, Neon, Railway, etc.)

1. **Create Postgres Database:**
   - Sign up for Supabase, Neon, Railway, or another Postgres provider
   - Create a new database
   - Copy the connection string

2. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Add Environment Variable in Vercel:**
   - **Name:** `DATABASE_URL`
   - **Value:** Your Postgres connection string (e.g., `postgresql://user:password@host:5432/dbname`)
   - **Environment:** Production, Preview, Development

4. **Run Migrations:**
   - Add to build command: `prisma migrate deploy && npm run build`
   - Or run manually: `npx prisma migrate deploy`

## Migration Steps

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Create Migration:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Switch from SQLite to Postgres for Vercel deployment"
   git push origin main
   ```

4. **Update Vercel Build Command (if needed):**
   ```
   prisma migrate deploy && npm run build
   ```

## Quick Fix Summary

**For immediate build fix (testing only):**
1. Add `DATABASE_URL="file:./dev.db"` in Vercel environment variables
2. Build command: `npm run build`
3. Redeploy

**For production (required):**
1. Set up Postgres (Vercel Postgres recommended)
2. Update `prisma/schema.prisma` to use `postgresql`
3. Add `DATABASE_URL` with Postgres connection string
4. Run migrations
5. Deploy

## Troubleshooting

### Build Still Fails After Adding DATABASE_URL

1. **Check Prisma Generation:**
   - The `postinstall` script runs `prisma generate`
   - If this fails, check the build logs for Prisma errors

2. **Check Build Logs:**
   - Look for specific error messages after "Prisma schema loaded"
   - Common issues:
     - Missing environment variables
     - TypeScript errors
     - Missing dependencies

3. **Test Locally:**
   ```bash
   npm install
   npm run build
   ```
   If it works locally but fails on Vercel, it's likely an environment variable issue.

### Database Connection Errors in Production

- Ensure `DATABASE_URL` is set correctly
- For Vercel Postgres, use `$POSTGRES_URL` or copy the value
- Check that migrations have been run
- Verify database is accessible from Vercel's IP ranges (if using external Postgres)
