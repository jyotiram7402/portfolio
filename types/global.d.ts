import type Lenis from "lenis";

declare global {
  /**
   * The single Lenis instance created by `LenisProvider`.
   *
   * Exposed on `window` so non-React callers (GSAP ScrollTrigger's scroller
   * proxy, anchor handlers rendered by MDX) can reach it without threading a
   * ref through the tree. Always guard with a truthiness check: it is
   * `undefined` on touch devices and when reduced motion is requested.
   */
  interface Window {
    lenis?: Lenis;
  }

  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production" | "test";
      readonly NEXT_PUBLIC_SITE_URL?: string;
      readonly NEXT_PUBLIC_EMAILJS_SERVICE_ID?: string;
      readonly NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?: string;
      readonly NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?: string;
      readonly NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
      readonly NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
      readonly GITHUB_USERNAME?: string;
      readonly GITHUB_TOKEN?: string;
      /** Injected by Vercel. Useful as a fallback canonical origin. */
      readonly VERCEL_URL?: string;
      readonly VERCEL_ENV?: "production" | "preview" | "development";
    }
  }
}

export {};
