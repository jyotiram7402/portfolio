"use client";

import { useEffect, useState } from "react";

/**
 * False during SSR and the first client render, true afterwards.
 *
 * The guard for anything that cannot be rendered identically on both sides —
 * resolved theme, `window` dimensions, portals — so those reads happen after
 * hydration instead of causing a mismatch.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
