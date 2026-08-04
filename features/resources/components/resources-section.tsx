"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

import { ease } from "@/animations/easings";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Tabs, type TabDefinition } from "@/components/ui/tabs";
import { DURATION, STAGGER } from "@/config/animations";
import { SECTIONS } from "@/constants/sections";
import { resourceCount, resourceGroups } from "@/data/resources";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { getHostname } from "@/utils/url";

/**
 * Resources.
 *
 * Eight groups behind a tab list rather than eight stacked sections — sixty links in a
 * column is a bookmarks export, not a recommendation.
 *
 * Each entry's note explains why it earns a place, which is the only thing that makes a
 * list like this worth reading. The domain is shown beneath every link so a reader can see
 * where they are going before they click.
 *
 * A client component: it owns the tab state and renders icons held in `data/`.
 */
export function ResourcesSection() {
  const idPrefix = useId();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(resourceGroups[0]?.id ?? "books");

  const tabs = useMemo<TabDefinition[]>(
    () =>
      resourceGroups.map((group) => ({
        id: group.id,
        label: group.label,
        icon: group.icon,
        count: group.items.length,
      })),
    [],
  );

  const active = useMemo(
    () => resourceGroups.find((group) => group.id === activeId) ?? resourceGroups[0],
    [activeId],
  );

  const onSelect = useCallback((id: string) => setActiveId(id), []);

  if (!active) return null;

  return (
    <Section
      id={SECTIONS.resources}
      spacing="lg"
      ariaLabelledBy="resources-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <SectionHeader
        badge="Resources"
        headingId="resources-heading"
        title="What I would actually recommend."
        description={`${resourceCount} things worth someone else's time — books, courses, tools and extensions. Every note says why it earns its place rather than describing what it is.`}
        size="lg"
      />

      <div className="flex flex-col gap-8">
        <Tabs
          tabs={tabs}
          activeId={activeId}
          onSelect={onSelect}
          label="Resource categories"
          idPrefix={idPrefix}
        />

        <div
          role="tabpanel"
          id={`${idPrefix}-panel-${activeId}`}
          aria-labelledby={`${idPrefix}-tab-${activeId}`}
          className="flex flex-col gap-6"
        >
          <p className="max-w-2xl text-sm leading-relaxed text-muted" aria-live="polite">
            {active.summary}
          </p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={active.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{
                duration: reduceMotion ? 0.01 : DURATION.normal,
                ease: ease.outQuint,
              }}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {active.items.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0.01 : DURATION.slow,
                    ease: ease.outExpo,
                    delay: reduceMotion ? 0 : index * STAGGER.tight,
                  }}
                  className="h-full"
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group/resource flex h-full flex-col gap-3 rounded-2xl border border-border",
                      "bg-card/60 p-4 transition-colors duration-[var(--duration-normal)]",
                      "hover:border-primary/40 focus-ring",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <h3 className="text-sm font-semibold tracking-tight text-foreground">
                          {item.name}
                        </h3>
                        {item.by ? (
                          <p className="text-xs text-subtle">{item.by}</p>
                        ) : null}
                      </div>

                      <ArrowUpRight
                        aria-hidden="true"
                        className={cn(
                          "size-3.5 shrink-0 text-subtle transition-transform",
                          "duration-[var(--duration-normal)] ease-[var(--ease-out-back)]",
                          "group-hover/resource:-translate-y-0.5 group-hover/resource:translate-x-0.5",
                          "group-hover/resource:text-primary",
                        )}
                      />
                    </div>

                    <p className="text-sm leading-relaxed text-muted">{item.note}</p>

                    <p className="mt-auto font-mono text-2xs text-subtle">
                      {getHostname(item.href)}
                    </p>

                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
