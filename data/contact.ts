import {
  CalendarClock,
  Clock,
  Github,
  Globe2,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import type { ContactChannel } from "@/types/contact";
import type { BudgetRange, ProjectType } from "@/services/contact.schema";

/**
 * Contact content.
 *
 * The channel cards, the form's option labels and the response-time claim. Every figure here is
 * one that can be kept — "within two working days" is a commitment, "within an hour" is a
 * commitment that gets broken on the first busy week.
 */

const github = socialConfig.links.find((link) => link.id === "github");
const linkedin = socialConfig.links.find((link) => link.id === "linkedin");

export const RESPONSE_TIME = "Within 2 working days";

export const contactChannels: readonly ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    value: siteConfig.email,
    hint: "The fastest route, and the one I read properly rather than skim.",
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
    copyable: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: linkedin?.handle ?? "",
    hint: "For the formal version of the same history, and for introductions.",
    href: linkedin?.href,
    icon: Linkedin,
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: github?.handle ?? "",
    hint: "Code, commits and the occasional pull request to something I use daily.",
    href: github?.href,
    icon: Github,
    external: true,
  },
  {
    id: "location",
    label: "Location",
    value: siteConfig.location,
    hint: "On-site or hybrid locally; remote across time zones with real overlap.",
    icon: MapPin,
  },
  {
    id: "availability",
    label: "Availability",
    value: siteConfig.availability.open
      ? siteConfig.availability.label
      : "Not currently looking",
    hint: siteConfig.availability.open
      ? "A concrete opening is worth sending. Speculative ones are fine too."
      : "Interesting problems are still worth a message.",
    icon: CalendarClock,
    live: true,
  },
  {
    id: "timezone",
    label: "Time zone",
    value: siteConfig.timezone.replace("_", " "),
    hint: "Comfortable overlapping into European mornings and US mornings.",
    icon: Globe2,
    live: true,
  },
  {
    id: "response",
    label: "Response time",
    value: RESPONSE_TIME,
    hint: "If it has been longer than that, the message went astray — send it again.",
    icon: Clock,
  },
];

/* -------------------------------------------------------------------------- */
/*  Form option labels                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Labels for the schema's id unions.
 *
 * Split from the schema deliberately: an id is part of the stored contract and must not change,
 * while a label is copy and should be free to.
 */
export const projectTypeLabels: Readonly<Record<ProjectType, string>> = {
  "backend-service": "Backend service or API",
  "ai-feature": "AI feature or retrieval pipeline",
  "full-stack-app": "Full-stack application",
  integration: "Integration or migration",
  consulting: "Review, audit or consulting",
  role: "A role on your team",
  other: "Something else",
};

export const budgetLabels: Readonly<Record<BudgetRange, string>> = {
  "not-applicable": "Not applicable — this is about a role",
  "under-5k": "Under $5k",
  "5k-15k": "$5k – $15k",
  "15k-40k": "$15k – $40k",
  "40k-plus": "$40k+",
  undecided: "Not decided yet",
};

/* -------------------------------------------------------------------------- */
/*  Copy                                                                      */
/* -------------------------------------------------------------------------- */

export const contactCopy = {
  formTitle: "Send a message",
  formSubtitle:
    "Everything except company, role and budget is required. The more specific the message, the more useful the reply.",
  submit: "Send message",
  submitting: "Sending",
  successTitle: "Message sent",
  successBody: `Thanks — that arrived. Expect a reply ${RESPONSE_TIME.toLowerCase()}.`,
  successAgain: "Send another",
  /** Shown when neither transport is configured, so nothing is silently dropped. */
  fallbackTitle: "Delivery is not wired up yet",
  fallbackBody:
    "Rather than pretend this went somewhere, here is the direct route — the message below is ready to copy.",
  consentNote:
    "Your details are used to reply to this message and nothing else. No list, no tracking.",
} as const;
