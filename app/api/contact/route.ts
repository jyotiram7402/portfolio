import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env.server";
import {
  getClientKey,
  rateLimitHeaders,
  rateLimiters,
} from "@/lib/rate-limit";
import { contactSchema, toFieldErrors } from "@/services/contact.schema";
import { formatContactBody } from "@/services/contact.service";

/**
 * `POST /api/contact`
 *
 * The preferred delivery route: the provider credential stays server-side, the submission is
 * validated somewhere the caller cannot skip, and the request is rate limited.
 *
 * The order of checks is the security-relevant part. Rate limiting comes before parsing, so a
 * flood cannot be used to burn CPU on schema validation. Bot checks come before the provider call,
 * so a caught submission never costs an API request.
 *
 * Both bot checks fail *quietly*: a caught submission receives the same 200 a real one does. A bot
 * that learns which signal tripped it is a bot that adapts.
 *
 * With Resend unconfigured the route returns 501 with `code: "not_configured"`, which is the signal
 * `contact.service.ts` uses to fall through to EmailJS. Nothing is silently dropped anywhere in
 * that chain.
 */

/** Runs on Node rather than the edge: the Resend SDK and the limiter both want a real runtime. */
export const runtime = "nodejs";

interface DeliveryResult {
  ok: boolean;
  status: number;
}

/**
 * Sends through Resend's REST API directly rather than through its SDK.
 *
 * One `fetch` against a stable endpoint, versus a dependency, its transitive tree and a version to
 * keep current — for a single POST. Swap it for the SDK the moment more than one call is needed.
 */
async function deliver(subject: string, body: string, replyTo: string): Promise<DeliveryResult> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serverEnv.resend.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: serverEnv.resend.from || `Portfolio <onboarding@resend.dev>`,
      to: [serverEnv.resend.to],
      reply_to: replyTo,
      subject,
      text: body,
    }),
    // A hung upstream must not hold the function open until the platform kills it.
    signal: AbortSignal.timeout(10_000),
  });

  return { ok: response.ok, status: response.status };
}

export async function POST(request: Request) {
  /* ------------------------------------------------------------ rate limit -- */
  const limit = await rateLimiters.contact.check(getClientKey(request, "contact"));
  const headers = rateLimitHeaders(limit);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages from this address. Try again shortly.", code: "rate_limited" },
      { status: 429, headers },
    );
  }

  /* ----------------------------------------------------------------- parse -- */
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Expected a JSON body.", code: "parse" },
      { status: 400, headers },
    );
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    const fields = toFieldErrors(parsed.error);
    return NextResponse.json(
      {
        error: Object.values(fields)[0] ?? "Check the form and try again.",
        code: "parse",
        fields,
      },
      { status: 400, headers },
    );
  }

  const data = parsed.data;

  /* -------------------------------------------------------------- bot gate -- */
  // Honeypot filled, or the form completed faster than a person could read it. Both
  // return the success shape so the sender learns nothing.
  const trippedHoneypot = data.website !== undefined && data.website.length > 0;
  const tooFast = data.elapsedMs !== undefined && data.elapsedMs < 2000;

  if (trippedHoneypot || tooFast) {
    return NextResponse.json({ delivered: true }, { status: 200, headers });
  }

  /* -------------------------------------------------------------- delivery -- */
  if (!serverEnv.resend.configured) {
    // 501 rather than 500: the request was fine, the server has no implementation
    // configured. This is what makes the client fall through to EmailJS.
    return NextResponse.json(
      {
        error: "Server-side email delivery is not configured.",
        code: "not_configured",
      },
      { status: 501, headers },
    );
  }

  const subject = data.company
    ? `Portfolio enquiry — ${data.company.trim()}`
    : `Portfolio enquiry — ${data.name.trim()}`;

  try {
    const result = await deliver(subject, formatContactBody(data), data.email.trim());

    if (!result.ok) {
      // The upstream status is deliberately not echoed: it is a provider detail and,
      // for an auth failure, a hint about the deployment's configuration.
      return NextResponse.json(
        { error: "The message could not be delivered. Try email directly.", code: "http" },
        { status: 502, headers },
      );
    }

    return NextResponse.json({ delivered: true }, { status: 200, headers });
  } catch {
    return NextResponse.json(
      { error: "Delivery timed out. Try email directly.", code: "timeout" },
      { status: 504, headers },
    );
  }
}
