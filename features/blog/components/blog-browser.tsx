"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";
import { useDeferredValue, useId, useMemo, useState } from "react";

import { ease } from "@/animations/easings";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Tabs, type TabDefinition } from "@/components/ui/tabs";
import { DURATION, STAGGER } from "@/config/animations";
import { activeCategories } from "@/data/blog";
import { PostCard } from "@/features/blog/components/post-card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { countByCategory, listPosts, renderablePosts } from "@/services/content.service";
import { cn } from "@/lib/utils";

const ALL = "all";

export interface BlogBrowserProps {
  className?: string;
}

/**
 * Search and category filter over the article list.
 *
 * Both run on the client against the same `listPosts` implementation the server uses. With
 * a handful of posts this is the right trade: no round trip per keystroke, no loading
 * state, and one definition of "which posts match" instead of two that drift.
 *
 * `useDeferredValue` on the query lets React keep the input responsive while it re-renders
 * the list. It is the correct tool here rather than a debounce — a debounce delays the
 * result by a fixed amount whether or not the device needed it, while this yields only
 * when the render is genuinely expensive.
 *
 * The category tabs and the search compose: filtering to Java and then searching narrows
 * within Java, which is what a reader expects and what a naive implementation gets wrong.
 */
export function BlogBrowser({ className }: BlogBrowserProps) {
  const idPrefix = useId();
  const reduceMotion = useReducedMotion();

  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => countByCategory(), []);

  const tabs = useMemo<TabDefinition[]>(
    () => [
      { id: ALL, label: "All", count: renderablePosts.length },
      ...activeCategories.map((entry) => ({
        id: entry.id,
        label: entry.label,
        count: counts[entry.id] ?? 0,
      })),
    ],
    [counts],
  );

  const results = useMemo(
    () => listPosts({ category, query: deferredQuery }),
    [category, deferredQuery],
  );

  const isSearching = deferredQuery.trim().length > 0;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex flex-col gap-5">
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, tag or topic…"
          aria-label="Search articles"
          autoComplete="off"
          leading={<Search />}
          trailing={
            query.length > 0 ? (
              <IconButton
                label="Clear search"
                variant="ghost"
                size="sm"
                onClick={() => setQuery("")}
              >
                <X />
              </IconButton>
            ) : undefined
          }
          className="max-w-xl"
        />

        <Tabs
          tabs={tabs}
          activeId={category}
          onSelect={setCategory}
          label="Filter articles by category"
          idPrefix={idPrefix}
          size="sm"
        />
      </div>

      {/* Announces the result count on change, so a screen reader hears the effect of
          typing rather than having to explore the list to find out. */}
      <p role="status" aria-live="polite" className="text-xs text-subtle">
        {results.length} {results.length === 1 ? "article" : "articles"}
        {isSearching ? ` matching “${deferredQuery.trim()}”` : null}
        {category !== ALL
          ? ` in ${activeCategories.find((entry) => entry.id === category)?.label ?? category}`
          : null}
      </p>

      <div
        role="tabpanel"
        id={`${idPrefix}-panel-${category}`}
        aria-labelledby={`${idPrefix}-tab-${category}`}
      >
        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nothing matches that"
            description="Try a technology name, a tag, or clear the filters. The archive is still small — there are only a handful of articles to find."
          />
        ) : (
          <motion.ul
            layout={!reduceMotion}
            className={cn(
              "grid gap-5 sm:grid-cols-2",
              // The lead article spans both columns, but only in the unfiltered,
              // unsearched view — inside a result set there is no "lead".
              !isSearching &&
                category === ALL &&
                "[&>li:first-child]:sm:col-span-2",
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((post, index) => (
                <motion.li
                  key={post.slug}
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
                  <PostCard
                    post={post}
                    featured={!isSearching && category === ALL && index === 0}
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
