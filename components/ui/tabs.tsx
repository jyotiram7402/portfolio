"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { type KeyboardEvent, useCallback, useId, useRef } from "react";

import { cn } from "@/lib/utils";

export interface TabDefinition {
  id: string;
  label: string;
  icon?: LucideIcon;
  /** Rendered as a small count after the label. */
  count?: number;
}

export interface TabsProps {
  tabs: readonly TabDefinition[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Accessible name for the tab list. */
  label: string;
  /** Shared prefix so `aria-controls` can address the caller's panel. */
  idPrefix?: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * A generic ARIA tab list.
 *
 * Three behaviours that have to be built rather than assumed:
 *
 * • **Roving tabindex.** One tab is in the page's tab order; the rest are reached with
 *   arrow keys. Ten tabs each taking a Tab press turns a filter into a wall.
 * • **Arrow, Home and End** move selection *and* focus together, which is what
 *   `aria-selected` promises.
 * • **`aria-controls`** ties each tab to the caller's panel, which must carry
 *   `id={`${idPrefix}-panel-${activeId}`}` and `role="tabpanel"`.
 *
 * The active pill is a shared `layoutId`, so it slides between tabs instead of cutting —
 * one animated element for the whole list rather than a transition on every tab.
 *
 * Sprint 1's skills explorer has its own equivalent of this, written before there was a
 * second caller. Consolidating the two is a Sprint 4 item; this component is the one new
 * code should use.
 */
export function Tabs({
  tabs,
  activeId,
  onSelect,
  label,
  idPrefix,
  size = "md",
  className,
}: TabsProps) {
  const generatedId = useId();
  const prefix = idPrefix ?? generatedId;
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = useCallback((index: number) => {
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      ?.[index]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const current = tabs.findIndex((tab) => tab.id === activeId);
      if (current === -1) return;

      let next = current;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (current + 1) % tabs.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (current - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = tabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const target = tabs[next];
      if (!target) return;
      onSelect(target.id);
      focusTab(next);
    },
    [activeId, focusTab, onSelect, tabs],
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className={cn(
        // Scrolls on narrow viewports rather than wrapping into three ragged rows.
        // The bleed matches `Container`'s gutter at each breakpoint, so the row starts
        // on the page's left edge instead of 8px inside or outside it.
        "no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:-mx-8 sm:px-8",
        "md:mx-0 md:flex-wrap md:overflow-visible md:px-0",
        // Two rules that make this row usable on a phone. `overscroll-x-contain`
        // stops a horizontal swipe from chaining into the browser's back gesture.
        // Scroll snapping is deliberately absent: `snap-mandatory` here re-snapped
        // the row on the slightest horizontal component of a vertical swipe, so the
        // filters visibly jerked sideways while the reader was scrolling the page.
        "overscroll-x-contain",
        className,
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeId;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${prefix}-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${prefix}-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "relative inline-flex shrink-0 items-center gap-2 rounded-full",
              "font-medium whitespace-nowrap transition-colors",
              "duration-[var(--duration-fast)] focus-ring",
              // 44px minimum touch height on a phone, dropping to the visual size once
              // there is a pointer. A 32px filter chip is a miss waiting to happen.
              "min-h-11 md:min-h-0",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              isActive ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={`${prefix}-pill`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-full",
                  "border border-border-strong bg-elevated shadow-sm",
                )}
              />
            ) : null}

            {Icon ? (
              <Icon
                aria-hidden="true"
                className={cn("size-3.5 shrink-0", isActive ? "text-primary" : "text-subtle")}
              />
            ) : null}

            {tab.label}

            {tab.count !== undefined ? (
              <span className="font-mono text-2xs text-subtle">{tab.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
