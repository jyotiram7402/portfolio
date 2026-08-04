import "server-only";

/**
 * Rate limiting.
 *
 * A fixed-window counter in module memory, behind an interface so the store can be swapped for
 * Upstash Redis or Vercel KV without touching a route handler.
 *
 * **What this is honestly good for.** On a single long-lived server it works exactly as
 * intended. On serverless it is per-instance: a determined attacker who triggers cold starts
 * gets a fresh window each time, so treat it as a courtesy limit that stops accidental
 * double-submits and casual abuse — not as a security control. The upgrade path is one class,
 * documented at the bottom of this file, and it is the first thing to do if the contact form
 * ever attracts real traffic.
 *
 * The window is fixed rather than sliding on purpose. A sliding window needs either a sorted
 * set or a per-request timestamp list; a fixed window needs one integer, and for "five
 * messages an hour" the difference in fairness is not worth the memory.
 */

export interface RateLimitResult {
  /** False when the request should be rejected. */
  allowed: boolean;
  /** Requests remaining in the current window. */
  remaining: number;
  /** Unix milliseconds when the window resets. */
  resetAt: number;
  limit: number;
}

export interface RateLimiter {
  readonly id: string;
  check(key: string): Promise<RateLimitResult>;
}

export interface RateLimitOptions {
  /** Requests permitted per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * In-memory fixed-window limiter.
 *
 * Expired buckets are swept opportunistically on write rather than on a timer: an interval
 * would keep a serverless instance alive, which is exactly the wrong trade for a limiter.
 */
export class MemoryRateLimiter implements RateLimiter {
  readonly id = "memory";

  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly options: RateLimitOptions) {}

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const { limit, windowMs } = this.options;

    // Bounded sweep. A full scan on every request would be O(n) per call; capping it keeps
    // the cost constant while still reclaiming memory under sustained traffic.
    if (this.buckets.size > 512) {
      let inspected = 0;
      for (const [existingKey, bucket] of this.buckets) {
        if (bucket.resetAt <= now) this.buckets.delete(existingKey);
        if (++inspected >= 64) break;
      }
    }

    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      const resetAt = now + windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetAt, limit };
    }

    existing.count += 1;

    return {
      allowed: existing.count <= limit,
      remaining: Math.max(0, limit - existing.count),
      resetAt: existing.resetAt,
      limit,
    };
  }
}

/** Always allows. Used when a limiter is deliberately disabled in development. */
export class NoopRateLimiter implements RateLimiter {
  readonly id = "noop";

  async check(): Promise<RateLimitResult> {
    return { allowed: true, remaining: Number.MAX_SAFE_INTEGER, resetAt: 0, limit: 0 };
  }
}

/**
 * Per-route limiters, created once at module scope.
 *
 * Creating one per request would reset the window on every call, which is the classic way this
 * gets silently broken.
 */
export const rateLimiters = {
  /** Contact form. Five an hour is generous for a human and hostile to a script. */
  contact: new MemoryRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 }),
  /** Newsletter. Three an hour — nobody legitimately subscribes twice. */
  newsletter: new MemoryRateLimiter({ limit: 3, windowMs: 60 * 60 * 1000 }),
  /** Assistant. Generous, because a curious visitor asks a lot of questions. */
  chat: new MemoryRateLimiter({ limit: 60, windowMs: 60 * 1000 }),
} as const;

/**
 * Best-effort client identity.
 *
 * `x-forwarded-for` is the first proxy hop and is the value Vercel sets. It is spoofable in
 * principle, which is another reason this is a courtesy limit — but on Vercel the header is
 * overwritten at the edge, so in practice it is the real client address.
 *
 * Falls back to a constant so a request with no headers is limited globally rather than not at
 * all. Failing closed is the right default for a limiter.
 */
export function getClientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  const address =
    forwarded?.split(",")[0]?.trim() ?? realIp?.trim() ?? "unknown-client";

  return `${scope}:${address}`;
}

/** Standard headers, so a client can back off intelligently rather than retrying blind. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.allowed
      ? {}
      : {
          "Retry-After": String(
            Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000)),
          ),
        }),
  };
}

/* ---------------------------------------------------------------------------
 * Upgrade path — distributed limiting.
 *
 * Add `@upstash/redis`, then:
 *
 *   export class RedisRateLimiter implements RateLimiter {
 *     readonly id = "redis";
 *     constructor(
 *       private readonly redis: Redis,
 *       private readonly options: RateLimitOptions,
 *     ) {}
 *
 *     async check(key: string): Promise<RateLimitResult> {
 *       const window = Math.floor(Date.now() / this.options.windowMs);
 *       const slot = `rl:${key}:${window}`;
 *
 *       // INCR then EXPIRE in a pipeline — one round trip, and the TTL is only set
 *       // on the first increment, so the window cannot be extended by later hits.
 *       const [count] = await this.redis
 *         .pipeline()
 *         .incr(slot)
 *         .expire(slot, Math.ceil(this.options.windowMs / 1000), "NX")
 *         .exec<[number, number]>();
 *
 *       const resetAt = (window + 1) * this.options.windowMs;
 *       return {
 *         allowed: count <= this.options.limit,
 *         remaining: Math.max(0, this.options.limit - count),
 *         resetAt,
 *         limit: this.options.limit,
 *       };
 *     }
 *   }
 *
 * Then swap the entries in `rateLimiters`. No route handler changes.
 * ------------------------------------------------------------------------- */
