import { env } from "@/lib/env";
import { emailService } from "@/services/email.service";
import {
  type ContactInput,
  contactSchema,
  toFieldErrors,
} from "@/services/contact.schema";
import type { ServiceResult } from "@/types/api";
import type { ContactTransportId } from "@/types/contact";

/**
 * Contact delivery.
 *
 * Three transports behind one interface, tried in order of reliability. That ordering is the
 * whole design:
 *
 *   1. **`/api/contact`** — server-side, rate-limited, delivers through Resend. The credential
 *      never reaches the browser and the submission is validated somewhere the caller cannot
 *      skip. Preferred whenever it is configured.
 *   2. **EmailJS** — client-side fallback. Its public key is public by design; rate limiting
 *      and domain allow-listing are configured in the EmailJS dashboard, which is where that
 *      protection belongs.
 *   3. **Unconfigured** — returns a typed failure that tells the form to show the mailto route.
 *      It never pretends to have sent anything.
 *
 * The EmailJS path delegates to Sprint 0's `emailService` rather than re-integrating the SDK:
 * one EmailJS call site, one dynamic import, one place to change if the provider does.
 */

export interface ContactTransport {
  readonly id: ContactTransportId;
  readonly available: boolean;
  send(payload: ContactInput): Promise<ServiceResult<{ delivered: true }>>;
}

/**
 * Formats the structured fields into a readable body.
 *
 * Needed because EmailJS templates take flat strings, and because a message that arrives
 * without the company, role and budget beside it is a message that needs a reply asking for
 * them.
 */
export function formatContactBody(payload: ContactInput): string {
  const lines = [
    payload.message.trim(),
    "",
    "—",
    `From: ${payload.name.trim()} <${payload.email.trim()}>`,
  ];

  if (payload.company) lines.push(`Company: ${payload.company.trim()}`);
  if (payload.role) lines.push(`Role: ${payload.role.trim()}`);
  lines.push(`Enquiry type: ${payload.projectType}`);
  if (payload.budget && payload.budget !== "not-applicable") {
    lines.push(`Budget: ${payload.budget}`);
  }

  return lines.join("\n");
}

/* -------------------------------------------------------------------------- */
/*  Transports                                                                */
/* -------------------------------------------------------------------------- */

class ApiTransport implements ContactTransport {
  readonly id = "api" as const;

  /**
   * Always considered available from the client's perspective: whether Resend is configured is
   * a server-side fact, and the route answers with a typed failure when it is not. Probing for
   * it would mean an extra round trip on every page load.
   */
  readonly available = true;

  async send(payload: ContactInput): Promise<ServiceResult<{ delivered: true }>> {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        return {
          ok: false,
          error: {
            message: retryAfter
              ? `That is a few too many messages. Try again in about ${Math.ceil(Number(retryAfter) / 60)} minutes.`
              : "That is a few too many messages in a short window. Try again shortly.",
            code: "rate_limited",
            status: 429,
          },
        };
      }

      const body = (await response.json()) as { error?: string; code?: string };

      if (!response.ok) {
        return {
          ok: false,
          error: {
            message: body.error ?? "The message could not be sent.",
            // `not_configured` is the signal that makes the caller fall through
            // to EmailJS rather than showing an error.
            code: body.code === "not_configured" ? "not_configured" : "http",
            status: response.status,
          },
        };
      }

      return { ok: true, data: { delivered: true } };
    } catch (cause) {
      return {
        ok: false,
        error: { message: "Network request failed.", code: "network", cause },
      };
    }
  }
}

class EmailJsTransport implements ContactTransport {
  readonly id = "emailjs" as const;

  get available(): boolean {
    return env.emailjs.configured;
  }

  async send(payload: ContactInput): Promise<ServiceResult<{ delivered: true }>> {
    if (!this.available) {
      return {
        ok: false,
        error: { message: "EmailJS is not configured.", code: "not_configured" },
      };
    }

    // Delegates to Sprint 0's service, which owns the only EmailJS integration.
    return emailService.sendContactEmail({
      name: payload.name,
      email: payload.email,
      subject: payload.company
        ? `Portfolio enquiry — ${payload.company.trim()}`
        : "Portfolio enquiry",
      message: formatContactBody(payload),
    });
  }
}

class UnconfiguredTransport implements ContactTransport {
  readonly id = "unconfigured" as const;
  readonly available = false;

  async send(): Promise<ServiceResult<{ delivered: true }>> {
    return {
      ok: false,
      error: {
        message: "No delivery route is configured.",
        code: "not_configured",
      },
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  Orchestration                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Validates, then sends through the first transport that succeeds.
 *
 * The fallthrough is narrow on purpose: only `not_configured` moves to the next transport. A
 * network error or a rate limit is reported as-is, because retrying the same message through a
 * second provider would risk delivering it twice.
 */
export async function sendContactMessage(
  input: unknown,
): Promise<ServiceResult<{ delivered: true; via: ContactTransportId }>> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    const fields = toFieldErrors(parsed.error);
    const first = Object.values(fields)[0];
    return {
      ok: false,
      error: { message: first ?? "Check the form and try again.", code: "parse" },
    };
  }

  const transports: readonly ContactTransport[] = [
    new ApiTransport(),
    new EmailJsTransport(),
    new UnconfiguredTransport(),
  ];

  let lastError: ServiceResult<never>["error"] | undefined;

  for (const transport of transports) {
    if (!transport.available) continue;

    const result = await transport.send(parsed.data);
    if (result.ok) {
      return { ok: true, data: { delivered: true, via: transport.id } };
    }

    lastError = result.error;
    if (result.error.code !== "not_configured") break;
  }

  return {
    ok: false,
    error:
      lastError ?? {
        message: "No delivery route is configured.",
        code: "not_configured",
      },
  };
}

export const contactService = {
  sendContactMessage,
  formatContactBody,
  /** True when at least one client-visible transport can attempt delivery. */
  get hasClientTransport(): boolean {
    return env.emailjs.configured;
  },
} as const;
