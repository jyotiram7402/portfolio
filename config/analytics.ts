import { env } from "@/lib/env";
import type { AnalyticsProviderConfig, AnalyticsProviderId } from "@/types/analytics";

/**
 * Analytics configuration.
 *
 * Five providers, each independently toggled by the presence of its own credential. There is
 * no master switch beyond `env.analytics.enabled`, which defaults to on in production and off
 * locally — local page views would otherwise pollute real traffic, and the beacons are noise
 * in the network panel while developing.
 *
 * A provider with no token is simply absent: its script is never injected, and
 * `lib/analytics.ts` skips it. That means the default deployment ships exactly one analytics
 * request (Vercel's, which needs no key) rather than five broken ones.
 */

const base = env.analytics.enabled;

export const analyticsProviders: readonly AnalyticsProviderConfig[] = [
  {
    id: "vercel",
    label: "Vercel Analytics",
    // Needs no key on Vercel, and is cookie-free — which is why it is the default.
    enabled: base,
  },
  {
    id: "google",
    label: "Google Analytics 4",
    enabled: base && Boolean(env.analytics.googleId),
    token: env.analytics.googleId,
  },
  {
    id: "plausible",
    label: "Plausible",
    enabled: base && Boolean(env.analytics.plausibleDomain),
    token: env.analytics.plausibleDomain,
    // Supports proxying through your own domain to survive blockers.
    host: env.analytics.plausibleHost,
  },
  {
    id: "clarity",
    label: "Microsoft Clarity",
    enabled: base && Boolean(env.analytics.clarityId),
    token: env.analytics.clarityId,
  },
  {
    id: "posthog",
    label: "PostHog",
    enabled: base && Boolean(env.analytics.posthogKey),
    token: env.analytics.posthogKey,
    host: env.analytics.posthogHost,
  },
];

export function isProviderEnabled(id: AnalyticsProviderId): boolean {
  return analyticsProviders.some(
    (provider) => provider.id === id && provider.enabled,
  );
}

export function getProvider(
  id: AnalyticsProviderId,
): AnalyticsProviderConfig | undefined {
  return analyticsProviders.find((provider) => provider.id === id);
}

export const analyticsConfig = {
  providers: analyticsProviders,
  isProviderEnabled,
  getProvider,
  get enabledCount(): number {
    return analyticsProviders.filter((provider) => provider.enabled).length;
  },
  /**
   * Cookie-free providers need no consent banner. Google Analytics and PostHog do — so if
   * either is switched on, a consent gate becomes a requirement, not a nicety.
   */
  get requiresConsent(): boolean {
    return isProviderEnabled("google") || isProviderEnabled("posthog");
  },
} as const;
