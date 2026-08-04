import type { Talk, TalkKind } from "@/types/explore";

/**
 * Talks, workshops, podcasts and demos.
 *
 * Sprint 3 ships the architecture, not a speaking history — there is one internal
 * session and one prepared talk, and inventing a conference circuit would be the
 * single most checkable lie on the site.
 *
 * The section is built to look deliberate when nearly empty: it leads with what is
 * on offer and an invitation, and renders an honest empty state per category rather
 * than a grid of filler cards. Adding an entry here is the only change needed.
 */
export const talks: readonly Talk[] = [
  {
    id: "idempotent-payments",
    title: "Why your retried checkout charged twice",
    venue: "Southco engineering",
    date: "2025",
    kind: "talk",
    abstract:
      "A walk through the three places idempotency has to be enforced in a payment flow — request, order creation and settlement reconciliation — and what breaks when any one of them is skipped.",
  },
  {
    id: "rag-that-cites",
    title: "RAG that cites its sources",
    venue: "Available on request",
    date: "Upcoming",
    kind: "workshop",
    abstract:
      "Ninety minutes building a retrieval pipeline that refuses to answer without a citation: chunking to document structure, hybrid retrieval, reranking, and an evaluation set that gates prompt changes.",
    upcoming: true,
  },
];

export const TALK_KIND_META = {
  talk: { label: "Talks", description: "Conference and meetup sessions" },
  workshop: { label: "Workshops", description: "Hands-on, longer format" },
  podcast: { label: "Podcasts", description: "Conversations and interviews" },
  video: { label: "Videos", description: "Recorded walkthroughs" },
  demo: { label: "Demos", description: "Live builds and product demos" },
} as const satisfies Record<TalkKind, { label: string; description: string }>;

/** Topics on offer, which is the useful thing when the history is short. */
export const speakingTopics: readonly string[] = [
  "Idempotency in payment and order flows",
  "Search relevance tuning on OpenSearch",
  "Retrieval-augmented features that can be evaluated",
  "Spring Boot service design for small teams",
  "Reading a query plan before blaming the ORM",
];

export const talkKinds = (Object.keys(TALK_KIND_META) as TalkKind[]).filter((kind) =>
  talks.some((talk) => talk.kind === kind),
);
