"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface KbdProps {
  /** Key names. `mod` renders as ⌘ on Apple platforms and Ctrl elsewhere. */
  keys: readonly string[];
  className?: string;
}

const SYMBOLS: Readonly<Record<string, string>> = {
  shift: "⇧",
  alt: "⌥",
  enter: "↵",
  escape: "esc",
  arrowup: "↑",
  arrowdown: "↓",
};

/**
 * Keyboard shortcut hint.
 *
 * `mod` is resolved after mount, not during render. The platform is only knowable on
 * the client, and rendering ⌘ on the server would be a hydration mismatch on Windows —
 * so it starts as Ctrl (the majority case) and corrects itself, which is a text swap
 * inside a fixed-width element and therefore invisible.
 */
export function Kbd({ keys, className }: KbdProps) {
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    setIsApple(/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent));
  }, []);

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key) => {
        const lower = key.toLowerCase();
        const label =
          lower === "mod" ? (isApple ? "⌘" : "Ctrl") : (SYMBOLS[lower] ?? key);

        return (
          <kbd
            key={key}
            className={cn(
              "inline-flex h-5 min-w-5 items-center justify-center rounded",
              "border border-border bg-elevated px-1.5",
              "font-mono text-2xs font-medium text-muted",
            )}
          >
            {label}
          </kbd>
        );
      })}
    </span>
  );
}
