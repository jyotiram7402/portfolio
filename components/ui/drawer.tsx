"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

import { drawerVariants, overlayVariants } from "@/animations/variants";
import { IconButton } from "@/components/ui/icon-button";
import { useMotionVariants } from "@/hooks/use-motion-variants";
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
 * Edge-anchored panel. The mobile navigation and any future filter panel use it.
 *
 * Unlike `Modal`, the transform is entirely Framer Motion's — the panel is
 * positioned by `inset`, so there is no Tailwind translate to be overwritten.
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
  const overlay = useMotionVariants(overlayVariants);
  const panel = useMotionVariants(drawerVariants(side));

  useEffect(() => {
    if (!open) return;
    stopScroll();
    return () => startScroll();
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                variants={overlay}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-[var(--z-overlay)] bg-overlay backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.aside
                variants={panel}
                initial="hidden"
                animate="visible"
                exit="exit"
                data-lenis-prevent
                className={cn(
                  "fixed z-[var(--z-drawer)] flex flex-col",
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
                  <footer className="border-t border-border px-6 py-5">
                    {footer}
                  </footer>
                ) : null}
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;
