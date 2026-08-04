import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@/styles/globals.css";

import { Analytics } from "@/components/common/analytics";
import { StructuredData } from "@/components/common/structured-data";
import { SiteShell } from "@/components/layout/site-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/config/site";
import { themeColors } from "@/config/theme";
import { fontVariables } from "@/lib/fonts";
import { buildRootMetadata } from "@/lib/metadata";
import { rootSchemaGraph } from "@/lib/structured-data";

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never disable zoom. Capping at 5 keeps pinch-zoom available while stopping
  // iOS from zooming on focused inputs.
  maximumScale: 5,
  colorScheme: "dark light",
  themeColor: [...themeColors],
};

/**
 * Root layout.
 *
 * Deliberately thin, and a Server Component. It owns four things and nothing
 * else: the document element, the font custom properties, the metadata, and the
 * single client boundary. Every piece of interactive chrome lives inside
 * `SiteShell`, which keeps this file readable and keeps the server/client seam in
 * one obvious place.
 *
 * `suppressHydrationWarning` on `<html>` is required, not defensive:
 * `next-themes` writes the theme class before React hydrates, so the server
 * markup and the client DOM legitimately differ on that one attribute.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // No `scroll-smooth`: Lenis owns scrolling, and native smooth behaviour
    // would fight its interpolation.
    <html
      lang={siteConfig.language}
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <StructuredData data={rootSchemaGraph()} />

        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>

        <Analytics />
      </body>
    </html>
  );
}
