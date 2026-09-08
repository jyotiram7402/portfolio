"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { startScroll, stopScroll } from "@/utils/scroll";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Required: a dialog without an accessible name is unusable non-visually. */
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Hides the title visually while keeping it for assistive tech. */
  hideTitle?: boolean;
  className?: string;
}

const sizeClass = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

/**
 * Centred modal dialog.
 *
 * Radix supplies the accessibility contract — focus trap, focus restore, escape
 * to close, `aria-modal`, outside-click dismissal, background inerting.
 *
 * The transition is CSS keyframes keyed on Radix's `data-state`, defined in
 * `styles/utilities.css`. It was Framer Motion behind `forceMount` and
 * `AnimatePresence`, which left the panel stuck at its `initial` transform — see
 * the note in `animations/variants.ts`. Radix's own `Presence` already waits for a
 * running CSS animation before unmounting, so exit still animates.
 *
 * Radix locks native scrolling itself, but it knows nothing about Lenis, so the
 * virtual scroller is paused explicitly — otherwise the page keeps easing along
 * behind the overlay.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  hideTitle = false,
  className,
}: ModalProps) {
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

        {/* Centring lives on this wrapper so the panel keeps its own transform
            free for the entrance keyframes. `pointer-events-none` lets clicks
            fall through to the overlay, so Radix still reads them as outside the
            content and dismisses. */}
        <div className="pointer-events-none fixed inset-0 z-[var(--z-modal)] grid place-items-center p-4">
          <Dialog.Content
            // Lets Lenis ignore wheel events that belong to this panel.
            data-lenis-prevent
            className={cn(
              "dialog-panel pointer-events-auto w-full",
              "max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain",
              "rounded-3xl border border-border bg-card p-6 shadow-2xl",
              "surface-sheen",
              sizeClass[size],
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <Dialog.Title
                  className={cn(
                    "text-xl font-semibold tracking-tight text-foreground",
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

              <Dialog.Close asChild>
                <IconButton
                  label="Close dialog"
                  variant="ghost"
                  size="sm"
                  className="-mt-1 -mr-1"
                >
                  <X />
                </IconButton>
              </Dialog.Close>
            </div>

            <div className="mt-5">{children}</div>

            {footer ? (
              <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>
            ) : null}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;
