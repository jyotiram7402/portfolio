"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect, useState } from "react";

import { LENIS_CONFIG } from "@/config/animations";
import { LenisContext } from "@/components/providers/lenis-context";
import { useIsTouchDevice } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

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
 * 4. **Exposed on `window`.** `utils/scroll` and the GSAP bridge need the
 *    instance from outside React. The context is the supported path; `window` is
 *    the escape hatch for non-React callers.
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

    window.lenis = instance;
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
      if (window.lenis === instance) delete window.lenis;
      setLenis(null);
    };
  }, [enabled]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
