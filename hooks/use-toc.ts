"use client";

import { type RefObject, useEffect, useState } from "react";

import type { TocEntry } from "@/types/blog";

/**
 * Builds a table of contents from the rendered article, and tracks which heading is
 * being read.
 *
 * Extracted from the DOM rather than declared alongside the post. The ids are already
 * there — `rehype-slug` adds them during MDX compilation — so reading them back is the
 * only approach that cannot drift from the article. Declaring the TOC in the registry
 * would mean maintaining the same headings in two files and eventually shipping one
 * that lies.
 *
 * Only `h2` and `h3` are collected. A four-level contents list is a document map, and
 * nobody uses it.
 *
 * Active tracking uses one observer over all headings with a band near the top of the
 * viewport, and picks the last heading to have entered it — matching the direction of
 * reading.
 */
export function useToc(
  containerRef: RefObject<HTMLElement | null>,
): { entries: readonly TocEntry[]; activeId: string | null } {
  const [entries, setEntries] = useState<readonly TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const headings = Array.from(
      container.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]"),
    );

    setEntries(
      headings.map((heading) => ({
        id: heading.id,
        // `rehype-autolink-headings` wraps the text in an anchor, so `textContent`
        // is the reliable read rather than `innerText` or `innerHTML`.
        title: heading.textContent?.trim() ?? heading.id,
        level: heading.tagName === "H2" ? 2 : 3,
      })),
    );

    if (headings.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visible = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (observerEntries) => {
        for (const entry of observerEntries) {
          visible.set(entry.target.id, entry.isIntersecting);
        }

        let next: string | null = null;
        for (const heading of headings) {
          if (visible.get(heading.id)) next = heading.id;
        }

        // Nothing in the band: keep the last known heading rather than clearing,
        // so the marker does not flicker off between sections.
        if (next !== null) {
          setActiveId((previous) => (previous === next ? previous : next));
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [containerRef]);

  return { entries, activeId };
}
