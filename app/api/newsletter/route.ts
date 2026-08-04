import { NextResponse } from "next/server";

import { getClientKey, rateLimitHeaders, rateLimiters } from "@/lib/rate-limit";
import { subscribe } from "@/services/newsletter.service";

/**
 * `POST /api/newsletter`
 *
 * The endpoint exists so the client never needs a provider credential, and so validation happens
 * somewhere the caller cannot skip. The form validates with the same Zod schema first, but that is
 * a courtesy — anything arriving here is untrusted regardless of what sent it.
 *
 * Rate limited before parsing, so a flood cannot be used to burn CPU on validation. Three an hour
 * per address is generous: nobody legitimately subscribes twice.
 *
 * Errors return the service's message with a 400. Nothing about the provider, the honeypot or the
 * timing check is echoed back — a bot that learns which signal caught it is a bot that adapts.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = await rateLimiters.newsletter.check(
    getClientKey(request, "newsletter"),
  );
  const headers = rateLimitHeaders(limit);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "That is a few too many attempts. Try again later." },
      { status: 429, headers },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Expected a JSON body." },
      { status: 400, headers },
    );
  }

  const result = await subscribe(payload);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 400, headers },
    );
  }

  return NextResponse.json(
    { email: result.data.email, pending: result.data.pending },
    {
      status: 200,
      // Never cached: it is a write, and a cached 200 would swallow the next submission.
      headers: { ...headers, "Cache-Control": "no-store" },
    },
  );
}
