"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Tooltip.
 *
 * Built on Radix so the hard parts are correct without re-deriving them:
 * hover intent delays, pointer-vs-keyboard behaviour, collision-aware
 * positioning, and `aria-describedby` wiring.
 *
 * A tooltip is supplementary. It must never carry the only copy of information —
 * touch users and keyboard users on some platforms will never see it.
 */

export const TooltipProvider = TooltipPrimitive.Provider;

export interface TooltipProps
  extends Pick<ComponentProps<typeof TooltipPrimitive.Root>, "open" | "onOpenChange" | "delayDuration"> {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipPrimitive.TooltipContentProps["side"];
  align?: TooltipPrimitive.TooltipContentProps["align"];
  sideOffset?: number;
  /** Renders the small pointer triangle. */
  showArrow?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  showArrow = true,
  className,
  ...rootProps
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root {...rootProps}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-[var(--z-popover)] max-w-64 rounded-lg border border-border",
            "bg-elevated px-2.5 py-1.5 text-xs text-foreground shadow-xl",
            // Radix publishes the collision-corrected origin, so the scale
            // animation grows out of the side the tooltip actually landed on.
            "origin-(--radix-tooltip-content-transform-origin)",
            "data-[state=delayed-open]:animate-scale-in",
            "data-[state=instant-open]:animate-scale-in",
            className,
          )}
        >
          {content}
          {showArrow ? (
            <TooltipPrimitive.Arrow
              width={11}
              height={5}
              className="fill-elevated"
            />
          ) : null}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
