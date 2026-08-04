"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FolderSearch } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

import { ease } from "@/animations/easings";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, type TabDefinition } from "@/components/ui/tabs";
import { DURATION, STAGGER } from "@/config/animations";
import { getProjectsByDomain, projectDomains, projects } from "@/data/projects";
import { ProjectCard } from "@/features/projects/components/project-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { ProjectDomain } from "@/types/projects";

export interface ProjectGridProps {
  className?: string;
}

const ALL = "all";

/**
 * Filterable project grid.
 *
 * Uses the shared `Tabs` primitive, so the keyboard model here is identical to the one in
 * Resources and the blog filter — arrow keys move, one tab in the page's tab order.
 *
 * Only the filtered set is mounted, and each card carries a tilt hook and pointer
 * listeners, so filtering genuinely reduces work rather than just hiding nodes with CSS.
 *
 * `layout` on the list animates the reflow when the filter changes. That is the one place
 * a layout animation earns its cost here: without it, cards teleport into new positions
 * and the grid reads as a page change rather than as a filter.
 */
export function ProjectGrid({ className }: ProjectGridProps) {
  const idPrefix = useId();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(ALL);

  const tabs = useMemo<TabDefinition[]>(
    () => [
      { id: ALL, label: "All", count: projects.length },
      ...projectDomains.map((domain) => ({
        id: domain.id,
        label: domain.label,
        count: getProjectsByDomain(domain.id).length,
      })),
    ],
    [],
  );

  const visible = useMemo(
    () =>
      activeId === ALL
        ? projects
        : // `activeId` is a string because `Tabs` is generic over tab ids. It can only
          // ever hold a value that came from `projectDomains`, so the narrowing is safe.
          getProjectsByDomain(activeId as ProjectDomain),
    [activeId],
  );

  const onSelect = useCallback((id: string) => setActiveId(id), []);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <Tabs
        tabs={tabs}
        activeId={activeId}
        onSelect={onSelect}
        label="Filter projects by area"
        idPrefix={idPrefix}
      />

      <div
        role="tabpanel"
        id={`${idPrefix}-panel-${activeId}`}
        aria-labelledby={`${idPrefix}-tab-${activeId}`}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title="Nothing published in that area yet"
            description="The filter is honest — if a category is empty, there is no work to show there. Try another, or ask the assistant what is coming."
          />
        ) : (
          <motion.ul
            layout={!reduceMotion}
            className={cn(
              "grid gap-5",
              "sm:grid-cols-2 lg:grid-cols-3",
              // Featured projects claim two columns, which is what stops a
              // three-column grid from reading as three equal things.
              "[&>li:first-child]:sm:col-span-2 [&>li:first-child]:lg:col-span-2",
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project, index) => (
                <motion.li
                  key={project.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: reduceMotion ? 0.01 : DURATION.slow,
                    ease: ease.outExpo,
                    delay: reduceMotion ? 0 : Math.min(index, 5) * STAGGER.tight,
                  }}
                  className="h-full"
                >
                  <ProjectCard project={project} featured={index === 0} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
}
