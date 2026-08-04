/**
 * Namespaced `localStorage` / `sessionStorage` keys.
 *
 * Prefixed so the site never collides with anything else on the origin, and
 * versioned so a schema change can be rolled without reading stale shapes.
 */
const PREFIX = "portfolio";
const VERSION = "v1";

function key(name: string): string {
  return `${PREFIX}:${VERSION}:${name}`;
}

export const STORAGE_KEYS = {
  /** Consumed by next-themes. */
  theme: `${PREFIX}:theme`,
  /** Set once the preloader has played, so repeat visits skip it. */
  preloaderSeen: key("preloader-seen"),
  reducedMotionOverride: key("reduced-motion"),
  /**
   * Assistant transcript. Session-scoped on purpose — a conversation belongs to a
   * visit, and finding last week's chat waiting on return is unsettling rather than
   * helpful.
   */
  chatHistory: key("chat-history"),
  /** Recent command palette selections, for the default suggestions. */
  recentCommands: key("recent-commands"),
  /** Set once the newsletter form has been submitted successfully. */
  newsletterSubscribed: key("newsletter-subscribed"),
  /**
   * Set when the install prompt is declined. Long-lived on purpose — someone who said no
   * should not be asked again on their next visit.
   */
  installPromptDismissed: key("install-dismissed"),
  /** Last résumé variant viewed, so returning to the page keeps the reader's choice. */
  resumeVariant: key("resume-variant"),
} as const;
