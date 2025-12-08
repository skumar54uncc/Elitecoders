# Setting Up Vercel Postgres Database

Complete guide to create and configure a Postgres database directly in Vercel.

## 🎯 Step-by-Step Instructions

### Step 1: Create Postgres Database in Vercel

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account
   - Select your project (`elite-surgical-coders` or your project name)

2. **Navigate to Storage:**
   - In your project dashboard, click on the **"Storage"** tab
   - (If you don't see it, it might be in the left sidebar or under "More")

3. **Create Database:**
   - Click **"Create Database"** button
   - Select **"Postgres"** from the options
   - (You might see options like "Postgres", "KV", "Blob" - choose Postgres)

4. **Configure Database:**
   - **Database Name:** `elite-surgical-coders-db` (or your preferred name)
   - **Region:** Choose the region closest to your users (e.g., `us-east-1` for US East)
   - Click **"Create"**

5. **Wait for Creation:**
   - Vercel will create the database (takes 1-2 minutes)
   - You'll see a success message when it's ready

### Step 2: Vercel Automatically Adds Environment Variables

Once the database is created, Vercel automatically adds these environment variables:

- `POSTGRES_URL` - Direct connection string
- `POSTGRES_PRISMA_URL` - Connection string optimized for Prisma (use this one!)
- `POSTGRES_URL_NON_POOLING` - For migrations

**You don't need to manually add these - Vercel does it automatically!**

### Step 3: Update DATABASE_URL

1. **Go to Environment Variables:**
   - Navigate to **Settings** → **Environment Variables**

2. **Update DATABASE_URL:**
   - Find `DATABASE_URL` (or create it if it doesn't exist)
   - Set the value to: `$POSTGRES_PRISMA_URL`
   - Or copy the actual value from `POSTGRES_PRISMA_URL`
   - Make sure it's set for: **Production, Preview, Development**

3. **Alternative (Copy Value):**
   - You can also copy the actual connection string from `POSTGRES_PRISMA_URL`
   - It will look like: `postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15`

### Step 4: Update Prisma Schema

Update your `prisma/schema.prisma` file to use Postgres instead of SQLite:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}

model Lead {
  id              String   @id @default(cuid())
  createdAt       DateTime @default(now())
  name            String
  email           String
  organization    String
  role            String
  servicesNeeded  String   // JSON string array
  message         String
}
```

### Step 5: Create Migration

Run this command locally to create the migration:

```bash
npx prisma migrate dev --name init
```

This will:
- Create a migration file
- Apply it to your local database (if you have one)
- Generate the Prisma Client

### Step 6: Commit and Push Changes

```bash
git add prisma/
git commit -m "Switch from SQLite to Postgres for Vercel deployment"
git push origin main
```

### Step 7: Update Vercel Build Command (Optional but Recommended)

To automatically run migrations on each deployment:

1. Go to **Settings** → **General** → **Build & Development Settings**
2. Update **Build Command** to:
   ```
   prisma migrate deploy && npm run build
   ```

This ensures migrations run automatically on each deployment.

### Step 8: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger automatic deployment

---

## ✅ Verification

After deployment, verify the database is working:

1. **Check Build Logs:**
   - Should see "Prisma Client generated"
   - Should see "Running migrations" (if build command updated)
   - Build should succeed

2. **Test Contact Form:**
   - Submit a test contact form
   - Check if data is saved to database
   - You can view data in Vercel Storage dashboard

3. **View Database in Vercel:**
   - Go to **Storage** tab
   - Click on your Postgres database
   - You can view tables and data directly in Vercel dashboard

---

## 🔍 Troubleshooting

### Issue: "Can't reach database server"
**Solution:**
- Verify `DATABASE_URL` is set to `$POSTGRES_PRISMA_URL`
- Check database is created and running in Storage tab
- Ensure you're using `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)

### Issue: "Migration failed"
**Solution:**
- Run `npx prisma migrate deploy` locally first
- Or update build command to include migrations
- Check Prisma schema is correct

### Issue: "Connection timeout"
**Solution:**
- Verify database region is correct
- Check network connectivity
- Ensure database is not paused (Vercel free tier may pause inactive databases)

---

## 💰 Pricing Note

**Vercel Postgres Free Tier:**
- 256 MB storage
- 60 hours compute time per month
- Perfect for small to medium websites
- Database may pause after inactivity (auto-resumes on next request)

**Paid Plans:**
- Start at $20/month for more storage and always-on databases
- See [vercel.com/pricing](https://vercel.com/pricing) for details

---

## 🎉 Benefits of Vercel Postgres

✅ **Integrated:** Works seamlessly with Vercel deployments  
✅ **Automatic:** Environment variables added automatically  
✅ **Easy:** No external service setup required  
✅ **Secure:** Connection strings managed by Vercel  
✅ **Scalable:** Easy to upgrade as you grow  

---

## 📝 Quick Reference

**Database Connection:**
- Use `POSTGRES_PRISMA_URL` for Prisma
- Set `DATABASE_URL=$POSTGRES_PRISMA_URL` in environment variables

**Prisma Schema:**
- Change `provider = "sqlite"` to `provider = "postgresql"`

**Migrations:**
- Run `npx prisma migrate dev --name init` locally
- Add `prisma migrate deploy` to build command for auto-migrations

**View Data:**
- Go to Vercel Dashboard → Storage → Your Database
- View tables and data directly in the dashboard

---

Your database is now ready for production! 🚀

