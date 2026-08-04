import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

import { DURATION } from "@/config/animations";
import { toCssEasing } from "@/animations/easings";
import { isBrowser } from "@/utils/dom";

/**
 * GSAP integration.
 *
 * Framer Motion owns component-level motion; GSAP owns scroll choreography,
 * where ScrollTrigger has no equivalent. The two never animate the same
 * property on the same element.
 */

let registered = false;

/** Registers plugins exactly once. Safe to call from every component. */
export function registerGsap(): typeof gsap {
  if (!isBrowser) return gsap;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({
      duration: DURATION.slow,
      ease: "expo.out",
      overwrite: "auto",
    });
    // The site is dark-first and composited; nudging GSAP to prefer transforms
    // keeps scroll work off the main thread's layout path.
    gsap.config({ force3D: true, nullTargetWarn: false });
    registered = true;
  }
  return gsap;
}

/**
 * Teaches ScrollTrigger to read Lenis's virtual scroll position.
 *
 * Without this, ScrollTrigger samples `window.scrollY` — which Lenis is
 * animating independently — and every pinned or scrubbed animation lags one
 * frame behind the content. Returns a cleanup function.
 */
export function connectLenisToScrollTrigger(lenis: Lenis): () => void {
  registerGsap();

  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (typeof value === "number") {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  ScrollTrigger.defaults({ scroller: document.documentElement });
  ScrollTrigger.refresh();

  return () => {
    lenis.off("scroll", onScroll);
    ScrollTrigger.scrollerProxy(document.documentElement, undefined);
    ScrollTrigger.refresh();
  };
}

/** Kills every trigger. Called on route change so stale triggers cannot leak. */
export function killScrollTriggers(): void {
  if (!isBrowser) return;
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export function refreshScrollTriggers(): void {
  if (!isBrowser) return;
  ScrollTrigger.refresh();
}

/* -------------------------------------------------------------------------- */
/*  Presets                                                                   */
/* -------------------------------------------------------------------------- */

export interface ParallaxOptions {
  /** Fraction of the scroll distance the element moves. Negative moves up. */
  strength?: number;
  start?: string;
  end?: string;
}

/**
 * Vertical parallax tied to the element's own scroll range.
 *
 * Returns a dispose function rather than the tween. The ScrollTrigger outlives
 * its tween, so both have to be killed — leaking that requirement to every caller
 * is how a trigger ends up firing against a detached node after a route change.
 * Callers get one thing to call, and it is correct.
 */
export function createParallax(
  target: gsap.TweenTarget,
  { strength = 0.15, start = "top bottom", end = "bottom top" }: ParallaxOptions = {},
): () => void {
  registerGsap();

  const tween = gsap.to(target, {
    yPercent: strength * 100,
    ease: "none",
    scrollTrigger: { trigger: target as gsap.DOMTarget, start, end, scrub: true },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/** Scrubbed 0→1 progress, exposed as a CSS custom property on the element. */
export function createScrollProgressVar(
  target: HTMLElement,
  variableName = "--scroll-progress",
): gsap.core.Tween {
  registerGsap();
  return gsap.fromTo(
    target,
    { [variableName]: 0 },
    {
      [variableName]: 1,
      ease: "none",
      scrollTrigger: {
        trigger: target,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}

/** The CSS easing string matching GSAP's `expo.out`, for handoffs to CSS. */
export const GSAP_CSS_EASE = toCssEasing("outExpo");

export { gsap, ScrollTrigger };
