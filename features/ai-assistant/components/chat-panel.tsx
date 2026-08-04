"use client";

import { AnimatePresence } from "framer-motion";
import { Eraser, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  chatCopy,
  followUpIntentIds,
  suggestedIntentIds,
} from "@/data/ai";
import { ChatComposer } from "@/features/ai-assistant/components/chat-composer";
import { ChatMessage } from "@/features/ai-assistant/components/chat-message";
import { ChatSuggestions } from "@/features/ai-assistant/components/chat-suggestions";
import { ResponseBlocks } from "@/features/ai-assistant/components/message-blocks";
import { TypingIndicator } from "@/features/ai-assistant/components/typing-indicator";
import { useChat } from "@/hooks/use-chat";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface ChatPanelProps {
  /** Fills the parent instead of using its own height. Used inside the drawer. */
  fill?: boolean;
  /** Skips session persistence, so the drawer starts clean each time it is opened. */
  ephemeral?: boolean;
  autoFocus?: boolean;
  className?: string;
}

/**
 * The chat surface, used in two places: embedded in the home page and inside the floating
 * drawer. One component, so the two can never diverge.
 *
 * Three behaviours worth recording:
 *
 * **Auto-scroll respects intent.** It follows the stream only while the reader is already
 * near the bottom. Scrolling up to re-read an earlier answer must not be yanked back down
 * on the next token — that is the single most irritating bug in chat interfaces.
 *
 * **The transcript is one live region**, not one per message. `aria-live="polite"` on the
 * list announces additions once; putting it on each message would announce every token
 * flush.
 *
 * **`data-lenis-prevent`** on the scroll container, so a wheel gesture inside the
 * transcript scrolls the transcript rather than being intercepted by Lenis and scrolling
 * the page behind it.
 */
export function ChatPanel({
  fill = false,
  ephemeral = false,
  autoFocus = false,
  className,
}: ChatPanelProps) {
  const {
    messages,
    intro,
    input,
    setInput,
    isStreaming,
    error,
    send,
    stop,
    clear,
    hasConversation,
  } = useChat({ ephemeral });

  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pinnedToBottom, setPinnedToBottom] = useState(true);

  const onScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const distance =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    setPinnedToBottom(distance < 96);
  }, []);

  useEffect(() => {
    if (!pinnedToBottom) return;
    const element = scrollRef.current;
    if (!element) return;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, pinnedToBottom, reduceMotion]);

  const lastMessage = messages.at(-1);
  const showTyping =
    isStreaming &&
    lastMessage?.role === "assistant" &&
    lastMessage.text.length === 0 &&
    (lastMessage.blocks?.length ?? 0) === 0;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-border",
        "bg-card/70 backdrop-blur-xl surface-sheen",
        fill ? "h-full" : "h-[min(38rem,80dvh)]",
        className,
      )}
    >
      {/* ------------------------------------------------------------ header -- */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-lg",
              "border border-primary/30 bg-primary/12 text-primary",
            )}
          >
            <Sparkles className="size-4" />
          </span>

          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-semibold tracking-tight text-foreground">
              {chatCopy.title}
            </p>
            <p className="truncate text-2xs text-subtle">{chatCopy.subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge tone="default" size="sm" dot pulse={isStreaming}>
            {isStreaming ? "Thinking" : "Ready"}
          </Badge>

          {hasConversation ? (
            <Button variant="ghost" size="sm" onClick={clear}>
              <Eraser aria-hidden="true" className="size-3.5" />
              <span className="sr-only sm:not-sr-only">{chatCopy.clear}</span>
            </Button>
          ) : null}
        </div>
      </header>

      {/* -------------------------------------------------------- transcript -- */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        data-lenis-prevent
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-5"
      >
        <ul
          aria-live="polite"
          aria-relevant="additions"
          aria-label={chatCopy.transcriptLabel}
          className="flex flex-col gap-6"
        >
          {/* The greeting is a real assistant turn, so the panel is never empty. */}
          <li className="flex gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg",
                "border border-primary/30 bg-primary/12 text-primary",
              )}
            >
              <Sparkles className="size-3.5" />
            </span>
            <ResponseBlocks blocks={intro} className="flex-1" />
          </li>

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {showTyping ? <TypingIndicator /> : null}
        </ul>
      </div>

      {/* ------------------------------------------------------------ footer -- */}
      <div className="flex flex-col gap-4 border-t border-border px-4 py-4">
        <ChatSuggestions
          intentIds={hasConversation ? followUpIntentIds : suggestedIntentIds}
          label={hasConversation ? chatCopy.followUpLabel : chatCopy.suggestionsLabel}
          onSelect={(prompt) => send(prompt)}
          disabled={isStreaming}
        />

        <ChatComposer
          value={input}
          onChange={setInput}
          onSubmit={() => send()}
          onStop={stop}
          isStreaming={isStreaming}
          error={error}
          autoFocus={autoFocus}
        />
      </div>
    </div>
  );
}
