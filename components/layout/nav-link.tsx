"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useCallback } from "react";

import { Tooltip } from "@/components/ui/tooltip";
import { ROUTES, isActiveRoute } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";
import { scrollToElement } from "@/utils/scroll";
import { externalLinkAttributes } from "@/utils/url";

export interface NavLinkProps {
  item: NavItem;
  /** Larger type and spacing, for the mobile drawer. */
  size?: "sm" | "lg";
  /**
   * The section currently in view, from `useActiveSection`. Only supplied where
   * scroll-spy highlighting is wanted — the navbar passes it, the footer does not.
   */
  activeSectionId?: string | null;
  /** Called after a successful navigation, so the drawer can close itself. */
  onNavigate?: () => void;
  className?: string;
}

const SOON_MESSAGE = "Shipping in an upcoming sprint";

/**
 * One navigation entry.
 *
 * Handles four states:
 *
 * • **Section link** — a real `<a href="/#about">`, so it deep-links and works
 *   without JavaScript. When the reader is already on the home page the click is
 *   intercepted and handed to Lenis, which scrolls with the site's easing and
 *   applies the sticky-header offset. The hash is written with `replaceState` so
 *   the back button is not filled with anchor entries.
 * • **Active** — `aria-current`, so the state reaches assistive tech instead of
 *   being conveyed by colour alone.
 * • **Soon** — a disabled `<span>`, not a link, with a tooltip explaining why.
 * • **External** — `rel="noopener noreferrer"` plus an announced hint.
 *
 * The underline is a scaled pseudo-element rather than `text-decoration`, so it
 * animates from the left edge without shifting the text baseline.
 */
export function NavLink({
  item,
  size = "sm",
  activeSectionId,
  onNavigate,
  className,
}: NavLinkProps) {
  const pathname = usePathname();

  const isSectionLink = item.sectionId !== undefined;
  const isActive = item.soon
    ? false
    : isSectionLink
      ? activeSectionId === item.sectionId
      : isActiveRoute(pathname, item.href);

  const handleSectionClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onNavigate?.();

      // Let the browser handle modified clicks (new tab, download, middle-click)
      // and any click from another route — the anchor navigation is correct there.
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0 ||
        pathname !== ROUTES.home ||
        !item.sectionId
      ) {
        return;
      }

      event.preventDefault();
      scrollToElement(item.sectionId);
      window.history.replaceState(null, "", `#${item.sectionId}`);
    },
    [item.sectionId, onNavigate, pathname],
  );

  const baseClass = cn(
    "relative inline-flex items-center gap-2 rounded-full",
    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quint)]",
    "focus-ring",
    size === "lg" ? "py-2 text-2xl font-medium tracking-tight" : "text-sm",
    className,
  );

  if (item.soon) {
    return (
      <Tooltip content={SOON_MESSAGE}>
        <span
          aria-disabled="true"
          className={cn(baseClass, "cursor-not-allowed text-subtle")}
        >
          {item.label}
          <span aria-hidden="true" className="size-1 rounded-full bg-warning/70" />
          <span className="sr-only">({SOON_MESSAGE})</span>
        </span>
      </Tooltip>
    );
  }

  const external = item.external ?? false;

  return (
    <Link
      href={item.href}
      onClick={isSectionLink ? handleSectionClick : onNavigate}
      aria-current={isActive ? (isSectionLink ? "true" : "page") : undefined}
      {...(external ? externalLinkAttributes() : {})}
      className={cn(
        baseClass,
        "group/nav",
        isActive ? "text-foreground" : "text-muted hover:text-foreground",
      )}
    >
      {item.label}

      {size === "sm" ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-foreground",
            "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-quint)]",
            isActive ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100",
          )}
        />
      ) : null}

      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </Link>
  );
}
