"use client";

import { motion } from "framer-motion";
import { List } from "lucide-react";
import type { RefObject } from "react";

import { useReadingProgress } from "@/hooks/use-reading-progress";
import { useToc } from "@/hooks/use-toc";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/utils/scroll";

export interface PostTocProps {
  /** The rendered article body. Headings are read from it after mount. */
  articleRef: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Table of contents with a reading-progress rail.
 *
 * Built from the rendered DOM by `useToc`, so it can never disagree with the article —
 * `rehype-slug` has already put the ids there, and reading them back is the only approach
 * that stays correct when a heading is edited.
 *
 * Renders nothing when there are fewer than three headings. A two-item contents list is
 * more chrome than help.
 *
 * The progress bar measures the article body rather than the document, which is the number
 * a reader cares about — the site-wide bar includes the header and footer and reads 40%
 * one paragraph in.
 *
 * `aria-current="location"` marks the active heading, which is the correct token for "this
 * is where you are within a set" as opposed to `page`.
 */
export function PostToc({ articleRef, className }: PostTocProps) {
  const { entries, activeId } = useToc(articleRef);
  const { progress, percent } = useReadingProgress(articleRef);

  if (entries.length < 3) return null;

  return (
    <nav aria-labelledby="toc-heading" className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2
          id="toc-heading"
          className="eyebrow flex items-center gap-2"
        >
          <List aria-hidden="true" className="size-3" />
          On this page
        </h2>

        {/* The MotionValue is the sole child of its element — Framer Motion
            subscribes to it and writes the text directly, so the percentage updates
            without this component re-rendering. The unit sits in a sibling. */}
        <span
          aria-hidden="true"
          className="font-mono text-2xs text-subtle tabular-nums"
        >
          <motion.span>{percent}</motion.span>%
        </span>
      </div>

      <div className="relative flex gap-4">
        {/* Rail. The static hairline is the full height; the fill is scaled by scroll
            progress, which is composited rather than laid out. */}
        <div className="relative w-px shrink-0 bg-border">
          <motion.div
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute inset-0 origin-top bg-primary"
          />
        </div>

        <ol className="flex min-w-0 flex-col gap-2.5">
          {entries.map((entry) => {
            const isActive = entry.id === activeId;

            return (
              <li key={entry.id} className={cn(entry.level === 3 && "pl-4")}>
                <a
                  href={`#${entry.id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToElement(entry.id);
                    window.history.replaceState(null, "", `#${entry.id}`);
                  }}
                  className={cn(
                    "block rounded text-sm leading-snug transition-colors",
                    "duration-[var(--duration-fast)] focus-ring",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted hover:text-foreground",
                    entry.level === 3 && "text-xs",
                  )}
                >
                  {entry.title}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
