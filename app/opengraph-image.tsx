import { ImageResponse } from "next/og";

import { OG_IMAGE_SIZE, seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { palette } from "@/config/theme";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = seoConfig.openGraph.imageAlt;

/**
 * Social share card.
 *
 * Generated per deployment rather than exported from a design tool, so the copy
 * can never fall out of step with `config/site.ts`.
 *
 * Satori has no access to CSS custom properties, which is why `config/theme.ts`
 * mirrors the palette as plain JavaScript — this route is the main reason that
 * mirror exists.
 *
 * No custom font is loaded on purpose: fetching two woff2 files at build time to
 * change the letterforms on an image most people see at 500px wide is not a good
 * trade.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          background: palette.dark.background,
          // Two offset radial washes stand in for the site's aurora.
          backgroundImage: `radial-gradient(circle at 12% 0%, ${palette.dark.primary}38, transparent 45%), radial-gradient(circle at 88% 100%, ${palette.dark.secondary}30, transparent 45%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              transform: "rotate(45deg)",
              backgroundImage: `linear-gradient(135deg, ${palette.dark.primary}, ${palette.dark.accent})`,
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: palette.dark.muted,
            }}
          >
            {siteConfig.role}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: palette.dark.foreground,
              // Satori needs an explicit wrap width; 900px keeps it to two lines.
              maxWidth: 900,
            }}
          >
            {siteConfig.tagline}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontSize: 30,
              color: palette.dark.muted,
            }}
          >
            <span style={{ color: palette.dark.foreground }}>
              {siteConfig.name}
            </span>
            <span style={{ color: palette.dark.border }}>|</span>
            <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
