"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ease } from "@/animations/easings";
import { Button } from "@/components/ui/button";
import { DURATION } from "@/config/animations";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

/**
 * Registers the service worker, and offers a reload when a new build is waiting.
 *
 * Registration is deferred until after `load`. A service worker registration during page load
 * competes with the requests that actually render the page, and the offline benefit does not
 * arrive until the second visit anyway — so there is nothing to gain by racing.
 *
 * Only in production. A cached shell against a hot-reloading dev server is the single most
 * confusing thing to debug, which is why `env.pwaEnabled` is off in development.
 *
 * The update prompt exists because `skipWaiting` fires in the worker, and a worker that takes
 * over without telling anyone swaps the app's assets underneath a page that is still running.
 * Asking is both safer and more honest — and the prompt is dismissible, so it is never a
 * blocker.
 */
export function ServiceWorker() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!env.pwaEnabled) return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        if (cancelled) return;

        // A worker already waiting means a new build landed while the tab was closed.
        if (registration.waiting) setWaiting(registration.waiting);

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            // `installed` with an existing controller means an update, not a first
            // install — only then is there something to prompt about.
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              setWaiting(installing);
            }
          });
        });
      } catch {
        // Registration failure is non-fatal by design: the site works identically
        // without a service worker, it simply has no offline fallback.
      }
    };

    const onLoad = () => void register();

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    if (!waiting) return;

    // The reload is driven by `controllerchange` rather than fired immediately, so the
    // page only reloads once the new worker is genuinely in control.
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => window.location.reload(),
      { once: true },
    );

    waiting.postMessage("SKIP_WAITING");
  }, [waiting]);

  const visible = waiting !== null && !dismissed;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: DURATION.normal, ease: ease.outExpo }}
          className={cn(
            "fixed inset-x-4 bottom-4 z-[var(--z-toast)] mx-auto w-fit max-w-md",
            "flex items-center gap-4 rounded-2xl border border-border",
            "bg-elevated/95 px-4 py-3 shadow-2xl backdrop-blur-xl",
          )}
        >
          <RefreshCw aria-hidden="true" className="size-4 shrink-0 text-primary" />

          <p className="text-sm text-foreground">
            A new version is ready.
            <span className="ml-1 text-muted">Reload to pick it up.</span>
          </p>

          <div className="flex shrink-0 items-center gap-1">
            <Button size="sm" onClick={applyUpdate}>
              Reload
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
              Later
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
