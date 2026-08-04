export {
  CHAT_LIMITS,
  STREAM,
  chatCopy,
  fallbackResponse,
  followUpIntentIds,
  greeting,
  suggestedIntentIds,
} from "./conversation";
export { faqEntries, getIntent, intents } from "./faq";
export { identity, knowledge, narrative, serialiseKnowledge } from "./knowledge";
export type { Knowledge } from "./knowledge";
export { PROMPT_VERSION, buildPromptPayload, guardrails, systemPrompt } from "./prompt";
export { buildResponse, hasResponse, responseBuilders } from "./responses";

/**
 * The assistant's knowledge layer.
 *
 *   knowledge.ts    — facts, composed from the same data the page renders
 *   faq.ts          — intents (the questions) and their plain-text FAQ answers
 *   responses.ts    — intent → typed response blocks
 *   prompt.ts       — system prompt and context serialisation, for a future LLM
 *   conversation.ts — greeting, suggestions, fallbacks, timing and copy
 *
 * No component contains chat logic. `services/ai.service.ts` is the only consumer
 * that resolves an intent, and it does so through the shared fuzzy matcher.
 */
