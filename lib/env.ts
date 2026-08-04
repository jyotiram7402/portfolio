import { z } from "zod";

/**
 * Client-safe environment.
 *
 * Only `NEXT_PUBLIC_*` values live here, so this module is importable from anywhere.
 * Every field is optional with a defined fallback: a missing variable degrades a feature,
 * it never fails the build.
 *
 * Server-only secrets live in `lib/env.server.ts`, behind a `server-only` import.
 */

const booleanish = z
  .enum(["true", "false", "1", "0"])
  .transform((value) => value === "true" || value === "1");

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string().min(1).optional(),

  NEXT_PUBLIC_ENABLE_ANALYTICS: booleanish.optional(),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().min(1).optional(),

  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().regex(/^G-[A-Z0-9]+$/).optional(),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1).optional(),
  NEXT_PUBLIC_PLAUSIBLE_HOST: z.string().url().optional(),
  NEXT_PUBLIC_CLARITY_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

  NEXT_PUBLIC_CALENDLY_URL: z.string().url().optional(),
  NEXT_PUBLIC_CHAT_REMOTE: booleanish.optional(),
  NEXT_PUBLIC_ENABLE_PWA: booleanish.optional(),
});

/**
 * Reads from `process.env` member-by-member. Next.js inlines
 * `process.env.NEXT_PUBLIC_X` statically, so destructuring or spreading `process.env` in
 * client code would yield `undefined`.
 */
const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  NEXT_PUBLIC_PLAUSIBLE_HOST: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
  NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_CALENDLY_URL: process.env.NEXT_PUBLIC_CALENDLY_URL,
  NEXT_PUBLIC_CHAT_REMOTE: process.env.NEXT_PUBLIC_CHAT_REMOTE,
  NEXT_PUBLIC_ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA,
});

if (!parsed.success && process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.warn(
    "[env] Invalid public environment variables — falling back to defaults:\n",
    parsed.error.flatten().fieldErrors,
  );
}

const raw = parsed.success ? parsed.data : {};

const DEFAULT_PORT = 3000;

/** Canonical origin, without a trailing slash. */
function resolveSiteUrl(): string {
  if (raw.NEXT_PUBLIC_SITE_URL) {
    return raw.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  // Available on the server during Vercel preview deployments.
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${DEFAULT_PORT}`;
}

export const env = {
  siteUrl: resolveSiteUrl(),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  analytics: {
    /** Defaults to on in production, off locally, unless explicitly set. */
    enabled:
      raw.NEXT_PUBLIC_ENABLE_ANALYTICS ?? process.env.NODE_ENV === "production",
    googleId: raw.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    plausibleDomain: raw.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    plausibleHost: raw.NEXT_PUBLIC_PLAUSIBLE_HOST,
    clarityId: raw.NEXT_PUBLIC_CLARITY_ID,
    posthogKey: raw.NEXT_PUBLIC_POSTHOG_KEY,
    posthogHost: raw.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  },

  emailjs: {
    serviceId: raw.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
    templateId: raw.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
    publicKey: raw.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
    get configured(): boolean {
      return Boolean(
        this.serviceId.length > 0 &&
          this.templateId.length > 0 &&
          this.publicKey.length > 0,
      );
    },
  },

  /** Calendly scheduling link. Absent means the booking panel shows the email route. */
  calendlyUrl: raw.NEXT_PUBLIC_CALENDLY_URL,

  /** Routes the assistant through `/api/chat` instead of the in-browser knowledge base. */
  chatRemote: raw.NEXT_PUBLIC_CHAT_REMOTE ?? false,

  /**
   * Service worker registration. Off in development on purpose — a cached shell is the
   * single most confusing thing to debug against a hot-reloading dev server.
   */
  pwaEnabled:
    raw.NEXT_PUBLIC_ENABLE_PWA ?? process.env.NODE_ENV === "production",

  verification: {
    google: raw.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
} as const;

export type Env = typeof env;
