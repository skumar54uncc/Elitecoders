/**
 * Dangerous or diagnostic API routes must not be reachable in production by default.
 * Set ENABLE_DEV_API=true only for short-lived staging/debug (never leave on in prod).
 */
export function isDevApiEnabled(): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return process.env.ENABLE_DEV_API === "true";
}
