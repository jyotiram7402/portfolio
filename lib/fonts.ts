import { GeistSans } from "geist/font/sans";
import { Inter, JetBrains_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

/**
 * Typefaces.
 *
 * All three are self-hosted and subset by `next/font`, so there is no
 * render-blocking request to a third-party origin and no layout shift: Next
 * emits a size-adjusted local fallback for each family.
 *
 * Roles:
 *   Geist          — display and UI. Tight, geometric, engineered.
 *   Inter          — long-form body copy, where Geist's tighter apertures tire.
 *   JetBrains Mono — code, metadata, eyebrows, anything that should read as data.
 */

export const fontSans = GeistSans;

export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Only the weights the type scale actually uses.
  weight: ["400", "500", "600"],
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

/** Applied once, on `<html>`, so every `--font-*` token resolves everywhere. */
export const fontVariables = cn(
  fontSans.variable,
  fontBody.variable,
  fontMono.variable,
);
