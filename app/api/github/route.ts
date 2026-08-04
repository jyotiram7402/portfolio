import { NextResponse } from "next/server";

import { githubService } from "@/services/github.service";

/**
 * `GET /api/github`
 *
 * A thin, cacheable projection of the GitHub data the UI needs.
 *
 * Why a route handler at all, when Server Components can call the service
 * directly? Because a client-side "refresh" affordance — and any future
 * incremental loading of the repository list — needs an HTTP surface, and this is
 * the only place the token can be used without shipping it to the browser.
 *
 * `?type=` selects the projection so the client never over-fetches:
 *   profile | repos | stats  (default: stats)
 *
 * Failures return the service's message with a matching status. The token is
 * never echoed, and no upstream response body is forwarded verbatim.
 */

/**
 * Reading `searchParams` makes this handler dynamic, so a segment-level
 * `revalidate` would be ignored. Caching is therefore expressed where it
 * actually applies: the service's `next: { revalidate }` on the upstream fetch,
 * plus the `Cache-Control` header below for the CDN.
 */
type Projection = "profile" | "repos" | "stats";

function parseProjection(value: string | null): Projection {
  return value === "profile" || value === "repos" ? value : "stats";
}

function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed)) return 12;
  return Math.min(Math.max(parsed, 1), 100);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const projection = parseProjection(url.searchParams.get("type"));

  const result =
    projection === "profile"
      ? await githubService.getProfile()
      : projection === "repos"
        ? await githubService.getRepositories({
            limit: parseLimit(url.searchParams.get("limit")),
            sort: "stars",
          })
        : await githubService.getStats();

  if (!result.ok) {
    const status =
      result.error.code === "not_configured"
        ? 501
        : result.error.code === "rate_limited"
          ? 429
          : (result.error.status ?? 502);

    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status },
    );
  }

  return NextResponse.json(
    { data: result.data },
    {
      headers: {
        // Serve stale while revalidating: a visitor never waits on GitHub.
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
