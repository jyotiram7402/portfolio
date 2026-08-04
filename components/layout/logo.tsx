import Link from "next/link";

import { LogoMark } from "@/components/icons/logo-mark";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /** Hides the wordmark, leaving only the glyph. */
  markOnly?: boolean;
  className?: string;
}

/**
 * Home link and brand lockup.
 *
 * The accessible name is the full name plus "home", because "JK" alone tells a
 * screen-reader user nothing about where the link goes. The visible wordmark is
 * `aria-hidden` to avoid announcing it twice.
 */
export function Logo({ markOnly = false, className }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      aria-label={`${siteConfig.name} — home`}
      className={cn(
        "group/logo inline-flex items-center gap-2.5 rounded-full",
        "focus-ring transition-opacity duration-[var(--duration-fast)]",
        "hover:opacity-85",
        className,
      )}
    >
      <LogoMark className="size-7 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-back)] group-hover/logo:rotate-90" />

      {markOnly ? null : (
        <span
          aria-hidden="true"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          {siteConfig.name}
        </span>
      )}
    </Link>
  );
}
