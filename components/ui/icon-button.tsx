import { forwardRef } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ButtonProps, "size" | "fullWidth"> {
  /**
   * Required. An icon-only control has no accessible name from its content, so
   * the type system enforces one here rather than trusting a review to catch it.
   */
  label: string;
  size?: "sm" | "md";
}

/**
 * Square, icon-only button.
 *
 * Thin wrapper over `Button` so the two can never diverge on focus ring, press
 * feedback or variant colours.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, size = "md", className, children, ...props }, ref) {
    return (
      <Button
        ref={ref}
        size={size === "sm" ? "icon-sm" : "icon"}
        aria-label={label}
        title={label}
        className={cn("[&_svg]:size-[1.125rem]", className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
