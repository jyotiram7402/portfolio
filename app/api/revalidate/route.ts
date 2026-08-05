import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { githubService } from "@/services/github.service";
import { serverEnv } from "@/lib/env.server";

/**
 * `POST /api/revalidate`
 *
 * Drops the GitHub fetch cache on demand, so a newly tagged repository appears immediately instead
 * of waiting out the hour-long revalidation window.
 *
 * Three ways to call it:
 *
 * 1. **Manually**, after tagging a repo:
 *    `curl -X POST "https://your-domain.com/api/revalidate?secret=…"`
 * 2. **A GitHub webhook**, so it fires automatically. Repository → Settings → Webhooks → add
 *    `https://your-domain.com/api/revalidate?secret=…`, content type `application/json`, and
 *    subscribe to *Repository* and *Push* events.
 * 3. **A Vercel cron**, if you would rather poll than push.
 *
 * The secret is required and compared in constant time. Without one the endpoint is a free cache-
 * buster: anyone could hold the origin at GitHub's rate limit by calling it in a loop.
 */
export const runtime = "nodejs";

/**
 * Constant-time comparison.
 *
 * `a === b` on strings short-circuits at the first differing character, which leaks the length of
 * the matching prefix through response timing. That is a real, if slow, way to recover a secret.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function POST(request: Request) {
  const expected = serverEnv.revalidateSecret;

  if (!expected) {
    return NextResponse.json(
      {
        error: "Revalidation is not configured.",
        hint: "Set REVALIDATE_SECRET and redeploy.",
      },
      { status: 501 },
    );
  }

  const url = new URL(request.url);
  const provided =
    url.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret") ??
    "";

  if (!safeEqual(provided, expected)) {
    // No detail about why. A 401 that distinguishes "missing" from "wrong" is a hint.
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  revalidateTag(githubService.cacheTag);

  return NextResponse.json(
    { revalidated: true, tag: githubService.cacheTag, at: Date.now() },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
