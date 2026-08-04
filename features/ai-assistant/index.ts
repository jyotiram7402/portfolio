export { AssistantSection } from "./components/assistant-section";
export { ChatPanel } from "./components/chat-panel";
export type { ChatPanelProps } from "./components/chat-panel";

/**
 * `ChatPanel` is exported alongside the section because it has two callers: the embedded
 * section and the floating action button's drawer. Everything else — the composer, the
 * message renderer, the block views — is internal to the slice.
 */
