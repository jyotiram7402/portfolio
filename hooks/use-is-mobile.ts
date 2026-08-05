"use client";

import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Viewport-based mobile check (narrower than `lg`).
 *
 * Use this for layout decisions. For deciding whether an *interaction* should
 * exist — magnetic hover, tilt, the spotlight — use `useIsTouchDevice`, because
 * a narrow window on a desktop still has a mouse.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(MEDIA_QUERIES.mobile, false);
}

export function useIsTablet(): boolean {
  return useMediaQuery(MEDIA_QUERIES.tablet, false);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(MEDIA_QUERIES.desktop, true);
}

export function useIsUltrawide(): boolean {
  return useMediaQuery(MEDIA_QUERIES.ultrawide, false);
}

/** True only where a precise pointer exists. Defaults to false during SSR. */
export function useIsPointerFine(): boolean {
  return useMediaQuery(MEDIA_QUERIES.finePointer, false);
}

export function useIsTouchDevice(): boolean {
  return useMediaQuery(MEDIA_QUERIES.coarsePointer, false);
}

export function useCanHover(): boolean {
  return useMediaQuery(MEDIA_QUERIES.hoverCapable, false);
}
