"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

export interface UseIntersectionOptions {
  /** 0–1 fraction of the element that must be visible. */
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  /** Disconnects after the first intersection — the default for reveals. */
  once?: boolean;
  /** Skips observation entirely, e.g. while content is still loading. */
  disabled?: boolean;
}

export interface IntersectionResult<TElement extends Element> {
  ref: RefObject<TElement | null>;
  isIntersecting: boolean;
  /** Fraction visible at the last callback. Useful for scrubbed effects. */
  ratio: number;
  /** True once the element has intersected at least once. */
  hasIntersected: boolean;
}

/**
 * IntersectionObserver as a hook.
 *
 * The observer is disconnected as soon as `once` has been satisfied, so a long
 * page does not accumulate hundreds of live observers as the user scrolls past
 * its sections.
 */
export function useIntersection<TElement extends Element = HTMLDivElement>(
  options: UseIntersectionOptions = {},
): IntersectionResult<TElement> {
  const {
    threshold = 0.15,
    root = null,
    rootMargin = "0px",
    once = true,
    disabled = false,
  } = options;

  const ref = useRef<TElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [ratio, setRatio] = useState(0);

  // Serialise the array threshold so the effect is not re-created every render.
  const thresholdKey = Array.isArray(threshold) ? threshold.join(",") : threshold;

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    // Without IntersectionObserver, show the content rather than hide it.
    if (typeof IntersectionObserver === "undefined") {
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        setIsIntersecting(entry.isIntersecting);
        setRatio(entry.intersectionRatio);

        if (entry.isIntersecting) {
          setHasIntersected(true);
          if (once) observer.disconnect();
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdKey, root, rootMargin, once, disabled]);

  return { ref, isIntersecting, ratio, hasIntersected };
}
