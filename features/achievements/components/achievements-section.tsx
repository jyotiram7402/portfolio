"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Trophy } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

import { ease } from "@/animations/easings";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, type TabDefinition } from "@/components/ui/tabs";
import { DURATION, STAGGER } from "@/config/animations";
import { SECTIONS } from "@/constants/sections";
import { ACHIEVEMENT_KIND_META, achievementKinds, achievements } from "@/data/achievements";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { AchievementKind } from "@/types/explore";

const ALL = "all";

/**
 * Achievements.
 *
 * Grouped by kind with a filter rather than presented as one timeline: a certificate and a
 * production win are different claims, and mixing them flattens both. The filter only
 * offers kinds that have entries, so no tab is ever empty.
 *
 * A client component — it renders icons from `data/` and owns filter state.
 *
 * Entries without a verification link say nothing about it rather than showing a disabled
 * "Verify" button. Most production work is unverifiable by link, and pretending otherwise
 * is the kind of detail an interviewer notices.
 */
export function AchievementsSection() {
  const idPrefix = useId();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(ALL);

  const tabs = useMemo<TabDefinition[]>(
    () => [
      { id: ALL, label: "Everything", count: achievements.length },
      ...achievementKinds.map((kind) => ({
        id: kind,
        label: ACHIEVEMENT_KIND_META[kind].label,
        icon: ACHIEVEMENT_KIND_META[kind].icon,
        count: achievements.filter((entry) => entry.kind === kind).length,
      })),
    ],
    [],
  );

  const visible = useMemo(
    () =>
      activeId === ALL
        ? achievements
        : achievements.filter((entry) => entry.kind === (activeId as AchievementKind)),
    [activeId],
  );

  const onSelect = useCallback((id: string) => setActiveId(id), []);

  return (
    <Section
      id={SECTIONS.achievements}
      spacing="lg"
      ariaLabelledBy="achievements-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <SectionHeader
        badge="Achievements"
        headingId="achievements-heading"
        title="Things that actually happened."
        description="Production wins, self-directed study and the degree. No invented metrics anywhere — every claim here is one that holds up when someone asks about it in detail."
        size="lg"
      />

      <div className="flex flex-col gap-8">
        <Tabs
          tabs={tabs}
          activeId={activeId}
          onSelect={onSelect}
          label="Filter achievements by kind"
          idPrefix={idPrefix}
        />

        <div
          role="tabpanel"
          id={`${idPrefix}-panel-${activeId}`}
          aria-labelledby={`${idPrefix}-tab-${activeId}`}
        >
          {visible.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="Nothing in this category yet"
              description="The filter only shows kinds that have entries, so this should not happen — if it does, the data and the tabs have drifted."
            />
          ) : (
            <motion.ul
              layout={!reduceMotion}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((entry, index) => {
                  const Icon = entry.icon;
                  const kindMeta = ACHIEVEMENT_KIND_META[entry.kind];

                  return (
                    <motion.li
                      key={entry.id}
                      layout={!reduceMotion}
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                      transition={{
                        duration: reduceMotion ? 0.01 : DURATION.slow,
                        ease: ease.outExpo,
                        delay: reduceMotion ? 0 : Math.min(index, 6) * STAGGER.tight,
                      }}
                      className="h-full"
                    >
                      <GlassCard
                        interactive
                        padding="md"
                        radius="2xl"
                        className="group/award flex h-full flex-col gap-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "grid size-10 shrink-0 place-items-center rounded-xl",
                              "border border-border bg-elevated text-muted",
                              "transition-colors duration-[var(--duration-slow)]",
                              "group-hover/award:border-primary/40 group-hover/award:text-primary",
                              "[&_svg]:size-4",
                            )}
                          >
                            <Icon />
                          </span>

                          <span className="shrink-0 font-mono text-2xs tracking-wider text-subtle uppercase">
                            {entry.period}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <p className="font-mono text-2xs tracking-widest text-subtle uppercase">
                            {kindMeta.label}
                          </p>
                          <h3 className="text-sm leading-snug font-semibold tracking-tight text-foreground">
                            {entry.title}
                          </h3>
                          <p className="text-xs text-muted">{entry.issuer}</p>
                        </div>

                        <p className="text-sm leading-relaxed text-muted">
                          {entry.description}
                        </p>

                        {entry.href ? (
                          <a
                            href={entry.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "mt-auto inline-flex w-fit items-center gap-1.5 rounded-full",
                              "text-xs font-medium text-foreground underline-offset-4",
                              "transition-colors hover:underline focus-ring",
                            )}
                          >
                            Verify
                            <ArrowUpRight aria-hidden="true" className="size-3" />
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        ) : null}
                      </GlassCard>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>
    </Section>
  );
}
