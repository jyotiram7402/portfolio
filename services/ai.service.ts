import {
  CHAT_LIMITS,
  STREAM,
  buildResponse,
  fallbackResponse,
  intents,
} from "@/data/ai";
import type {
  ChatChunk,
  ChatEngine,
  ChatMessage,
  Intent,
  ResponseBlock,
} from "@/types/ai";
import { fuzzyMatchFields } from "@/utils/fuzzy";

/**
 * The chat engine.
 *
 * Two implementations behind one interface, and the interface is the point:
 * `stream()` returns an `AsyncIterable<ChatChunk>`, which is what a local generator
 * and an SSE endpoint both are. Nothing above this line — not `useChat`, not a single
 * component — knows which one it is talking to.
 *
 * `LocalKnowledgeEngine` ships today. `RemoteChatEngine` is wired and unused, and is
 * selected by `createChatEngine()` the moment the endpoint exists.
 */

/* -------------------------------------------------------------------------- */
/*  Intent resolution                                                        */
/* -------------------------------------------------------------------------- */

/** Below this, a match is a coincidence rather than an answer. */
const MATCH_THRESHOLD = 0.32;

export interface IntentMatch {
  intent: Intent;
  score: number;
}

/**
 * Scores a query against every intent's patterns.
 *
 * Uses the same fuzzy scorer as the command palette, so "spring boot" finds the same
 * thing in both places. Weights let a specific intent beat a general one:
 * "backend skills" resolves to `skills.backend`, not to `skills.all`, even though
 * both match the word "skills".
 */
export function resolveIntent(query: string): IntentMatch | null {
  const normalised = query.trim().toLowerCase();
  if (normalised.length === 0) return null;

  let best: IntentMatch | null = null;

  for (const intent of intents) {
    const fields = [
      { value: intent.label.toLowerCase(), weight: 1 },
      ...intent.patterns.map((pattern) => ({ value: pattern, weight: 0.98 })),
    ];

    const match = fuzzyMatchFields(normalised, fields);
    if (match.score === 0) continue;

    const score = match.score * (intent.weight ?? 1);
    if (!best || score > best.score) best = { intent, score };
  }

  if (!best || best.score < MATCH_THRESHOLD) return null;
  return best;
}

/* -------------------------------------------------------------------------- */
/*  Streaming helpers                                                        */
/* -------------------------------------------------------------------------- */

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Emits a string as chunks, pausing slightly longer at sentence ends.
 *
 * The uneven rhythm is what makes it read as typing rather than as a progress bar.
 * A constant rate is immediately recognisable as a fake.
 */
async function* streamText(
  value: string,
  signal?: AbortSignal,
): AsyncGenerator<ChatChunk> {
  for (let index = 0; index < value.length; index += STREAM.chunkSize) {
    const slice = value.slice(index, index + STREAM.chunkSize);
    yield { type: "text", value: slice };

    const endsSentence = /[.!?](\s|$)/.test(slice);
    await sleep(STREAM.tickMs + (endsSentence ? STREAM.sentencePauseMs : 0), signal);
  }
}

/* -------------------------------------------------------------------------- */
/*  Local engine                                                             */
/* -------------------------------------------------------------------------- */

export class LocalKnowledgeEngine implements ChatEngine {
  readonly id = "local-knowledge";

  async *stream(
    query: string,
    _history: readonly ChatMessage[],
    signal?: AbortSignal,
  ): AsyncGenerator<ChatChunk> {
    const trimmed = query.trim().slice(0, CHAT_LIMITS.maxInput);
    const match = resolveIntent(trimmed);

    const blocks: readonly ResponseBlock[] = match
      ? buildResponse(match.intent.id)
      : fallbackResponse(trimmed);

    yield { type: "meta", intentId: match?.intent.id ?? "fallback" };

    // The indicator has to be visible for long enough to register, or the answer
    // appears to have been sitting there all along.
    await sleep(STREAM.thinkingMs, signal);

    // Leading prose is streamed; everything structured is attached once the prose has
    // landed. A model with tool calls produces exactly this ordering.
    let streamedPrefix = true;

    for (const block of blocks) {
      if (streamedPrefix && block.type === "text") {
        yield* streamText(block.value, signal);
        yield { type: "text", value: "\n\n" };
        continue;
      }

      streamedPrefix = false;
      yield { type: "block", block };
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Remote engine                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Reads newline-delimited JSON chunks from `/api/chat`.
 *
 * Unused in the shipping path. It exists so the LLM migration is a one-line change in
 * `createChatEngine()` rather than a rewrite: the route already speaks this format,
 * and NDJSON is chosen over raw SSE because the chunk union is already JSON.
 */
export class RemoteChatEngine implements ChatEngine {
  readonly id = "remote";

  constructor(private readonly endpoint = "/api/chat") {}

  async *stream(
    query: string,
    history: readonly ChatMessage[],
    signal?: AbortSignal,
  ): AsyncGenerator<ChatChunk> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        history: history.slice(-8).map(({ role, text }) => ({ role, text })),
      }),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Chat request failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // A chunk boundary is not a line boundary, so the tail is kept for next time.
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.trim().length === 0) continue;
        try {
          yield JSON.parse(line) as ChatChunk;
        } catch {
          // A malformed line is dropped rather than killing the stream.
        }
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Factory                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Selects the engine.
 *
 * The single switch point for the LLM migration: give it a truthy `remote` and every
 * consumer changes behaviour with no other edit.
 */
export function createChatEngine(options: { remote?: boolean } = {}): ChatEngine {
  return options.remote ? new RemoteChatEngine() : new LocalKnowledgeEngine();
}

export const aiService = {
  createChatEngine,
  resolveIntent,
  matchThreshold: MATCH_THRESHOLD,
} as const;
