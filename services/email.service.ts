import { env } from "@/lib/env";
import type { ServiceResult } from "@/types/api";

/**
 * Contact delivery via EmailJS.
 *
 * EmailJS is a browser SDK, so this runs client-side. Two consequences are
 * handled deliberately:
 *
 * 1. The SDK is loaded with a dynamic `import()`, keeping ~15 kB out of every
 *    page that does not have a form on it.
 *
 * 2. The public key is public by design. Rate limiting and domain allow-listing
 *    are configured in the EmailJS dashboard, which is where that protection
 *    belongs — there is no secret to hide here.
 */

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export interface ValidationIssues {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  messageMin: 10,
  messageMax: 2000,
} as const;

/**
 * Validates a payload before it leaves the browser.
 *
 * Returns an issue map keyed by field so the form can render errors inline;
 * an empty object means valid.
 */
export function validateContactPayload(payload: ContactPayload): ValidationIssues {
  const issues: ValidationIssues = {};
  const name = payload.name.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();

  if (name.length < LIMITS.nameMin) {
    issues.name = "Please enter your name.";
  } else if (name.length > LIMITS.nameMax) {
    issues.name = `Keep this under ${LIMITS.nameMax} characters.`;
  }

  if (!EMAIL_PATTERN.test(email)) {
    issues.email = "Please enter a valid email address.";
  }

  if (message.length < LIMITS.messageMin) {
    issues.message = `Tell me a little more — at least ${LIMITS.messageMin} characters.`;
  } else if (message.length > LIMITS.messageMax) {
    issues.message = `Keep this under ${LIMITS.messageMax} characters.`;
  }

  return issues;
}

export function isValid(issues: ValidationIssues): boolean {
  return Object.keys(issues).length === 0;
}

export async function sendContactEmail(
  payload: ContactPayload,
): Promise<ServiceResult<{ delivered: true }>> {
  if (!env.emailjs.configured) {
    return {
      ok: false,
      error: {
        message: "Email delivery is not configured.",
        code: "not_configured",
      },
    };
  }

  const issues = validateContactPayload(payload);
  if (!isValid(issues)) {
    return {
      ok: false,
      error: {
        message: Object.values(issues)[0] ?? "Please check the form.",
        code: "parse",
      },
    };
  }

  try {
    const { default: emailjs } = await import("@emailjs/browser");

    await emailjs.send(
      env.emailjs.serviceId,
      env.emailjs.templateId,
      {
        from_name: payload.name.trim(),
        from_email: payload.email.trim(),
        subject: payload.subject?.trim() ?? "Portfolio enquiry",
        message: payload.message.trim(),
      },
      { publicKey: env.emailjs.publicKey },
    );

    return { ok: true, data: { delivered: true } };
  } catch (cause) {
    return {
      ok: false,
      error: {
        message: "Message could not be sent. Please email me directly.",
        code: "network",
        cause,
      },
    };
  }
}

export const emailService = {
  sendContactEmail,
  validateContactPayload,
  isValid,
  limits: LIMITS,
  get configured(): boolean {
    return env.emailjs.configured;
  },
} as const;
