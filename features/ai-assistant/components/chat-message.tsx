"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

import { ease } from "@/animations/easings";
import { LogoMark } from "@/components/icons/logo-mark";
import { InlineMarkdown } from "@/components/markdown/inline-markdown";
import { DURATION } from "@/config/animations";
import { ResponseBlocks } from "@/features/ai-assistant/components/message-blocks";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { ChatMessage as Message } from "@/types/ai";

export interface ChatMessageProps {
  message: Message;
}

/**
 * One turn in the transcript.
 *
 * The two roles are shaped differently on purpose. A user message is a compact bubble
 * aligned right; an assistant message is full width with an avatar, because it carries
 * prose, lists and cards that a bubble would squeeze.
 *
 * Streaming prose is split on blank lines into paragraphs as it arrives, so a long answer
 * does not become one wall of text mid-stream. The caret is a CSS animation on a
 * pseudo-element rather than a rendered character — a text node that appears and
 * disappears would be picked up by the accessibility tree and read aloud.
 *
 * The whole transcript is a live region (see `ChatPanel`), so nothing is announced here
 * per message; that would produce two announcements for every answer.
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const reduceMotion = useReducedMotion();
  const isUser = message.role === "user";

  const paragraphs = message.text.split(/\n{2,}/).filter((part) => part.trim().length > 0);

  return (
    <motion.li
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0.01 : DURATION.normal,
        ease: ease.outQuint,
      }}
      className={cn("flex gap-3", isUser && "justify-end")}
    >
      {isUser ? null : (
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg",
            "border border-border bg-elevated",
          )}
        >
          <LogoMark className="size-4" />
        </span>
      )}

      <div
        className={cn(
          "flex min-w-0 flex-col gap-3",
          isUser ? "max-w-[85%] items-end" : "flex-1",
        )}
      >
        <span className="sr-only">{isUser ? "You said" : "Assistant replied"}:</span>

        {isUser ? (
          <p
            className={cn(
              "rounded-2xl rounded-br-md border border-border-strong",
              "bg-elevated px-3.5 py-2.5 text-sm leading-relaxed text-foreground",
            )}
          >
            {message.text}
          </p>
        ) : (
          <>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={cn(
                  "text-sm leading-relaxed text-muted",
                  // The caret only ever trails the final paragraph.
                  message.streaming &&
                    index === paragraphs.length - 1 &&
                    "after:ml-0.5 after:inline-block after:h-4 after:w-1.5 after:translate-y-0.5 after:animate-[caret_1.1s_steps(1)_infinite] after:bg-primary after:content-['']",
                )}
              >
                <InlineMarkdown>{paragraph}</InlineMarkdown>
              </p>
            ))}

            {message.blocks && message.blocks.length > 0 ? (
              <ResponseBlocks blocks={message.blocks} />
            ) : null}
          </>
        )}
      </div>

      {isUser ? (
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg",
            "border border-border bg-input text-subtle",
          )}
        >
          <User className="size-3.5" />
        </span>
      ) : null}
    </motion.li>
  );
}
