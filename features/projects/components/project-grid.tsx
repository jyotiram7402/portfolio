"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FolderSearch, Search, X } from "lucide-react";
import { useCallback, useDeferredValue, useId, useMemo, useState } from "react";

import { ease } from "@/animations/easings";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, type TabDefinition } from "@/components/ui/tabs";
import { DURATION, STAGGER } from "@/config/animations";
import { projectDomains } from "@/data/projects";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { queryProjects } from "@/lib/project-selection";
import { cn } from "@/lib/utils";
import type { Project, ProjectDomain } from "@/types/projects";

export interface ProjectGridProps {
  /**
   * The resolved project list, passed down from the server.
   *
   * Deliberately a prop rather than a module import. Projects are discovered from the
   * GitHub API by a server-only service, so this component cannot fetch them itself — and
   * taking them as a prop is what lets the homepage showcase and this library share one
   * resolution.
   */
  projects: readonly Project[];
  className?: string;
}

const ALL = "all";

/**
 * The full project library: search, domain filters, and every resolved project.
 *
 * This is the exploration surface. It lives on `/projects` rather than on the homepage,
 * which is why the filter bar and the search box can afford the space they take.
 *
 * The tab list is built from the projects actually present, so a domain with nothing in it
 * is never offered. That matters more with discovery than it did with a hardcoded list:
 * which domains have entries depends on what is tagged on GitHub and can change without a
 * deploy.
 *
 * Search runs through `queryProjects`, which is the same matcher as the command palette —
 * so `sprbt` finds Spring Boot here exactly as it does there. `useDeferredValue` keeps
 * typing responsive: on a long list React renders the stale results while the new ones are
 * computed, instead of blocking the keystroke.
 *
 * Only the filtered set is mounted, so filtering genuinely reduces work rather than hiding
 * nodes with CSS. `layout` animates the reflow — the one place a layout animation earns its
 * cost here, because without it cards teleport and the grid reads as a page change.
 */
export function ProjectGrid({ projects, className }: ProjectGridProps) {
  const idPrefix = useId();
  const searchId = useId();
  const reduceMotion = useReducedMotion();

  const [activeId, setActiveId] = useState<string>(ALL);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

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
      queryProjects(projects, {
        search: deferredSearch,
        domain: activeId === ALL ? undefined : (activeId as ProjectDomain),
      }),
    [activeId, deferredSearch, projects],
  );

  const onSelect = useCallback((id: string) => setActiveId(id), []);
  const onClear = useCallback(() => setSearch(""), []);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* ----------------------------------------------------------- search -- */}
      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Search projects by name or technology
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-subtle"
        />
        <input
          id={searchId}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects — try “kafka” or “spring”"
          className={cn(
            "h-12 w-full rounded-full border border-border bg-input pr-12 pl-11",
            "text-sm text-foreground placeholder:text-subtle",
            "transition-colors duration-[var(--duration-fast)]",
            "hover:border-border-strong focus-ring",
            // The native clear affordance is inconsistent across engines and cannot be
            // styled, so it is suppressed in favour of the button below.
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
        />
        {search.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className={cn(
              "absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center",
              "rounded-full text-subtle transition-colors",
              "hover:text-foreground focus-ring",
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>

      <Tabs
        tabs={tabs}
        activeId={activeId}
        onSelect={onSelect}
        label="Filter projects by area"
        idPrefix={idPrefix}
      />

      {/* A live count, so a filter that removed most of the list says so. */}
      <p aria-live="polite" className="font-mono text-2xs tracking-wider text-subtle">
        {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <div
        role="tabpanel"
        id={`${idPrefix}-panel-${activeId}`}
        aria-labelledby={`${idPrefix}-tab-${activeId}`}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={FolderSearch}
            title="Nothing matches that yet"
            description="The filter is honest — if a category is empty, there is no work to show there. Try another area, clear the search, or ask the assistant what is coming."
          />
        ) : (
          <motion.ul
            layout={!reduceMotion}
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
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
                    // Capped, so the twentieth card is not still waiting to appear.
                    delay: reduceMotion ? 0 : Math.min(index, 5) * STAGGER.tight,
                  }}
                  className="h-full"
                >
                  <ProjectShowcaseCard
                    project={project}
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 92vw"
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </div>
  );
}
