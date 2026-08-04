"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect, useState } from "react";

import { LENIS_CONFIG } from "@/config/animations";
import { LenisContext } from "@/components/providers/lenis-context";
import { useIsTouchDevice } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { setLenisInstance } from "@/lib/lenis-store";

export interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Smooth scrolling.
 *
 * Four decisions worth recording:
 *
 * 1. **Not on touch.** Mobile browsers already have momentum scrolling tuned to
 *    the platform, and overriding it produces the rubbery feel that makes a site
 *    seem broken. Lenis is desktop-only here.
 *
 * 2. **Not under reduced motion.** Interpolated scrolling is exactly the kind of
 *    motion that preference is about.
 *
 * 3. **We own the rAF loop** (`autoRaf: false`). One loop, cancelled on unmount,
 *    rather than a library-internal one we cannot see — and the place a future
 *    scroll-linked effect can be added without a second loop.
 *
 * 4. **Published two ways.** The context serves React consumers; `lib/lenis-store`
 *    serves `utils/scroll`, which runs in event handlers and in the command palette
 *    where no context is reachable. That was a `window.lenis` global until Sprint 4 —
 *    the store's own comment records why a module binding replaced it.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const isTouch = useIsTouchDevice();
  const reduceMotion = useReducedMotion();

  const enabled = !isTouch && !reduceMotion;

  useEffect(() => {
    if (!enabled) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      duration: LENIS_CONFIG.duration,
      easing: LENIS_CONFIG.easing,
      wheelMultiplier: LENIS_CONFIG.wheelMultiplier,
      touchMultiplier: LENIS_CONFIG.touchMultiplier,
      smoothWheel: LENIS_CONFIG.smoothWheel,
      syncTouch: LENIS_CONFIG.syncTouch,
      autoRaf: LENIS_CONFIG.autoRaf,
    });

    // The module-scoped store is how `utils/scroll` reaches the instance from outside
    // React; the context below is how components reach it.
    setLenisInstance(instance);
    setLenis(instance);

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // GSAP is only fetched once smooth scrolling is actually running, so a
    // touch or reduced-motion visitor never downloads ScrollTrigger.
    let disconnect: (() => void) | undefined;
    let cancelled = false;

    void import("@/animations/gsap").then(({ connectLenisToScrollTrigger }) => {
      if (cancelled) return;
      disconnect = connectLenisToScrollTrigger(instance);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      disconnect?.();
      instance.destroy();
      setLenisInstance(null);
      setLenis(null);
    };
  }, [enabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
