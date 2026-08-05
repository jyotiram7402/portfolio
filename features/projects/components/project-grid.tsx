"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FolderSearch } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

import { ease } from "@/animations/easings";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, type TabDefinition } from "@/components/ui/tabs";
import { DURATION, STAGGER } from "@/config/animations";
import { projectDomains } from "@/data/projects";
import { ProjectCard } from "@/features/projects/components/project-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Project, ProjectDomain } from "@/types/projects";

export interface ProjectGridProps {
  /**
   * The resolved project list, passed down from the server.
   *
   * Deliberately a prop rather than a module import. Projects are now discovered from the GitHub
   * API by a server-only service, so this component cannot fetch them itself — and taking them as
   * a prop is also what makes the grid reusable for a future `/work` page.
   */
  projects: readonly Project[];
  className?: string;
}

const ALL = "all";

/**
 * Filterable project grid.
 *
 * The tab list is built from the projects actually present, so a domain with nothing in it is never
 * offered. That matters more now than it did with a hardcoded list: which domains have entries
 * depends on what is tagged on GitHub, and can change without a deploy.
 *
 * Only the filtered set is mounted, and each card carries a tilt hook and pointer listeners, so
 * filtering genuinely reduces work rather than hiding nodes with CSS.
 *
 * `layout` on the list animates the reflow when the filter changes — the one place a layout
 * animation earns its cost here, because without it cards teleport and the grid reads as a page
 * change rather than a filter.
 */
export function ProjectGrid({ projects, className }: ProjectGridProps) {
  const idPrefix = useId();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>(ALL);

  const tabs = useMemo<TabDefinition[]>(() => {
    const counts = new Map<ProjectDomain, number>();
    for (const project of projects) {
      for (const domain of project.domains) {
        counts.set(domain, (counts.get(domain) ?? 0) + 1);
      }
    }

    return [
      { id: ALL, label: "All", count: projects.length },
      // Only domains with entries, in the canonical display order.
      ...projectDomains
        .filter((domain) => (counts.get(domain.id) ?? 0) > 0)
        .map((domain) => ({
          id: domain.id,
          label: domain.label,
          count: counts.get(domain.id) ?? 0,
        })),
    ];
  }, [projects]);

  const visible = useMemo(
    () =>
      activeId === ALL
        ? projects
        : projects.filter((project) =>
            project.domains.includes(activeId as ProjectDomain),
          ),
    [activeId, projects],
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
              // The lead project claims two columns, which is what stops a three-column
              // grid from reading as three equal things.
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
