# Fix PrismaClientInitializationError - Database Setup

## 🔴 Problem
You're seeing `PrismaClientInitializationError` when trying to login or use the contact form. This means:
- Database is connected BUT tables don't exist yet
- OR database connection is not configured

## ✅ Solution: Run Database Migrations

### Step 1: Verify Database Connection

1. **Check Vercel Environment Variables:**
   - Go to your project → **Settings** → **Environment Variables**
   - Verify `DATABASE_URL` exists and has a Postgres connection string
   - Should look like: `postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb?sslmode=require`

2. **Test Database Connection:**
   - Visit: `https://your-app.vercel.app/api/setup-db`
   - This will tell you if database is connected and if tables exist

### Step 2: Run Migrations (Create Tables)

You need to create the database tables. Here are your options:

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   cd "C:\Users\shail\Downloads\Elite Web"
   vercel link
   ```
   - Select your project when prompted
   - Use default settings

4. **Pull environment variables:**
   ```bash
   vercel env pull .env.local
   ```
   This creates a `.env.local` file with your production environment variables

5. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
   
   This will create all the tables in your database.

6. **Create Admin User:**
   ```bash
   npm run init-admin
   ```
   Follow the prompts to create your admin account.

#### Option B: Using Prisma Studio (Alternative)

1. **Pull environment variables:**
   ```bash
   vercel env pull .env.local
   ```

2. **Open Prisma Studio:**
   ```bash
   npx prisma studio
   ```

3. **Manually create tables** (not recommended, use migrations instead)

#### Option C: Using Vercel Dashboard + API Route

1. **Create a migration API route** (temporary):
   - I can create this for you if needed

2. **Call it once** to set up tables

3. **Delete the route** after setup

### Step 3: Verify Setup

1. **Test database connection:**
   - Visit: `https://your-app.vercel.app/api/setup-db`
   - Should show: "Database is already set up"

2. **Test login:**
   - Go to: `https://your-app.vercel.app/admin/login`
   - Try logging in with your admin credentials

3. **Test contact form:**
   - Go to: `https://your-app.vercel.app/contact`
   - Submit the form
   - Should work without errors

## 🔧 Troubleshooting

### Error: "Can't reach database server"

**Solution:**
1. Check `DATABASE_URL` in Vercel environment variables
2. Verify database is connected in Vercel Storage
3. Make sure connection string includes `?sslmode=require`

### Error: "Migration failed"

**Solution:**
1. Check Prisma schema matches your database provider (Postgres)
2. Verify `DATABASE_URL` is correct
3. Try: `npx prisma migrate reset` (WARNING: This deletes all data!)
4. Then: `npx prisma migrate deploy`

### Error: "Tables already exist"

**Solution:**
- This is fine! Your database is already set up
- Just create an admin user: `npm run init-admin`

### Still Getting PrismaClientInitializationError

**Check:**
1. ✅ `DATABASE_URL` is set in Vercel
2. ✅ Database is connected in Vercel Storage
3. ✅ Migrations have been run
4. ✅ Prisma schema uses `postgresql` (not `sqlite`)

## 📋 Quick Checklist

- [ ] Database created in Vercel Storage
- [ ] `DATABASE_URL` environment variable set
- [ ] Prisma schema uses `postgresql`
- [ ] Migrations run: `npx prisma migrate deploy`
- [ ] Admin user created: `npm run init-admin`
- [ ] Test login works
- [ ] Test contact form works

## 🚀 After Setup

Once migrations are complete:
1. **Delete the setup-db route** (it's just for testing)
2. **Your app should work normally**
3. **All API routes should function**

---

**The main issue is that tables don't exist. Run migrations and you're good to go!** ✅

