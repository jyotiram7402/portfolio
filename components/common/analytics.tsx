import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import {
  ClarityAnalytics,
  GoogleAnalytics,
  PlausibleAnalytics,
  PostHogAnalytics,
} from "@/components/analytics/provider-scripts";
import { analyticsConfig, isProviderEnabled } from "@/config/analytics";
import { env } from "@/lib/env";

/**
 * Every analytics provider, composed.
 *
 * Sprint 0 shipped this as Vercel-only; Sprint 4 turns it into the registry the whole site
 * reports through. The gate is unchanged — `env.analytics.enabled` defaults to on in production
 * and off locally, because local page views pollute real traffic data and the beacons are noise
 * in the network panel while developing.
 *
 * Beyond that, each provider is independently enabled by the presence of its own credential.
 * An empty environment therefore ships exactly one analytics request (Vercel's, which needs no
 * key and sets no cookie) rather than five broken ones.
 *
 * A Server Component: every branch resolves at build time and the disabled paths emit nothing.
 *
 * **Consent.** Vercel Analytics, Speed Insights, Plausible and Clarity are cookie-free and need
 * no banner. Google Analytics and PostHog do. `analyticsConfig.requiresConsent` reports when
 * either is switched on, and wiring a consent gate in front of this component is the Sprint 5
 * item that goes with it — nothing here should be enabled in the EU without one.
 */
export function Analytics() {
  if (!env.analytics.enabled) return null;

  return (
    <>
      {isProviderEnabled("vercel") ? (
        <>
          <VercelAnalytics />
          <SpeedInsights />
        </>
      ) : null}

      <GoogleAnalytics />
      <PlausibleAnalytics />
      <ClarityAnalytics />
      <PostHogAnalytics />

      {/* A one-line audit trail in the HTML, so "is analytics on in production?" is
          answerable from view-source rather than from a dashboard login. */}
      {env.isProduction ? (
        <meta
          name="x-analytics-providers"
          content={String(analyticsConfig.enabledCount)}
        />
      ) : null}
    </>
  );
}
