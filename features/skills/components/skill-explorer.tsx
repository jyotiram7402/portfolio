"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useId, useState } from "react";

import { ease } from "@/animations/easings";
import { DURATION, STAGGER } from "@/config/animations";
import { DEFAULT_SKILL_CATEGORY, getSkillCategory } from "@/data/skills";
import { CategoryTabs } from "@/features/skills/components/category-tabs";
import { TechCard } from "@/features/skills/components/tech-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface SkillExplorerProps {
  className?: string;
}

/**
 * The interactive technology explorer.
 *
 * Only the active category's cards are mounted — around ten nodes instead of the
 * forty-plus a single flat grid would render, each of which would otherwise carry a
 * tilt hook and a pointer listener.
 *
 * State is deliberately minimal: the active category, and the id of a pinned card.
 * Both are owned here rather than in the cards, so exactly one description can be
 * pinned at a time and switching category clears it.
 *
 * The panel swap is `mode="wait"`, so the outgoing grid finishes leaving before the
 * incoming one starts. Crossfading two grids of differing lengths in the same box
 * makes the section jump.
 */
export function SkillExplorer({ className }: SkillExplorerProps) {
  const idPrefix = useId();
  const reduceMotion = useReducedMotion();

  const [activeId, setActiveId] = useState<string>(DEFAULT_SKILL_CATEGORY);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const category = getSkillCategory(activeId);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    // A pin belongs to the card that was pinned; carrying it across categories
    // would leave an unrelated card open.
    setPinnedId(null);
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setPinnedId((previous) => (previous === id ? null : id));
  }, []);

  if (!category) return null;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <CategoryTabs
        activeId={activeId}
        onSelect={handleSelect}
        idPrefix={idPrefix}
      />

      <p className="max-w-2xl text-sm leading-relaxed text-muted" aria-live="polite">
        {category.summary}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={category.id}
          role="tabpanel"
          id={`${idPrefix}-panel-${category.id}`}
          aria-labelledby={`${idPrefix}-tab-${category.id}`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{
            duration: reduceMotion ? 0.01 : DURATION.normal,
            ease: ease.outQuint,
          }}
        >
          <ul
            className={cn(
              "grid gap-3",
              // One column on the narrowest phones: a two-column card at 320px
              // is too narrow for the description to fit without clipping.
              "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
            )}
          >
            {category.technologies.map((technology, index) => (
              <motion.li
                key={technology.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0.01 : DURATION.slow,
                  ease: ease.outExpo,
                  delay: reduceMotion ? 0 : index * STAGGER.tight,
                }}
                className="h-full"
              >
                <TechCard
                  technology={technology}
                  pinned={pinnedId === technology.id}
                  onTogglePin={handleTogglePin}
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
