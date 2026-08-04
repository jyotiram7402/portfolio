/**
 * Global type declarations.
 *
 * `Window` is deliberately not augmented here. The Lenis instance used to live on
 * `window.lenis`, and the declaration proved unreliable: `import type Lenis from "lenis"` inside a
 * `.d.ts` resolved to a different declaration than the value import in the provider did, so the
 * assignment failed to typecheck. It now lives in `lib/lenis-store.ts` as a module-scoped
 * singleton, which is typed at exactly one point and cannot collide with a dependency's own global
 * augmentation.
 *
 * `lib/analytics.ts` does augment `Window`, for the four analytics globals. That belongs beside the
 * facade that reads them rather than here, because those properties genuinely are set by external
 * scripts on the real `window`.
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production" | "test";

      readonly NEXT_PUBLIC_SITE_URL?: string;

      readonly NEXT_PUBLIC_EMAILJS_SERVICE_ID?: string;
      readonly NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?: string;
      readonly NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?: string;

      readonly NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
      readonly NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
      readonly NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
      readonly NEXT_PUBLIC_PLAUSIBLE_DOMAIN?: string;
      readonly NEXT_PUBLIC_PLAUSIBLE_HOST?: string;
      readonly NEXT_PUBLIC_CLARITY_ID?: string;
      readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
      readonly NEXT_PUBLIC_POSTHOG_HOST?: string;

      readonly NEXT_PUBLIC_CALENDLY_URL?: string;
      readonly NEXT_PUBLIC_CHAT_REMOTE?: string;
      readonly NEXT_PUBLIC_ENABLE_PWA?: string;

      readonly GITHUB_USERNAME?: string;
      readonly GITHUB_TOKEN?: string;

      readonly RESEND_API_KEY?: string;
      readonly CONTACT_TO_EMAIL?: string;
      readonly CONTACT_FROM_EMAIL?: string;

      readonly NEWSLETTER_API_KEY?: string;
      readonly NEWSLETTER_LIST_ID?: string;

      readonly ANTHROPIC_API_KEY?: string;
      readonly OPENAI_API_KEY?: string;

      /** Injected by Vercel. Useful as a fallback canonical origin. */
      readonly VERCEL_URL?: string;
      readonly VERCEL_ENV?: "production" | "preview" | "development";
    }
  }
}

export {};
