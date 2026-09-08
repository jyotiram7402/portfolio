"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { startScroll, stopScroll } from "@/utils/scroll";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: DrawerSide;
  /** Hides the title visually while keeping it in the accessibility tree. */
  hideTitle?: boolean;
  /** Hides the built-in close button, for callers that supply their own. */
  hideClose?: boolean;
  className?: string;
}

const sideClass: Record<DrawerSide, string> = {
  left: "inset-y-0 left-0 h-full w-[min(22rem,88vw)] border-r",
  right: "inset-y-0 right-0 h-full w-[min(22rem,88vw)] border-l",
  top: "inset-x-0 top-0 w-full max-h-[85dvh] border-b",
  bottom: "inset-x-0 bottom-0 w-full max-h-[85dvh] border-t",
};

/**
 * Which keyframe pair the panel slides on. Passed as custom properties so one
 * `.drawer-panel` rule in `utilities.css` serves all four sides.
 */
const sideAnimation: Record<DrawerSide, CSSProperties> = {
  left: { "--drawer-in": "drawer-in-left", "--drawer-out": "drawer-out-left" },
  right: { "--drawer-in": "drawer-in-right", "--drawer-out": "drawer-out-right" },
  top: { "--drawer-in": "drawer-in-top", "--drawer-out": "drawer-out-top" },
  bottom: { "--drawer-in": "drawer-in-bottom", "--drawer-out": "drawer-out-bottom" },
} as Record<DrawerSide, CSSProperties>;

/**
 * Edge-anchored panel. The mobile navigation and the assistant drawer use it.
 *
 * **Motion is CSS, keyed on Radix's `data-state`** — see the note in
 * `styles/utilities.css`. It was Framer Motion inside `Dialog.Content asChild`
 * wrapped in `AnimatePresence`, and that combination did not work: the panel was
 * left at its `initial` transform, so on mobile the navigation opened entirely
 * off-screen and took focus with it. The resting state now has no transform, so
 * a panel cannot be positioned outside the viewport by a stalled animation.
 *
 * `forceMount` is gone with it. Radix's own `Presence` waits for the `closed`
 * animation to finish before unmounting, which is what `AnimatePresence` was
 * there to do.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  hideTitle = false,
  hideClose = false,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    stopScroll();
    return () => startScroll();
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "dialog-overlay fixed inset-0 z-[var(--z-overlay)]",
            "bg-overlay backdrop-blur-sm",
          )}
        />

        <Dialog.Content
          data-lenis-prevent
          style={sideAnimation[side]}
          className={cn(
            "drawer-panel fixed z-[var(--z-drawer)] flex flex-col",
            "border-border bg-surface/95 backdrop-blur-2xl",
            "shadow-2xl outline-none",
            sideClass[side],
            className,
          )}
        >
          <header className="flex items-start justify-between gap-4 px-6 pt-6">
            <div className="space-y-1.5">
              <Dialog.Title
                className={cn(
                  "text-base font-semibold tracking-tight text-foreground",
                  hideTitle && "sr-only",
                )}
              >
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="text-sm text-muted">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>

            {hideClose ? null : (
              <Dialog.Close asChild>
                <IconButton
                  label="Close panel"
                  variant="ghost"
                  size="sm"
                  className="-mt-1 -mr-1"
                >
                  <X />
                </IconButton>
              </Dialog.Close>
            )}
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
            {children}
          </div>

          {footer ? (
            <footer className="border-t border-border px-6 py-5">{footer}</footer>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;
