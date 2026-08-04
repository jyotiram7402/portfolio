"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { transition } from "@/animations/transitions";
import { Magnetic } from "@/components/animation/magnetic";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";
import { SearchTrigger } from "@/components/layout/search-trigger";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { navigationConfig } from "@/config/navigation";
import { NAV_SECTIONS } from "@/constants/sections";
import { useActiveSection } from "@/hooks/use-active-section";
import { useIsDesktop } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { isProtocolLink } from "@/utils/url";

export interface NavbarProps {
  className?: string;
}

/**
 * Sticky, scroll-aware header.
 *
 * Behaviour:
 *   • At the top it is fully transparent with no border — the hero should meet
 *     the viewport edge, not a chrome bar.
 *   • Once scrolled it condenses: blurred glass, a hairline bottom border, and
 *     slightly tighter height.
 *   • Scrolling down hides it, scrolling up brings it back. Reading gets the
 *     whole viewport; navigating gets the header back immediately.
 *
 * It never auto-hides when reduced motion is requested, or on touch, where a
 * moving header interacts badly with browser chrome that is also collapsing.
 *
 * The scroll state comes from `useScroll`, which only re-renders on discrete
 * changes — so this component renders a handful of times per page, not per pixel.
 */
export function Navbar({ className }: NavbarProps) {
  const { direction, isScrolled, isAtTop } = useScroll({ threshold: 16 });
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const cta = navigationConfig.navCta;

  // One observer for the whole nav, created here and passed down. Per-link
  // observers would multiply the work and disagree with each other.
  const activeSection = useActiveSection(NAV_SECTIONS);

  const shouldHide =
    !reduceMotion && isDesktop && isScrolled && direction === "down";

  return (
    <motion.header
      initial={false}
      animate={{ y: shouldHide ? "-105%" : "0%" }}
      transition={reduceMotion ? { duration: 0 } : transition.base}
      data-scrolled={isScrolled || undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-header)]",
        "transition-[background-color,border-color,backdrop-filter,height]",
        "duration-[var(--duration-normal)] ease-[var(--ease-out-quint)]",
        isAtTop
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-background/70 backdrop-blur-xl",
        className,
      )}
    >
      <Container
        size="page"
        className={cn(
          "flex items-center justify-between gap-6",
          "transition-[height] duration-[var(--duration-normal)] ease-[var(--ease-out-quint)]",
          isScrolled ? "h-16" : "h-[var(--header-height)]",
        )}
      >
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navigationConfig.mainNav
              .filter((item) => !item.disabled)
              .map((item) => (
                <li key={item.href}>
                  <NavLink item={item} activeSectionId={activeSection} />
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <SearchTrigger />
          <ThemeToggle />

          <div className="hidden lg:block">
            <Magnetic strength={0.2} maxDistance={8}>
              <Button asChild size="sm" variant="secondary">
                {/* `mailto:` cannot go through `next/link`, which expects a
                    route. The config decides which form the CTA takes. */}
                {isProtocolLink(cta.href) ? (
                  <a href={cta.href}>{cta.label}</a>
                ) : (
                  <Link href={cta.href}>{cta.label}</Link>
                )}
              </Button>
            </Magnetic>
          </div>

          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
