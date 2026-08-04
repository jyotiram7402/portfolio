import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

import { Spinner } from "@/components/icons/spinner";
import { cn } from "@/lib/utils";

/**
 * The button.
 *
 * A Server Component: it has no state and no handlers of its own, so it must
 * not cost the client bundle anything. Interactive callers are already Client
 * Components and can pass `onClick` through.
 *
 * `asChild` renders the styles onto a child element — the pattern that lets a
 * `next/link` be a button without nesting an `<a>` inside a `<button>`, which
 * would be invalid HTML and unusable by keyboard.
 */
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-2",
    "rounded-full font-medium whitespace-nowrap",
    "transition-[background-color,border-color,color,box-shadow,opacity] duration-[var(--duration-fast)] ease-[var(--ease-out-quint)]",
    "focus-ring press",
    // `pointer-events-none` on top of `disabled` also covers `aria-disabled`
    // links, which cannot be natively disabled.
    "disabled:pointer-events-none disabled:opacity-45",
    "aria-disabled:pointer-events-none aria-disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary-hover",
          "shadow-md surface-sheen",
        ],
        secondary: [
          "border border-border bg-elevated text-foreground",
          "hover:border-border-strong hover:bg-card",
          "surface-sheen",
        ],
        outline: [
          "border border-border-strong bg-transparent text-foreground",
          "hover:bg-highlight",
        ],
        ghost: "text-muted hover:bg-highlight hover:text-foreground",
        glass: "glass text-foreground hover:bg-glass-strong",
        danger: [
          "bg-danger text-danger-foreground",
          "hover:brightness-110",
          "shadow-md",
        ],
        link: [
          "h-auto rounded-none p-0 text-foreground underline-offset-4",
          "hover:underline",
        ],
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Shows a spinner and blocks interaction. */
  loading?: boolean;
  /** Announced while `loading` is true. */
  loadingLabel?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingLabel = "Loading",
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        // `asChild` forwards to an arbitrary element, which may not accept `type`.
        {...(asChild ? {} : { type })}
        disabled={asChild ? undefined : (disabled ?? loading)}
        aria-disabled={asChild && (disabled || loading) ? true : undefined}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {/* Slot clones a single child, so the spinner is only ever added when
            this renders its own element. */}
        {loading && !asChild ? (
          <Spinner label={loadingLabel} className="size-4" />
        ) : null}
        {children}
      </Component>
    );
  },
);

export { buttonVariants };
