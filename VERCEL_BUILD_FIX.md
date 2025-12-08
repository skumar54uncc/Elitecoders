# Vercel Build Fix

## Issue
The build is failing because Vercel is trying to run `npm run db:generate && npm run build`, but it should just run `npm run build`.

## Solution

### In Vercel Dashboard:

1. **Go to your project settings**
2. **Navigate to "Settings" → "General" → "Build & Development Settings"**
3. **Update the Build Command to:**
   ```
   npm run build
   ```
   (NOT `npm run db:generate && npm run build`)

### Why This Works

The `build` script in `package.json` already includes Prisma generation:
```json
"build": "prisma generate && next build"
```

So you only need to run `npm run build` - it will automatically:
1. Generate Prisma client
2. Build the Next.js app

## Alternative: Use vercel-build Script

If you want to keep a separate script, you can also use:
```
npm run vercel-build
```

This script is also configured in `package.json`.

## Important Notes

### Without DATABASE_URL

Since you're testing without `.env`:
- Prisma will try to generate but may show a warning about missing DATABASE_URL
- The build should still succeed (Prisma client generation doesn't require a database connection)
- Once you add DATABASE_URL, everything will work properly

### For Production

When you're ready to deploy with database:
1. Set up Postgres (Vercel Postgres or external)
2. Add `DATABASE_URL` environment variable in Vercel
3. Update `prisma/schema.prisma` to use `postgresql` instead of `sqlite`
4. Run migrations: `npx prisma migrate deploy` (or use Vercel's build command)

## Quick Fix Steps

1. **In Vercel Dashboard:**
   - Settings → General → Build Command
   - Change to: `npm run build`
   - Save

2. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger rebuild

The build should now succeed!

