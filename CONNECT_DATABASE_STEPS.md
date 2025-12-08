# Connect Vercel Postgres Database - Final Steps

## ✅ Database Created Successfully!

Your database `elite-surgical-coders-db1` is created and available. The name doesn't matter - it's just a label.

## 🎯 Next Steps (Do These Now)

### Step 1: Connect Database to Your Project

1. **On the database page**, click the **"Connect Project"** button
2. **Select your project:** `elite-surgical-coders` (or your project name)
3. **Select environments:** Check all three:
   - ✅ Development
   - ✅ Preview  
   - ✅ Production
4. **Click "Connect"**

This will automatically add environment variables to your project.

### Step 2: Verify Environment Variables

1. Go to **Settings** → **Environment Variables**
2. **Check that these exist:**
   - `PRISMA_DATABASE_URL` (or `POSTGRES_PRISMA_URL`)
   - `POSTGRES_URL`
   - `DATABASE_URL` (should be set automatically)

3. **If `DATABASE_URL` is missing or wrong:**
   - Click "Show secret" next to `PRISMA_DATABASE_URL`
   - Copy its value
   - Create/Update `DATABASE_URL` with that value
   - Or set it to: `$PRISMA_DATABASE_URL`

### Step 3: Update Build Command

1. Go to **Settings** → **General** → **Build & Development Settings**
2. **Update Build Command** to:
   ```
   prisma migrate deploy && npm run build
   ```
3. **Click "Save"**

This ensures migrations run automatically on each deployment.

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. **Watch the build logs:**
   - Should see "Running migrations"
   - Should see "Prisma Client generated"
   - Build should succeed ✅

### Step 5: Verify Database Works

1. **Test contact form:**
   - Visit your deployed site
   - Submit a test contact form
   - Check if it succeeds

2. **View data in Vercel:**
   - Go to **Storage** tab
   - Click on your database
   - You should see the `Lead` table with your test submission

## ✅ Checklist

- [ ] Database connected to project
- [ ] Environment variables verified
- [ ] `DATABASE_URL` is set correctly
- [ ] Build command updated to include migrations
- [ ] Redeployed successfully
- [ ] Contact form tested and working
- [ ] Data visible in Vercel Storage dashboard

## 🎉 You're Done!

Once all steps are complete, your database is fully configured and ready for production!

---

## 📝 Notes

- **Database name:** `elite-surgical-coders-db1` is fine - it's just a label
- **Environment variables:** Vercel creates them automatically when you connect
- **Migrations:** Will run automatically on each deployment with the updated build command
- **No code changes needed:** Your Prisma schema is already configured correctly

