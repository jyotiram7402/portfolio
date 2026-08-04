"use client";

import { LogoMark } from "@/components/icons/logo-mark";
import { chatCopy } from "@/data/ai";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface TypingIndicatorProps {
  className?: string;
}

/**
 * Shown between sending and the first token.
 *
 * Three dots with staggered delays, which is the convention this interaction has taught
 * everyone to read as "working". Under reduced motion the dots hold still and the label
 * carries the meaning instead — the state still has to be communicated, so this is not a
 * case where the animation can simply be removed.
 *
 * `role="status"` rather than `aria-live="polite"` on a bare div: status has an implicit
 * live region with the right politeness, and it is announced once rather than on every
 * re-render.
 */
export function TypingIndicator({ className }: TypingIndicatorProps) {
  const reduceMotion = useReducedMotion();

  return (
    <li className={cn("flex gap-3", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg",
          "border border-border bg-elevated",
        )}
      >
        <LogoMark className="size-4" />
      </span>

      <div role="status" className="flex items-center gap-2.5 pt-1.5">
        <span aria-hidden="true" className="flex items-center gap-1">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={cn(
                "size-1.5 rounded-full bg-subtle",
                !reduceMotion && "animate-[caret_1.1s_steps(1)_infinite]",
              )}
              style={
                reduceMotion
                  ? undefined
                  : // Per-dot offset. The value is derived from the index, which no
                    // static class can express.
                    { animationDelay: `${dot * 0.18}s` }
              }
            />
          ))}
        </span>

        <span className="text-xs text-subtle">{chatCopy.thinking}…</span>
      </div>
    </li>
  );
}
