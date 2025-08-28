// Simple in-memory rate limiter for serverless (best effort)
// Note: Works per warm instance only. Suitable for dev and basic protection.

type Key = string; // ip:path

type Bucket = {
  tokens: number;
  updatedAt: number;
};

const buckets = new Map<Key, Bucket>();

export type RateLimitOptions = {
  windowMs: number; // time window in ms
  max: number; // max requests per window
};

export function rateLimit(key: Key, opts: RateLimitOptions) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: opts.max, updatedAt: now };

  // refill based on elapsed time (token bucket)
  const elapsed = now - bucket.updatedAt;
  const refill = Math.floor((elapsed / opts.windowMs) * opts.max);
  if (refill > 0) {
    bucket.tokens = Math.min(opts.max, bucket.tokens + refill);
    bucket.updatedAt = now;
  }

  const allowed = bucket.tokens > 0;
  if (allowed) bucket.tokens -= 1;

  buckets.set(key, bucket);
  return {
    allowed,
    remaining: bucket.tokens,
    resetMs: Math.max(0, opts.windowMs - (now - bucket.updatedAt)),
  };
}

export function getClientIp(req: any): string {
  // Vercel provides x-forwarded-for
  const xf = req.headers?.["x-forwarded-for"] || req.headers?.["X-Forwarded-For"]; // string | string[]
  const raw = Array.isArray(xf) ? xf[0] : xf;
  return (raw?.split(",")[0] || req.socket?.remoteAddress || "unknown").toString();
}