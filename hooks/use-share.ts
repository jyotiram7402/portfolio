"use client";

import { useCallback, useEffect, useState } from "react";

import { copyToClipboard } from "@/utils/dom";

export type ShareState = "idle" | "copied" | "shared" | "error";

export interface ShareTarget {
  title: string;
  text?: string;
  url: string;
}

export interface UseShareResult {
  /** True when the OS share sheet is available. */
  canShare: boolean;
  state: ShareState;
  share: (target: ShareTarget) => Promise<void>;
  copy: (url: string) => Promise<void>;
}

/**
 * Web Share API with a clipboard fallback.
 *
 * `navigator.share` is checked at mount rather than at call time, because the result is
 * needed to decide which control to render — a share button that turns out to be a copy
 * button is worse than a copy button.
 *
 * A cancelled share sheet rejects with `AbortError`. That is the user declining, not a
 * failure, so it resets to idle rather than showing an error.
 */
export function useShare(resetAfterMs = 2000): UseShareResult {
  const [canShare, setCanShare] = useState(false);
  const [state, setState] = useState<ShareState>("idle");

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), resetAfterMs);
    return () => window.clearTimeout(timer);
  }, [resetAfterMs, state]);

  const copy = useCallback(async (url: string) => {
    const ok = await copyToClipboard(url);
    setState(ok ? "copied" : "error");
  }, []);

  const share = useCallback(
    async (target: ShareTarget) => {
      if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
        await copy(target.url);
        return;
      }

      try {
        await navigator.share(target);
        setState("shared");
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") {
          setState("idle");
          return;
        }
        await copy(target.url);
      }
    },
    [copy],
  );

  return { canShare, state, share, copy };
}
