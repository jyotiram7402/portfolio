import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  items: readonly Crumb[];
  className?: string;
}

/**
 * Breadcrumb trail.
 *
 * A `<nav>` with an ordered list, which is what conveys "these are steps in a hierarchy"
 * rather than a row of links. The last item is the current page: it is not a link, and it
 * carries `aria-current="page"`.
 *
 * The separators are `aria-hidden` — a screen reader announcing "chevron right" between
 * every level is noise, and the list structure already conveys the nesting.
 *
 * Long final labels are truncated visually while the full text stays in the accessibility
 * tree, so an article title cannot wrap the trail onto three lines on a phone.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-3 shrink-0 text-subtle"
                />
              ) : null}

              {isLast ? (
                <span
                  aria-current="page"
                  className="max-w-[16rem] truncate text-muted sm:max-w-sm"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded text-subtle transition-colors",
                    "hover:text-foreground focus-ring",
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
