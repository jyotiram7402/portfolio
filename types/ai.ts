import type { LucideIcon } from "lucide-react";

/**
 * The assistant's data model.
 *
 * The shape here is chosen so that swapping the local knowledge engine for a real
 * LLM changes one file and nothing else: responses are already a list of typed
 * blocks (what a model would emit as text plus tool calls), and delivery is
 * already an async stream (what an SSE endpoint yields).
 */

export type MessageRole = "assistant" | "user";

/* -------------------------------------------------------------------------- */
/*  Response blocks                                                           */
/* -------------------------------------------------------------------------- */

/** Prose. Supports a small inline markdown subset — bold, code, links. */
export interface TextBlock {
  type: "text";
  value: string;
}

export interface ListBlock {
  type: "list";
  items: readonly string[];
  ordered?: boolean;
}

export interface CodeBlock {
  type: "code";
  language: string;
  code: string;
  caption?: string;
}

/** Technology pills, e.g. in answer to "what does he know?". */
export interface BadgeBlock {
  type: "badges";
  label?: string;
  items: readonly string[];
}

/** Rich project results rendered as cards inside the transcript. */
export interface ProjectsBlock {
  type: "projects";
  /** Project ids, resolved against `data/projects.ts` at render time. */
  ids: readonly string[];
  emptyMessage?: string;
}

/** Call-to-action row: résumé, GitHub, LinkedIn, email. */
export interface ActionsBlock {
  type: "actions";
  actions: readonly ChatAction[];
}

export interface ChatAction {
  label: string;
  href: string;
  /** `external` opens a new tab; `download` sets the download attribute. */
  kind: "internal" | "external" | "download" | "mail";
}

/** Compact key/value facts, e.g. current role and location. */
export interface FactsBlock {
  type: "facts";
  facts: readonly { label: string; value: string }[];
}

export type ResponseBlock =
  | TextBlock
  | ListBlock
  | CodeBlock
  | BadgeBlock
  | ProjectsBlock
  | ActionsBlock
  | FactsBlock;

/* -------------------------------------------------------------------------- */
/*  Messages                                                                  */
/* -------------------------------------------------------------------------- */

export interface ChatMessage {
  id: string;
  role: MessageRole;
  /** Plain text. For user messages this is the whole payload. */
  text: string;
  /** Assistant only. Rich blocks appended after the streamed prose. */
  blocks?: readonly ResponseBlock[];
  /** Which intent produced this answer. Useful for analytics and debugging. */
  intentId?: string;
  /** True while tokens are still arriving. */
  streaming?: boolean;
  createdAt: number;
}

/* -------------------------------------------------------------------------- */
/*  Intents & knowledge                                                       */
/* -------------------------------------------------------------------------- */

/**
 * An intent is a question the assistant can answer.
 *
 * `patterns` are matched with the shared fuzzy scorer, not with a regex soup, so
 * near-misses ("show me the java stuff") still resolve. Keeping them as data means
 * adding a question is a data edit, never a code edit.
 */
export interface Intent {
  id: string;
  /** Canonical phrasing, shown in suggestion chips. */
  label: string;
  /** Alternative phrasings and keywords to match against. */
  patterns: readonly string[];
  /** Higher wins when two intents score equally. */
  weight?: number;
  /** Groups suggestions in the UI. */
  group: IntentGroup;
  icon?: LucideIcon;
}

export type IntentGroup =
  | "about"
  | "projects"
  | "skills"
  | "links"
  | "credentials"
  | "contact";

/** One entry in the FAQ, which doubles as `FAQPage` structured data. */
export interface FaqEntry {
  intentId: string;
  question: string;
  /** Plain-text answer for the schema. The rich version lives in `responses.ts`. */
  answer: string;
}

/* -------------------------------------------------------------------------- */
/*  Engine contract                                                           */
/* -------------------------------------------------------------------------- */

export type ChatChunk =
  | { type: "text"; value: string }
  | { type: "block"; block: ResponseBlock }
  | { type: "meta"; intentId: string };

/**
 * What the UI depends on. Implemented locally today by `LocalKnowledgeEngine`,
 * and by an SSE-backed engine later, with no change above this line.
 */
export interface ChatEngine {
  readonly id: string;
  stream(
    query: string,
    history: readonly ChatMessage[],
    signal?: AbortSignal,
  ): AsyncIterable<ChatChunk>;
}
