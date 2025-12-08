# Windows Permission Error Fix

## Issue: EPERM Error with Prisma

If you encounter this error:
```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node.tmp...'
```

## Solution

### Quick Fix:

1. **Stop all Node processes:**
   ```powershell
   taskkill /F /IM node.exe
   ```

2. **Clean Prisma cache:**
   ```powershell
   Remove-Item -Path "node_modules\.prisma" -Recurse -Force
   ```

3. **Regenerate Prisma:**
   ```powershell
   npx prisma generate
   ```

4. **Try again:**
   ```powershell
   npm install
   ```

### Alternative: Full Clean Install

If the above doesn't work:

1. **Stop all processes:**
   ```powershell
   taskkill /F /IM node.exe
   ```

2. **Delete node_modules and lock file:**
   ```powershell
   Remove-Item -Path "node_modules" -Recurse -Force
   Remove-Item -Path "package-lock.json" -Force
   ```

3. **Reinstall:**
   ```powershell
   npm install
   ```

## Prevention

- Always stop the dev server (`Ctrl+C`) before running `npm install`
- Close VS Code or other editors that might have file watchers
- Don't run multiple `npm` commands simultaneously

## Common Causes

- Dev server still running
- VS Code file watchers
- Antivirus software locking files
- Another terminal running Node

---

**The error should now be resolved!** ✅

