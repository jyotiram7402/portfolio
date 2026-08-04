import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { palette } from "@/config/theme";
import { ROUTES } from "@/constants/routes";

/**
 * Web app manifest, served at `/manifest.webmanifest`.
 *
 * Next injects the `<link rel="manifest">` automatically, which is why `lib/metadata.ts` does not
 * declare one.
 *
 * Three things worth recording:
 *
 * **SVG icons with a maskable variant.** One vector file scales to every launcher size, and the
 * maskable version carries the safe-zone padding Android needs before it crops the icon into a
 * platform shape. There is no PNG set because there is nothing a raster would add here.
 *
 * **Shortcuts.** Long-pressing the installed icon jumps straight to the résumé, the recruiter
 * summary or contact — the three destinations someone who installed this actually came back for.
 *
 * **iOS splash screens are absent, deliberately.** Safari wants a separate
 * `apple-touch-startup-image` PNG per device resolution — around a dozen files. Until those are
 * generated, iOS falls back to `background_color`, which is the site's own near-black and is a
 * perfectly reasonable splash. Shipping a wrong-sized one would look worse than none.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.defaultTitle,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: palette.dark.background,
    theme_color: palette.dark.background,
    categories: ["portfolio", "technology", "developer"],
    lang: siteConfig.language,
    dir: "ltr",

    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],

    shortcuts: [
      {
        name: "Résumé",
        short_name: "Résumé",
        description: "Three versions of the same history, with an on-page preview",
        url: ROUTES.resume,
      },
      {
        name: "For recruiters",
        short_name: "Recruiters",
        description: "Availability, notice period and preferred roles on one page",
        url: ROUTES.recruiters,
      },
      {
        name: "Contact",
        short_name: "Contact",
        description: "Email, calendar and a project brief form",
        url: ROUTES.contact,
      },
    ],
  };
}
