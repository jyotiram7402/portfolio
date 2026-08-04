"use client";

import { useEffect, useState } from "react";

/**
 * Scroll spy: which of the given section ids is currently being read.
 *
 * One observer for all sections, created once by the navbar and passed down as a
 * prop, rather than one observer per nav link. A per-link version would create as
 * many observers as there are links and make them fight over the answer.
 *
 * The `rootMargin` shrinks the viewport to a horizontal band just above centre,
 * so a section becomes "active" when it occupies the reader's actual focus rather
 * than when its first pixel appears. Where the band overlaps two sections, the
 * one further down the page wins — matching the direction of travel.
 *
 * Returns `null` before any section qualifies (the top of the hero), which is
 * correct: nothing in the nav should be highlighted there.
 */
export function useActiveSection(
  ids: readonly string[],
  options: { enabled?: boolean } = {},
): string | null {
  const { enabled = true } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  // Stable primitive dependency: the array is a new reference every render.
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;

    const sectionIds = key.split(",").filter(Boolean);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    // Tracked outside the callback because each entry only reports its own
    // change; deciding the winner needs the state of all of them.
    const visible = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting);
        }

        // Last qualifying section in document order.
        let next: string | null = null;
        for (const id of sectionIds) {
          if (visible.get(id)) next = id;
        }

        setActiveId((previous) => (previous === next ? previous : next));
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, key]);

  return activeId;
}
