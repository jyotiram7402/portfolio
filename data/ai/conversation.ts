import { identity, knowledge } from "@/data/ai/knowledge";
import type { ResponseBlock } from "@/types/ai";

/**
 * Conversation shell: greeting, suggestions, fallbacks, and the copy for every state
 * the chat can be in.
 *
 * Kept out of the components so the assistant's voice is editable without touching
 * JSX, and so the same strings serve the embedded panel and the floating drawer.
 */

export const CHAT_LIMITS = {
  /** Characters. Long enough for a real question, short enough to stay a question. */
  maxInput: 280,
  /** Messages kept in session storage. Older ones are dropped, oldest first. */
  maxHistory: 40,
} as const;

/** Streaming feel. Tuned by eye: fast enough not to test patience, slow enough to read. */
export const STREAM = {
  /** Characters emitted per tick. */
  chunkSize: 3,
  /** Milliseconds between ticks. */
  tickMs: 16,
  /** Pause before the first token, so the typing indicator is visible. */
  thinkingMs: 420,
  /** Extra pause after a sentence ends, which is what makes it read as typing. */
  sentencePauseMs: 90,
} as const;

export const greeting: readonly ResponseBlock[] = [
  {
    type: "text",
    value: `I answer questions about ${identity.firstName}'s work — experience, projects, the stack, what he is learning next.`,
  },
  {
    type: "text",
    value: `Everything I say comes from this page, and I will tell you when something is not published rather than guess. Ask me anything below, or type your own.`,
  },
];

/**
 * Suggestion chips, in display order.
 *
 * A curated subset of the intent list rather than all of it — twenty chips is a menu,
 * six is an invitation. Chosen to demonstrate the range: identity, projects, skills,
 * and a link action.
 */
export const suggestedIntentIds: readonly string[] = [
  "about.who",
  "projects.java",
  "skills.backend",
  "about.ai-leadership",
  "about.experience",
  "contact.how",
];

/** Shown once the visitor has sent something, to keep exploration going. */
export const followUpIntentIds: readonly string[] = [
  "projects.all",
  "projects.microservices",
  "about.roadmap",
  "credentials.achievements",
  "skills.all",
  "links.github",
];

/**
 * Nothing matched.
 *
 * Deliberately not apologetic and never speculative — it says what it does know and
 * offers the route that actually helps. An assistant that says "I'm not sure, but
 * perhaps…" is the failure this whole design is built to avoid.
 */
export function fallbackResponse(query: string): readonly ResponseBlock[] {
  const trimmed = query.trim().slice(0, 60);

  return [
    {
      type: "text",
      value: `I do not have anything on that${trimmed.length > 0 ? ` — "${trimmed}"` : ""}.`,
    },
    { type: "text", value: knowledge.narrative.scope },
    {
      type: "actions",
      actions: [
        { label: "Email him instead", href: knowledge.links.email, kind: "mail" },
      ],
    },
  ];
}

export const chatCopy = {
  title: `Ask about ${identity.firstName}`,
  subtitle: "Grounded in this page. No invented answers.",
  placeholder: "Ask about his experience, projects or stack…",
  send: "Send",
  stop: "Stop",
  clear: "Clear chat",
  cleared: "Chat cleared.",
  thinking: "Looking through the site",
  suggestionsLabel: "Try one of these",
  followUpLabel: "Keep exploring",
  transcriptLabel: "Conversation with the assistant",
  /** Sits under the composer. Honest about what this is. */
  disclosure:
    "Local knowledge base, not a language model — answers come from structured data on this site.",
  inputTooLong: `Keep it under ${CHAT_LIMITS.maxInput} characters.`,
  emptyInput: "Type a question first.",
} as const;
