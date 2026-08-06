"use client";

import { Reveal } from "@/components/animation/reveal";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { NavLink } from "@/components/layout/nav-link";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { cn } from "@/lib/utils";
import { externalLinkAttributes } from "@/utils/url";

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  // Evaluated at render. On a statically generated page that is build time,
  // which is correct for a copyright line and avoids a client-only re-render.
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative mt-auto border-t border-border",
        // Sits above the fixed background stack.
        "bg-background/40 backdrop-blur-sm",
        className,
      )}
    >
      <Container size="page" className="py-16 lg:py-20">
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

        <Divider fade className="my-12" />

        <div className="flex flex-col-reverse gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs text-subtle">
            © {year} {siteConfig.name}. All rights reserved.
          </p>

          <ul className="flex items-center gap-1">
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
                      "inline-flex items-center justify-center rounded-full",
                      // 44px on touch: ten of these sit shoulder to shoulder, so an
                      // undersized target here means hitting the wrong network.
                      "size-11 md:size-9",
                      "text-muted transition-colors duration-[var(--duration-fast)]",
                      "hover:bg-highlight hover:text-foreground focus-ring",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
