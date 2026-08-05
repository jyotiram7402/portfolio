import "server-only";

/**
 * Server-only environment.
 *
 * The `server-only` import makes any accidental client import a build error, which is the
 * guarantee that keeps these values out of the browser bundle.
 *
 * Nothing here is required. Every integration degrades to a documented, honest fallback —
 * the GitHub panel says it is not connected, the contact form falls back to EmailJS or to a
 * mailto, the newsletter validates and reports `pending`. That is what makes the first deploy
 * possible with an empty environment.
 */

const githubUsername = process.env.GITHUB_USERNAME ?? "";
const githubToken = process.env.GITHUB_TOKEN ?? "";
const resendKey = process.env.RESEND_API_KEY ?? "";
const contactTo = process.env.CONTACT_TO_EMAIL ?? "";
const newsletterKey = process.env.NEWSLETTER_API_KEY ?? "";

export const serverEnv = {
  github: {
    username: githubUsername,
    token: githubToken,
    /** Unauthenticated requests are rate-limited to 60/hour per IP. */
    authenticated: githubToken.length > 0,
    configured: githubUsername.length > 0,
  },

  /**
   * Transactional email for the contact form.
   *
   * Both halves are required: a key with no recipient has nowhere to deliver, and a recipient
   * with no key has nothing to deliver with. `configured` therefore checks the pair rather
   * than either one.
   */
  resend: {
    apiKey: resendKey,
    to: contactTo,
    from: process.env.CONTACT_FROM_EMAIL ?? "",
    configured: resendKey.length > 0 && contactTo.length > 0,
  },

  newsletter: {
    apiKey: newsletterKey,
    listId: process.env.NEWSLETTER_LIST_ID ?? "",
    configured: newsletterKey.length > 0,
  },

  /** Reserved for the LLM migration. See `services/ai.service.ts`. */
  llm: {
    anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
    openAiKey: process.env.OPENAI_API_KEY ?? "",
    get configured(): boolean {
      return this.anthropicKey.length > 0 || this.openAiKey.length > 0;
    },
  },

  /**
   * Shared secret for `POST /api/revalidate`, which drops the GitHub fetch cache so a newly tagged
   * repository appears immediately. Absent: the endpoint returns 501 and the hourly revalidation
   * window applies as normal.
   */
  revalidateSecret: process.env.REVALIDATE_SECRET ?? "",

  vercel: {
    env: process.env.VERCEL_ENV,
    url: process.env.VERCEL_URL,
  },
} as const;

export type ServerEnv = typeof serverEnv;

/**
 * Reports which integrations are live.
 *
 * Called from the build log rather than thrown on, deliberately: a missing key is a feature
 * that degrades, not a broken deployment, and a build that fails because analytics is
 * unconfigured is a build that gets its check removed within a week.
 */
export function describeIntegrations(): readonly {
  name: string;
  configured: boolean;
  consequence: string;
}[] {
  return [
    {
      name: "GitHub",
      configured: serverEnv.github.configured,
      consequence: "Dashboard renders an explanatory panel instead of live data.",
    },
    {
      name: "Resend (contact)",
      configured: serverEnv.resend.configured,
      consequence:
        "Contact form falls back to EmailJS, then to a mailto link. Nothing silently drops.",
    },
    {
      name: "Newsletter",
      configured: serverEnv.newsletter.configured,
      consequence: "Subscriptions validate and report `pending` rather than claiming delivery.",
    },
    {
      name: "LLM",
      configured: serverEnv.llm.configured,
      consequence: "Assistant runs on the local structured knowledge base.",
    },
  ];
}
