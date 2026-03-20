import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();
const MAX_KEYS = 50_000;

function pruneIfNeeded() {
  if (store.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [k, v] of store) {
    if (now > v.resetAt) store.delete(k);
    if (store.size <= MAX_KEYS * 0.8) break;
  }
}

/**
 * Best-effort rate limit (in-memory). On serverless, each instance has its own map;
 * still limits casual abuse. For strict limits, use Redis/Upstash in production.
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 45);
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.slice(0, 45);
  return "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: true; retryAfter?: number } | { ok: false; retryAfter: number } {
  pruneIfNeeded();
  const now = Date.now();
  let bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 1, resetAt: now + windowMs };
    store.set(key, bucket);
    return { ok: true };
  }

  if (bucket.count >= limit) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return { ok: false, retryAfter: Math.max(1, retryAfter) };
  }

  bucket.count += 1;
  return { ok: true };
}
