"use client";

import { analyticsConfig } from "@/config/analytics";
import type {
  AnalyticsEventName,
  AnalyticsProperties,
} from "@/types/analytics";

/**
 * The analytics facade.
 *
 * One call site, five possible destinations. `trackEvent("resume_download", { variant })` fans
 * out to whichever providers are enabled and does nothing at all when none are — which is the
 * common case locally and on a fresh deploy.
 *
 * Three properties this design buys:
 *
 * • **Event names are a union.** A dashboard fills up with `resume_download`,
 *   `resumeDownload` and `download-resume` within a month otherwise, and none of them can be
 *   compared to the others.
 * • **No provider SDK at a call site.** A component never imports `posthog-js`, so swapping a
 *   provider touches this file and a script tag, never a feature.
 * • **It cannot throw.** An ad blocker removing `window.gtag` must not take a download button
 *   with it, so every dispatch is individually guarded.
 *
 * Deliberately not sent: anything a visitor typed. Message bodies, email addresses and form
 * contents never reach an analytics provider — only that a submission happened.
 */

/* -------------------------------------------------------------------------- */
/*  Provider globals                                                          */
/* -------------------------------------------------------------------------- */

type GtagFn = (
  command: "event" | "config" | "js",
  target: string | Date,
  params?: Record<string, unknown>,
) => void;

interface PlausibleFn {
  (event: string, options?: { props?: Record<string, unknown> }): void;
  q?: unknown[];
}

interface ClarityFn {
  (command: "event" | "set" | "identify", ...args: unknown[]): void;
}

interface PostHogLike {
  capture: (event: string, properties?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
    plausible?: PlausibleFn;
    clarity?: ClarityFn;
    posthog?: PostHogLike;
  }
}

/* -------------------------------------------------------------------------- */
/*  Dispatch                                                                  */
/* -------------------------------------------------------------------------- */

/** Drops `undefined` values, which several providers serialise as the string "undefined". */
function clean(properties?: AnalyticsProperties): Record<string, string | number | boolean> {
  if (!properties) return {};

  return Object.fromEntries(
    Object.entries(properties).filter(
      (entry): entry is [string, string | number | boolean] => entry[1] !== undefined,
    ),
  );
}

/** Each provider is isolated: one failing must not stop the others. */
function safely(label: string, dispatch: () => void): void {
  try {
    dispatch();
  } catch (cause) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[analytics] ${label} dispatch failed`, cause);
    }
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  properties?: AnalyticsProperties,
): void {
  if (typeof window === "undefined") return;

  const payload = clean(properties);

  if (process.env.NODE_ENV !== "production") {
    // The whole point of a facade is being able to see what would have been sent.
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, payload);
    return;
  }

  if (analyticsConfig.isProviderEnabled("google")) {
    safely("google", () => window.gtag?.("event", name, payload));
  }

  if (analyticsConfig.isProviderEnabled("plausible")) {
    // Plausible takes custom properties under a `props` key rather than inline.
    safely("plausible", () => window.plausible?.(name, { props: payload }));
  }

  if (analyticsConfig.isProviderEnabled("clarity")) {
    // Clarity's custom events take a name only, so the properties become tags.
    safely("clarity", () => {
      window.clarity?.("event", name);
      for (const [key, value] of Object.entries(payload)) {
        window.clarity?.("set", key, String(value));
      }
    });
  }

  if (analyticsConfig.isProviderEnabled("posthog")) {
    safely("posthog", () => window.posthog?.capture(name, payload));
  }
}

/**
 * Fires an event, then performs a navigation.
 *
 * Beacons are fire-and-forget, and a synchronous `window.location` assignment can tear the
 * request down before it leaves. A single frame of delay is imperceptible and is enough for
 * the request to be queued.
 */
export function trackThenNavigate(
  name: AnalyticsEventName,
  properties: AnalyticsProperties | undefined,
  navigate: () => void,
): void {
  trackEvent(name, properties);
  requestAnimationFrame(navigate);
}

export const analytics = { trackEvent, trackThenNavigate } as const;
