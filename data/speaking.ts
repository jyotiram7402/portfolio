import type { Talk, TalkKind } from "@/types/explore";

/**
 * Talks, workshops and internal sessions.
 *
 * Short and honest. The CTO presentation is real and is the strongest entry here — it is the moment
 * an R&D spike became an organisation-wide standard. Inventing a conference circuit on top of it
 * would be the single most checkable lie on the site.
 *
 * The section is built to look deliberate while thin: it leads with the topics on offer and renders
 * an honest empty state per category rather than a grid of filler. Adding an entry here is the only
 * change needed.
 */
export const talks: readonly Talk[] = [
  {
    id: "agentic-ai-cto",
    title: "Agentic AI in a legacy codebase: the risk nobody asked about",
    venue: "Southco — presented to the CTO and engineering leadership",
    date: "2025",
    kind: "talk",
    abstract:
      "The R&D findings on Claude Code adoption, and the security question that came out of it: these tools read whatever the developer's machine can read, including legacy customer data. Covers the isolation strategy — a Docker DevContainer — and why answering that question first is what made org-wide adoption possible at all.",
  },
  {
    id: "ai-first-development",
    title: "Making AI-first development a team capability, not a mandate",
    venue: "Southco engineering",
    date: "2025",
    kind: "talk",
    abstract:
      "How twenty developers actually moved onto an agentic workflow: what to standardise, what to leave to preference, and why adoption follows a solved security problem rather than an enthusiastic memo.",
  },
  {
    id: "idempotent-payments",
    title: "Why your retried checkout charged twice",
    venue: "Available on request",
    date: "Upcoming",
    kind: "workshop",
    abstract:
      "The three places idempotency has to be enforced in a payment flow — request, order creation and settlement reconciliation — and what breaks when any one of them is skipped. Drawn from owning three gateways in production.",
    upcoming: true,
  },
];

export const TALK_KIND_META = {
  talk: { label: "Talks", description: "Conference, meetup and internal sessions" },
  workshop: { label: "Workshops", description: "Hands-on, longer format" },
  podcast: { label: "Podcasts", description: "Conversations and interviews" },
  video: { label: "Videos", description: "Recorded walkthroughs" },
  demo: { label: "Demos", description: "Live builds and product demos" },
} as const satisfies Record<TalkKind, { label: string; description: string }>;

/** Topics on offer, which is the useful thing when the history is short. */
export const speakingTopics: readonly string[] = [
  "Secure agentic AI adoption in an enterprise codebase",
  "Idempotency in payment and order flows",
  "Spring Boot service design for small teams",
  "Event-driven architecture with Apache Kafka",
  "Reading a query plan before blaming the ORM",
  "Retrieval-augmented features that can be evaluated",
];

export const talkKinds = (Object.keys(TALK_KIND_META) as TalkKind[]).filter((kind) =>
  talks.some((talk) => talk.kind === kind),
);
