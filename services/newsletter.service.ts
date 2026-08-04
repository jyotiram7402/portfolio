import {
  MIN_ELAPSED_MS,
  type SubscribeInput,
  subscribeSchema,
} from "@/services/newsletter.schema";
import type { ServiceResult } from "@/types/api";

/**
 * Newsletter subscription.
 *
 * The provider is deliberately absent. Sprint 3 ships the seam — validation, the API route,
 * the loading and success states — so wiring Buttondown, Resend or ConvertKit later is one
 * function body and no interface change.
 *
 * The schema lives in `newsletter.schema.ts` so the client form can share it without
 * importing this module, which reads a server-only environment variable.
 */

export type { SubscribeInput };
export { subscribeSchema };

export interface SubscribeResult {
  email: string;
  /** True when the provider is not configured and the address was only validated. */
  pending: boolean;
}

/**
 * Validates a submission and hands it to the provider.
 *
 * Returns a `ServiceResult` rather than throwing, matching every other service here: the
 * caller is forced by the type system to handle the failure branch.
 */
export async function subscribe(
  input: unknown,
): Promise<ServiceResult<SubscribeResult>> {
  const parsed = subscribeSchema.safeParse(input);

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: {
        message: first?.message ?? "Check the form and try again.",
        code: "parse",
      },
    };
  }

  const { email, company, elapsedMs } = parsed.data;

  // Both bot checks fail closed and, importantly, fail *quietly* — a bot that learns
  // which signal tripped it is a bot that adapts. A caught submission gets the same
  // response a real one does, and simply goes nowhere.
  if (company !== undefined && company.length > 0) {
    return { ok: true, data: { email, pending: true } };
  }
  if (elapsedMs !== undefined && elapsedMs < MIN_ELAPSED_MS) {
    return { ok: true, data: { email, pending: true } };
  }

  const providerKey = process.env.NEWSLETTER_API_KEY;
  if (!providerKey) {
    // No provider configured: the address is validated and acknowledged, and the caller
    // is told it is pending rather than being lied to about delivery.
    return { ok: true, data: { email, pending: true } };
  }

  // ---------------------------------------------------------------------------
  // Provider call goes here. Expected shape:
  //
  //   const result = await requestJson(`${PROVIDER_BASE}/subscribers`, {
  //     headers: { Authorization: `Bearer ${providerKey}` },
  //     ...
  //   });
  //   return result.ok ? { ok: true, data: { email, pending: false } } : result;
  //
  // Left unimplemented rather than stubbed with a fake success, so nothing here claims a
  // delivery that did not happen.
  // ---------------------------------------------------------------------------
  return { ok: true, data: { email, pending: true } };
}

export const newsletterService = {
  subscribe,
  subscribeSchema,
  minElapsedMs: MIN_ELAPSED_MS,
} as const;
