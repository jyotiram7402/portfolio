"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Award, Search, X } from "lucide-react";
import {
  useCallback,
  useDeferredValue,
  useId,
  useMemo,
  useState,
} from "react";

import { ease } from "@/animations/easings";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, type TabDefinition } from "@/components/ui/tabs";
import { DURATION, STAGGER } from "@/config/animations";
import { ISSUER_META, certificationTracks } from "@/data/certifications";
import { CertificateCard } from "@/features/certifications/components/certificate-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Certification, CertificationTrack } from "@/types/certifications";
import { fuzzyMatch } from "@/utils/fuzzy";

export interface CertificationsLibraryProps {
  certifications: readonly Certification[];
  className?: string;
}

const ALL = "all";

/**
 * The full certification library: search, subject filters, every entry.
 *
 * Filters on **track** rather than issuer. Issuer is a fact about where a certificate came
 * from; track is what a reader is actually looking for — "does he know Spring" is the
 * question, not "does he use Udemy". The issuer is still searchable as free text, which
 * covers the rarer case.
 *
 * Search reuses `fuzzyMatch`, the same matcher behind the command palette and the project
 * library, so `sprbt` finds Spring Boot in all three. `useDeferredValue` keeps typing
 * responsive on a long list by rendering the previous results while the next are computed.
 *
 * Only the filtered set is mounted, so filtering reduces real work rather than hiding nodes.
 */
export function CertificationsLibrary({
  certifications,
  className,
}: CertificationsLibraryProps) {
  const idPrefix = useId();
  const searchId = useId();
  const reduceMotion = useReducedMotion();

  const [activeId, setActiveId] = useState<string>(ALL);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const tabs = useMemo<TabDefinition[]>(() => {
    const counts = new Map<CertificationTrack, number>();
    for (const entry of certifications) {
      for (const track of entry.tracks) {
        counts.set(track, (counts.get(track) ?? 0) + 1);
      }
    }

    return [
      { id: ALL, label: "All", count: certifications.length },
      // Only tracks with entries, in the canonical order.
      ...certificationTracks
        .filter((track) => (counts.get(track.id) ?? 0) > 0)
        .map((track) => ({
          id: track.id,
          label: track.label,
          count: counts.get(track.id) ?? 0,
        })),
    ];
  }, [certifications]);

  const visible = useMemo(() => {
    const byTrack =
      activeId === ALL
        ? certifications
        : certifications.filter((entry) =>
            entry.tracks.includes(activeId as CertificationTrack),
          );

    const term = deferredSearch.trim();
    if (term.length === 0) return byTrack;

    // Title above issuer above skills: matching a certificate's name is a far stronger
    // signal of intent than matching one chip on it.
    return byTrack
      .map((entry) => {
        const title = fuzzyMatch(term, entry.title).score * 3;
        const issuer = fuzzyMatch(term, ISSUER_META[entry.issuer].label).score * 2;
        const skills = Math.max(
          0,
          ...entry.skills.map((skill) => fuzzyMatch(term, skill).score),
        );
        return { entry, score: title + issuer + skills };
      })
      .filter((row) => row.score > 0)
      .toSorted((a, b) => b.score - a.score)
      .map((row) => row.entry);
  }, [activeId, certifications, deferredSearch]);

  const onSelect = useCallback((id: string) => setActiveId(id), []);
  const onClear = useCallback(() => setSearch(""), []);

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Search certifications by name, issuer or skill
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
          placeholder="Search certifications — try “spring”, “docker” or “udemy”"
          className={cn(
            "h-12 w-full rounded-full border border-border bg-input pr-12 pl-11",
            "text-sm text-foreground placeholder:text-subtle",
            "transition-colors duration-[var(--duration-fast)]",
            "hover:border-border-strong focus-ring",
            // The native clear control cannot be styled and differs per engine.
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
        label="Filter certifications by subject"
        idPrefix={idPrefix}
      />

      <p aria-live="polite" className="font-mono text-2xs tracking-wider text-subtle">
        {visible.length} {visible.length === 1 ? "certification" : "certifications"}
      </p>

      <div
        role="tabpanel"
        id={`${idPrefix}-panel-${activeId}`}
        aria-labelledby={`${idPrefix}-tab-${activeId}`}
      >
        {visible.length === 0 ? (
          <EmptyState
            icon={Award}
            title="Nothing matches that"
            description="The filter is honest — if a subject is empty, there is no certificate for it. Try another track, or clear the search."
          />
        ) : (
          <motion.ul
            layout={!reduceMotion}
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((certification, index) => (
                <motion.li
                  key={certification.id}
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
                  <CertificateCard
                    certification={certification}
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
