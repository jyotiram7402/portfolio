/**
 * Analytics types.
 *
 * The provider set is open by design: the facade in `lib/analytics.ts` fans one call out to
 * whichever providers are enabled, so adding a fifth is a config entry and a script
 * component — never a change at a call site.
 */

export type AnalyticsProviderId =
  | "vercel"
  | "google"
  | "plausible"
  | "clarity"
  | "posthog";

/**
 * A tracked event.
 *
 * Names are a closed union rather than free strings. An analytics dashboard fills up with
 * `resume_download`, `resumeDownload` and `download-resume` within a month otherwise, and
 * none of them can be compared.
 */
export type AnalyticsEventName =
  | "resume_download"
  | "resume_variant_change"
  | "contact_submit"
  | "contact_submit_error"
  | "meeting_intent"
  | "assistant_query"
  | "command_palette_open"
  | "newsletter_subscribe"
  | "social_click"
  | "install_prompt_accepted";

/**
 * Event payload.
 *
 * Scalars only. Nested objects are flattened differently by every provider, and nothing here
 * should ever carry a message body, an email address or anything else a visitor typed.
 */
export type AnalyticsProperties = Readonly<
  Record<string, string | number | boolean | undefined>
>;

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties?: AnalyticsProperties;
}

export interface AnalyticsProviderConfig {
  id: AnalyticsProviderId;
  label: string;
  enabled: boolean;
  /** Site id, measurement id or token, depending on the provider. */
  token?: string;
  /** Optional self-hosted or proxied origin. */
  host?: string;
}
