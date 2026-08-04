import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";

export interface SkipLinkProps {
  className?: string;
}

/**
 * First focusable element on the page.
 *
 * Lets a keyboard user jump past the header instead of tabbing through the whole
 * navigation on every page. Visually hidden until focused, at which point it
 * becomes a normal, visible control — hiding it with `display: none` would take
 * it out of the tab order and defeat the purpose.
 *
 * The target id comes from config, so it cannot drift from the `<main>` element.
 */
export function SkipLink({ className }: SkipLinkProps) {
  return (
    <a
      href={`#${navigationConfig.mainContentId}`}
      className={cn(
        "sr-only-focusable",
        "focus-visible:top-4 focus-visible:left-4 focus-visible:z-[var(--z-toast)]",
        "focus-visible:rounded-full focus-visible:border focus-visible:border-border-strong",
        "focus-visible:bg-elevated focus-visible:px-4 focus-visible:py-2.5",
        "focus-visible:text-sm focus-visible:font-medium focus-visible:text-foreground",
        "focus-visible:shadow-xl",
        className,
      )}
    >
      Skip to main content
    </a>
  );
}
