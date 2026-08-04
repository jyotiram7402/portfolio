"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CHAT_LIMITS, chatCopy, greeting } from "@/data/ai";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { createChatEngine } from "@/services/ai.service";
import type { ChatMessage, ResponseBlock } from "@/types/ai";

/**
 * The chat state machine.
 *
 * All of the assistant's behaviour lives here so the components are pure rendering.
 * Four things are worth calling out:
 *
 * **Streaming without a render per token.** Tokens arrive every ~16ms. Committing each
 * one to state would be sixty renders a second of the whole transcript. Instead the
 * text accumulates in a ref and is flushed to state on an animation frame, so React
 * renders at most once per painted frame — and only the streaming message changes.
 *
 * **Cancellation is real.** The engine takes an `AbortSignal`, so Stop actually stops
 * the generator rather than hiding output that keeps being produced.
 *
 * **History survives a reload** in `sessionStorage`, not `localStorage`: a conversation
 * is a session-scoped thing, and finding last week's chat on return is unsettling
 * rather than helpful.
 *
 * **The engine is injected.** Swapping `LocalKnowledgeEngine` for the remote one is a
 * prop, and nothing in this hook knows the difference.
 */

export interface UseChatOptions {
  /** Set true once `/api/chat` is live. */
  remote?: boolean;
  /** Disables session persistence, for the transient drawer instance. */
  ephemeral?: boolean;
}

export interface ChatState {
  messages: readonly ChatMessage[];
  /** Greeting blocks, rendered as the assistant's opening turn. */
  intro: readonly ResponseBlock[];
  input: string;
  setInput: (value: string) => void;
  /** True from send until the stream completes or is aborted. */
  isStreaming: boolean;
  error: string | null;
  send: (value?: string) => void;
  stop: () => void;
  clear: () => void;
  /** True once the visitor has sent at least one message. */
  hasConversation: boolean;
}

let messageCounter = 0;
function nextId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${messageCounter}`;
}

function readStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.chatHistory);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Never restore a message mid-stream: it would render with a cursor that
    // never resolves.
    return (parsed as ChatMessage[])
      .filter((message) => message.streaming !== true)
      .slice(-CHAT_LIMITS.maxHistory);
  } catch {
    return [];
  }
}

export function useChat(options: UseChatOptions = {}): ChatState {
  const { remote = false, ephemeral = false } = options;

  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const engine = useMemo(() => createChatEngine({ remote }), [remote]);
  const abortRef = useRef<AbortController | null>(null);

  // Streaming buffer. Text lands here every tick; state is updated on a frame.
  const bufferRef = useRef("");
  const frameRef = useRef(0);

  /* --------------------------------------------------------------- restore -- */
  useEffect(() => {
    if (ephemeral) return;
    const stored = readStoredMessages();
    if (stored.length > 0) setMessages(stored);
  }, [ephemeral]);

  useEffect(() => {
    if (ephemeral || typeof window === "undefined") return;
    // Persisting mid-stream would write a partial answer on every frame.
    if (isStreaming) return;

    try {
      sessionStorage.setItem(
        STORAGE_KEYS.chatHistory,
        JSON.stringify(messages.slice(-CHAT_LIMITS.maxHistory)),
      );
    } catch {
      // Storage full or blocked. The conversation still works in memory.
    }
  }, [ephemeral, isStreaming, messages]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (frameRef.current !== 0) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  /* ------------------------------------------------------------------ send -- */
  const send = useCallback(
    (raw?: string) => {
      const value = (raw ?? input).trim();

      if (value.length === 0) {
        setError(chatCopy.emptyInput);
        return;
      }
      if (value.length > CHAT_LIMITS.maxInput) {
        setError(chatCopy.inputTooLong);
        return;
      }
      if (isStreaming) return;

      setError(null);
      setInput("");

      const userMessage: ChatMessage = {
        id: nextId("user"),
        role: "user",
        text: value,
        createdAt: Date.now(),
      };

      const assistantId = nextId("assistant");
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        text: "",
        blocks: [],
        streaming: true,
        createdAt: Date.now(),
      };

      setMessages((previous) =>
        [...previous, userMessage, assistantMessage].slice(-CHAT_LIMITS.maxHistory),
      );
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      bufferRef.current = "";

      /** Coalesces buffered tokens into one state update per painted frame. */
      const scheduleFlush = () => {
        if (frameRef.current !== 0) return;
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = 0;
          const text = bufferRef.current;
          setMessages((previous) =>
            previous.map((message) =>
              message.id === assistantId ? { ...message, text } : message,
            ),
          );
        });
      };

      void (async () => {
        try {
          for await (const chunk of engine.stream(value, messages, controller.signal)) {
            if (controller.signal.aborted) break;

            if (chunk.type === "text") {
              bufferRef.current += chunk.value;
              scheduleFlush();
              continue;
            }

            if (chunk.type === "meta") {
              setMessages((previous) =>
                previous.map((message) =>
                  message.id === assistantId
                    ? { ...message, intentId: chunk.intentId }
                    : message,
                ),
              );
              continue;
            }

            // A structured block arrived. Flush any pending text with it so the
            // prose and the attachment commit in the same render.
            setMessages((previous) =>
              previous.map((message) =>
                message.id === assistantId
                  ? {
                      ...message,
                      text: bufferRef.current,
                      blocks: [...(message.blocks ?? []), chunk.block],
                    }
                  : message,
              ),
            );
          }
        } catch (cause) {
          if (!(cause instanceof DOMException && cause.name === "AbortError")) {
            setError("Something went wrong reading the knowledge base.");
          }
        } finally {
          if (frameRef.current !== 0) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
          }

          const finalText = bufferRef.current;
          setMessages((previous) =>
            previous.map((message) =>
              message.id === assistantId
                ? { ...message, text: finalText.trimEnd(), streaming: false }
                : message,
            ),
          );
          setIsStreaming(false);
          abortRef.current = null;
        }
      })();
    },
    [engine, input, isStreaming, messages],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setError(null);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEYS.chatHistory);
      } catch {
        // Nothing to recover from — the in-memory transcript is already cleared.
      }
    }
  }, []);

  return {
    messages,
    intro: greeting,
    input,
    setInput,
    isStreaming,
    error,
    send,
    stop,
    clear,
    hasConversation: messages.length > 0,
  };
}
