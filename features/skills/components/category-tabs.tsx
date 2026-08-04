"use client";

import { motion } from "framer-motion";
import { type KeyboardEvent, useCallback, useRef } from "react";

import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";

export interface CategoryTabsProps {
  activeId: string;
  onSelect: (id: string) => void;
  /** Id prefix shared with the panel, so `aria-controls` can point at it. */
  idPrefix: string;
  className?: string;
}

/**
 * The explorer's category selector.
 *
 * A genuine ARIA tab list, which means three things had to be built rather than
 * assumed:
 *
 * • **Roving tabindex.** Exactly one tab is in the page's tab order; the others are
 *   reached with arrow keys. Nine tabs each taking a Tab press would make the
 *   section a wall for keyboard users.
 * • **Arrow, Home and End keys** move selection and move focus with it, which is
 *   what `aria-selected` promises.
 * • **`aria-controls` / `aria-labelledby`** tie each tab to the panel below.
 *
 * The active pill is a shared `layoutId`, so it slides between tabs instead of
 * cutting. That is one animated element for the whole list rather than a transition
 * on every tab.
 *
 * Horizontal scroll below `md` uses `no-scrollbar` with `snap` — the row stays one
 * line on a 320px screen instead of wrapping into three.
 */
export function CategoryTabs({
  activeId,
  onSelect,
  idPrefix,
  className,
}: CategoryTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = useCallback((index: number) => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[index]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = skillCategories.length;
      const current = skillCategories.findIndex(
        (category) => category.id === activeId,
      );
      if (current === -1) return;

      let next = current;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (current + 1) % count;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (current - 1 + count) % count;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = count - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const target = skillCategories[next];
      if (!target) return;

      onSelect(target.id);
      focusTab(next);
    },
    [activeId, focusTab, onSelect],
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Technology categories"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className={cn(
        "no-scrollbar -mx-6 flex snap-x snap-mandatory gap-2 overflow-x-auto px-6",
        "md:mx-0 md:flex-wrap md:overflow-visible md:px-0",
        className,
      )}
    >
      {skillCategories.map((category) => {
        const Icon = category.icon;
        const isActive = category.id === activeId;

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${category.id}`}
            aria-selected={isActive}
            aria-controls={`${idPrefix}-panel-${category.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(category.id)}
            className={cn(
              "relative shrink-0 snap-start rounded-full px-4 py-2",
              "inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap",
              "transition-colors duration-[var(--duration-fast)]",
              "focus-ring",
              isActive ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={`${idPrefix}-tab-pill`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-full",
                  "border border-border-strong bg-elevated shadow-sm",
                )}
              />
            ) : null}

            <Icon
              aria-hidden="true"
              className={cn(
                "size-3.5 shrink-0",
                isActive ? "text-primary" : "text-subtle",
              )}
            />
            {category.label}

            <span className="font-mono text-2xs text-subtle">
              {category.technologies.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
