"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ease } from "@/animations/easings";
import { LogoMark } from "@/components/icons/logo-mark";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { DURATION } from "@/config/animations";
import { siteConfig } from "@/config/site";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * `beforeinstallprompt`, which is not in the DOM lib because it is Chromium-only.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[];
  prompt: () => Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Add-to-home-screen prompt.
 *
 * The browser fires `beforeinstallprompt` only when the site is genuinely installable — served
 * over HTTPS, with a valid manifest and a registered service worker. There is no way to force
 * it, and no reason to try: an install prompt on a site that cannot be installed is a dead
 * button.
 *
 * Three rules, all of them about not being annoying:
 *
 * • **Deferred, not immediate.** The event is captured and held; the card appears after a delay
 *   so it never competes with the hero on first paint.
 * • **Dismissal is remembered permanently.** `localStorage`, not session — someone who said no
 *   should not be asked again on their next visit. This is the one preference on the site that
 *   genuinely belongs in long-term storage.
 * • **It disappears once installed.** `appinstalled` clears it, and a display-mode check means it
 *   never renders inside the installed app.
 *
 * Safari does not implement the event at all, so iOS users see nothing rather than instructions
 * they did not ask for.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed: standalone display mode is the reliable signal across engines.
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    try {
      if (localStorage.getItem(STORAGE_KEYS.installPromptDismissed) === "1") return;
    } catch {
      // Storage blocked. Fall through and behave as a first visit.
    }

    let timer = 0;

    const onBeforeInstall = (event: Event) => {
      // Suppressing the browser's own mini-infobar is the point of capturing this —
      // it lets the prompt appear in the site's own design language, at a better moment.
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      timer = window.setTimeout(() => setVisible(true), 12_000);
    };

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
      trackEvent("install_prompt_accepted", { source: "browser" });
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const remember = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.installPromptDismissed, "1");
    } catch {
      // Non-fatal; the prompt simply may reappear on a future visit.
    }
  }, []);

  const onInstall = useCallback(async () => {
    if (!deferred) return;

    setVisible(false);
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;

    // A dismissal at the browser's own prompt counts as a no. Asking again after that
    // would be asking twice.
    if (outcome === "accepted") {
      trackEvent("install_prompt_accepted", { source: "custom" });
    }
    remember();
    setDeferred(null);
  }, [deferred, remember]);

  const onDismiss = useCallback(() => {
    setVisible(false);
    remember();
  }, [remember]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: DURATION.slow, ease: ease.outBack }}
          className={cn(
            "fixed bottom-6 left-6 z-[var(--z-toast)] w-[min(20rem,calc(100vw-3rem))]",
            "flex flex-col gap-4 rounded-2xl border border-border",
            "bg-elevated/95 p-5 shadow-2xl backdrop-blur-xl surface-sheen",
          )}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl",
                "border border-border bg-card",
              )}
            >
              <LogoMark className="size-5" />
            </span>

            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-sm font-semibold tracking-tight text-foreground">
                Install {siteConfig.shortName}
              </p>
              <p className="text-xs leading-relaxed text-muted">
                Adds it to your home screen and keeps the pages you have read available
                offline.
              </p>
            </div>

            <IconButton
              label="Dismiss install prompt"
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="-mt-1 -mr-1 shrink-0"
            >
              <X />
            </IconButton>
          </div>

          <Button size="sm" onClick={() => void onInstall()} fullWidth>
            <Download aria-hidden="true" className="size-3.5" />
            Install
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
