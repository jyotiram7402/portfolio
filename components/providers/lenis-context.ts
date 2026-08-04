"use client";

import { createContext } from "react";
import type Lenis from "lenis";

/**
 * Holds the single Lenis instance.
 *
 * Extracted from the provider into its own module so `useLenis` can import the
 * context without importing the provider component — which would create a cycle
 * and pull the Lenis runtime into every consumer's chunk.
 *
 * `null` is a valid, expected value: Lenis is not instantiated on touch devices
 * or under reduced motion.
 */
export const LenisContext = createContext<Lenis | null>(null);
