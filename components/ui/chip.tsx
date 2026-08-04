import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

const chipVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border px-3",
    "text-sm font-medium whitespace-nowrap",
    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-quint)]",
    "focus-ring press",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:size-3.5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      selected: {
        true: "border-primary/40 bg-primary/15 text-foreground",
        false: "border-border bg-elevated text-muted hover:border-border-strong hover:text-foreground",
      },
      size: {
        sm: "h-7 text-xs",
        md: "h-8",
      },
    },
    defaultVariants: { selected: false, size: "md" },
  },
);

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value">,
    VariantProps<typeof chipVariants> {
  asChild?: boolean;
}

/**
 * Interactive pill — a filter, a tag toggle.
 *
 * Renders as a `button` so it is keyboard reachable, and mirrors its selected
 * state into `aria-pressed` so assistive tech hears the toggle rather than
 * inferring it from colour.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className, selected, size, asChild = false, children, ...props },
  ref,
) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      ref={ref}
      {...(asChild ? {} : { type: "button" as const })}
      aria-pressed={selected ?? false}
      data-selected={selected || undefined}
      className={cn(chipVariants({ selected, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
});

export { chipVariants };
