import type { LucideIcon } from "lucide-react";

/**
 * Contact types.
 *
 * The form's field union and its option lists live in `services/contact.schema.ts`
 * alongside the Zod schema, so the validator and the types cannot disagree. What lives
 * here is everything the *presentation* needs.
 */

/** A way to reach out, rendered as a glass card. */
export interface ContactChannel {
  id: string;
  label: string;
  /** The line beneath the label — an address, a handle, a duration. */
  value: string;
  /** One sentence on when to use this channel rather than another. */
  hint: string;
  href?: string;
  icon: LucideIcon;
  /** Copy-to-clipboard affordance instead of, or alongside, a link. */
  copyable?: boolean;
  /** Renders the live pulse — availability and timezone use it. */
  live?: boolean;
  external?: boolean;
}

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "email"
  | "x"
  | "youtube"
  | "medium"
  | "devto"
  | "leetcode"
  | "hackerrank"
  | "codechef";

/** Delivery outcome, surfaced to the form. */
export type ContactSubmitState = "idle" | "submitting" | "success" | "error";

/** Which transport actually sent the message. Useful in the success copy. */
export type ContactTransportId = "api" | "emailjs" | "unconfigured";
