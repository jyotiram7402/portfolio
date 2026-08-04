"use client";

import { motion } from "framer-motion";

import { ease } from "@/animations/easings";
import { DURATION, STAGGER } from "@/config/animations";
import { getIntent } from "@/data/ai";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Intent } from "@/types/ai";

export interface ChatSuggestionsProps {
  /** Intent ids to offer. Resolved to labels and icons here. */
  intentIds: readonly string[];
  label: string;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Suggested prompts.
 *
 * These carry more weight than they look: an empty chat with a text field is a blank
 * page, and most visitors will not invent a question. The chips are the difference
 * between a feature people try and a feature people scroll past.
 *
 * Each chip sends the intent's canonical phrasing rather than an id, so the transcript
 * reads as a real conversation and the same query typed by hand produces the same answer.
 *
 * `disabled` during streaming: two overlapping answers in one transcript is confusing,
 * and the composer already enforces the same rule.
 */
export function ChatSuggestions({
  intentIds,
  label,
  onSelect,
  disabled = false,
  className,
}: ChatSuggestionsProps) {
  const reduceMotion = useReducedMotion();

  const intents = intentIds
    .map((id) => getIntent(id))
    .filter((intent): intent is Intent => intent !== undefined);

  if (intents.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <p className="font-mono text-2xs tracking-widest text-subtle uppercase">{label}</p>

      <ul className="flex flex-wrap gap-2">
        {intents.map((intent, index) => {
          const Icon = intent.icon;

          return (
            <motion.li
              key={intent.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0.01 : DURATION.slow,
                ease: ease.outExpo,
                delay: reduceMotion ? 0 : index * STAGGER.tight,
              }}
            >
              <button
                type="button"
                onClick={() => onSelect(intent.label)}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-border",
                  "bg-input px-3 py-1.5 text-xs text-muted",
                  "transition-colors duration-[var(--duration-fast)]",
                  "hover:border-primary/40 hover:bg-elevated hover:text-foreground",
                  "focus-ring disabled:pointer-events-none disabled:opacity-45",
                )}
              >
                {Icon ? (
                  <Icon aria-hidden="true" className="size-3.5 shrink-0 text-subtle" />
                ) : null}
                {intent.label}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
