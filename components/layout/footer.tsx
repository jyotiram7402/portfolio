"use client";

import { Reveal } from "@/components/animation/reveal";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { NavLink } from "@/components/layout/nav-link";
import { Badge } from "@/components/ui/badge";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { cn } from "@/lib/utils";
import { externalLinkAttributes } from "@/utils/url";

export interface FooterProps {
  className?: string;
}

/**
 * Site footer.
 *
 * Two bands. The top one is the useful part — identity, navigation, social links. The
 * bottom one is the oversized wordmark, which is decoration and is marked as such.
 *
 * **Always dark, in both themes.** This is the one deliberate inversion on the site: the
 * footer marks the end of the document, and the wordmark treatment only reads against a
 * dark field. It is done with the `dark-surface` class from `styles/themes.css`, which
 * redeclares the semantic tokens for this subtree. That matters more than it looks:
 * `Logo`, `NavLink` and `Badge` are shared components that reference `--foreground` and
 * `--muted`, so they retint automatically. Hardcoding white text here instead would have
 * left all three unreadable in the light theme.
 */
export function Footer({ className }: FooterProps) {
  // Evaluated at render. On a statically generated page that is build time,
  // which is correct for a copyright line and avoids a client-only re-render.
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "dark-surface relative mt-auto overflow-hidden",
        "border-t border-border bg-background text-foreground",
        className,
      )}
    >
      <Container size="page" className="relative z-10 pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-8">
          <Reveal effect="up" distance={16} className="flex flex-col gap-5">
            <Logo />

            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {siteConfig.tagline}
            </p>

            {siteConfig.availability.open ? (
              <Badge tone="success" dot pulse className="w-fit">
                {siteConfig.availability.label}
              </Badge>
            ) : null}
          </Reveal>

          {navigationConfig.footerNav.map((column, index) => (
            <Reveal
              key={column.id}
              effect="up"
              distance={16}
              delay={0.06 * (index + 1)}
              as="div"
              className="flex flex-col gap-4"
            >
              <h2 className="eyebrow">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.items.map((item) => (
                  <li key={`${column.id}-${item.href}`}>
                    <NavLink item={item} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div
          className={cn(
            "mt-14 flex flex-col-reverse gap-6 border-t border-border pt-8",
            "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <p className="text-xs text-subtle">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <ul className="flex items-center gap-2">
            {socialConfig.links.map((link) => {
              const Icon = link.icon;
              const isMail = link.href.startsWith("mailto:");

              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    {...(isMail ? {} : externalLinkAttributes())}
                    aria-label={link.label}
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl",
                      // 44px on touch: these sit shoulder to shoulder, so an undersized
                      // target here means opening the wrong network.
                      "size-11 md:size-10",
                      "border border-border bg-glass text-muted",
                      "transition-colors duration-[var(--duration-fast)]",
                      "hover:border-border-strong hover:text-foreground focus-ring",
                    )}
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <WordmarkBleed />
    </footer>
  );
}

/**
 * The oversized wordmark along the bottom edge.
 *
 * Sized with `clamp()` against viewport width rather than at a fixed size, so it spans
 * roughly the same fraction of the page on a phone and on an ultrawide instead of
 * wrapping on one and looking stranded on the other. `whitespace-nowrap` guarantees it
 * never breaks — a wordmark on two lines is not a wordmark.
 *
 * The fill is a top-to-bottom gradient clipped to the glyphs. That is what keeps it from
 * reading as a heading someone forgot to style: it fades toward the page edge rather
 * than sitting on it as flat grey.
 *
 * The negative bottom margin is in `em`, and it is on the `<p>` rather than the wrapper
 * for a reason — `em` resolves against the element's *own* font size, so on the wrapper
 * it would compute against 16px and move the mark by two pixels. Here it crops the
 * descender space off the baseline, which is what sits the capitals flush to the edge.
 *
 * `aria-hidden` and `select-none`: a screen reader already read this name from the logo
 * above, and dragging across the page should not put a stray "JYOTIRAM" in the clipboard.
 */
function WordmarkBleed() {
  return (
    <div aria-hidden="true" className="relative w-full overflow-hidden select-none">
      <p
        className={cn(
          "bg-clip-text text-center font-semibold whitespace-nowrap text-transparent",
          "bg-linear-to-b from-foreground/12 to-foreground/[0.02]",
          "text-[clamp(3.5rem,16vw,15rem)] leading-none tracking-[-0.04em]",
          "mb-[-0.13em]",
        )}
      >
        {siteConfig.wordmark}
      </p>
    </div>
  );
}
