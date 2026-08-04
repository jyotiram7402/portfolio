"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

import { ease } from "@/animations/easings";
import { LogoMark } from "@/components/icons/logo-mark";
import { PRELOADER } from "@/config/animations";
import { siteConfig } from "@/config/site";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Opening loader.
 *
 * The design constraint is that a loading screen must never be able to trap
 * anyone, so it is bounded from three directions:
 *
 *   • It plays once per session — `sessionStorage` means a navigation back to the
 *     home page does not replay it.
 *   • `minDurationMs` stops it flashing on a warm cache; `maxDurationMs` is a hard
 *     ceiling that dismisses it even if `load` never fires.
 *   • Under reduced motion it is skipped outright.
 *
 * It is server-rendered rather than mounted on the client, so it covers the page
 * from the first paint instead of appearing over already-visible content. The
 * `<noscript>` rule removes it entirely when JavaScript is unavailable — without
 * that, a no-JS visitor would be left staring at an overlay forever.
 */
export function Preloader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [percent, setPercent] = useState(0);

  /** 0–100, so the readout and the bar share one source of truth. */
  const progress = useMotionValue(0);
  /** `scaleX` needs 0–1; deriving it avoids keeping two values in sync. */
  const barScale = useTransform(progress, [0, 100], [0, 1]);

  // Round to 5% so the readout re-renders ~20 times instead of once per frame.
  useMotionValueEvent(progress, "change", (value) => {
    setPercent(Math.min(100, Math.round(value / 5) * 5));
  });

  useEffect(() => {
    const alreadySeen =
      sessionStorage.getItem(STORAGE_KEYS.preloaderSeen) === "1";

    if (alreadySeen || reduceMotion) {
      setVisible(false);
      return;
    }

    const start = performance.now();
    let frame = 0;
    let dismissTimer = 0;

    const finish = () => {
      sessionStorage.setItem(STORAGE_KEYS.preloaderSeen, "1");
      setVisible(false);
    };

    const tick = () => {
      const elapsed = performance.now() - start;

      // Ease towards 92% on a timer, and only complete once the document is
      // ready — a bar that sits at 100% while the page is still blank is a lie.
      const timeShare = Math.min(elapsed / PRELOADER.minDurationMs, 1);
      const ready = document.readyState === "complete";
      const target = ready ? 100 : 92 * timeShare;

      progress.set(Math.max(progress.get(), target));

      if (progress.get() >= 100 && elapsed >= PRELOADER.minDurationMs) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    dismissTimer = window.setTimeout(finish, PRELOADER.maxDurationMs);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(dismissTimer);
    };
  }, [progress, reduceMotion]);

  return (
    <>
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: "[data-preloader]{display:none!important}",
          }}
        />
      </noscript>

      <AnimatePresence>
        {visible ? (
          <motion.div
            data-preloader
            aria-hidden="true"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              // A short upward drift on exit hands the eye off to the hero
              // rather than simply cutting to it.
              y: "-2%",
              transition: {
                duration: PRELOADER.exitDurationMs / 1000,
                ease: ease.outExpo,
              },
            }}
            className={cn(
              "fixed inset-0 z-[var(--z-loader)]",
              "flex flex-col items-center justify-center gap-8",
              "bg-background",
            )}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: ease.outExpo }}
            >
              <LogoMark className="size-12 animate-glow" />
            </motion.div>

            <div className="flex w-40 flex-col gap-3">
              <div className="h-px w-full overflow-hidden bg-border">
                <motion.div
                  style={{ scaleX: barScale, transformOrigin: "left" }}
                  className="h-full w-full bg-linear-to-r from-primary to-accent"
                />
              </div>

              <div className="flex items-baseline justify-between font-mono text-2xs tracking-widest text-subtle uppercase">
                <span>{siteConfig.shortName}</span>
                <span>{percent}%</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
