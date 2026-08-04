"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Search, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

import { ease } from "@/animations/easings";
import { Magnetic } from "@/components/animation/magnetic";
import { Drawer } from "@/components/ui/drawer";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip } from "@/components/ui/tooltip";
import { DURATION } from "@/config/animations";
import { chatCopy } from "@/data/ai";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

/**
 * The chat panel is the heaviest client component on the page. It is only fetched when
 * the drawer is opened, so a visitor who never uses the assistant never downloads it.
 */
const ChatPanel = dynamic(
  () => import("@/features/ai-assistant").then((module) => module.ChatPanel),
  { ssr: false },
);

export interface FloatingActionsProps {
  className?: string;
}

/**
 * Persistent access to the assistant and to search.
 *
 * Two controls in a stack above the back-to-top button. The order matters: the assistant
 * is the primary action and sits closest to the thumb.
 *
 * Deliberate decisions:
 *
 * • **Hidden at the top of the page.** The hero has its own calls to action, and a
 *   floating button competing with them on first paint is noise. It appears once the
 *   visitor has committed to scrolling.
 * • **Drawer side follows the viewport** — right on desktop, bottom on mobile, which is
 *   where a sheet belongs on a phone.
 * • **The panel is `ephemeral`** here: the drawer is a quick question, not the session's
 *   transcript, so it opens clean while the embedded section keeps its history.
 * • **The shortcut hint is only shown on desktop**, since it is meaningless on a
 *   touch device.
 */
export function FloatingActions({ className }: FloatingActionsProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const { toggle: togglePalette } = useCommandPalette();
  const { isAtTop } = useScroll({ threshold: 320 });
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  // Closing on route change is not enough — the drawer traps focus, so anything that
  // navigates underneath it has to dismiss it.
  const closeChat = useCallback(() => setChatOpen(false), []);

  useEffect(() => {
    if (!chatOpen) return;
    window.addEventListener("popstate", closeChat);
    return () => window.removeEventListener("popstate", closeChat);
  }, [chatOpen, closeChat]);

  const visible = !isAtTop;

  return (
    <>
      <AnimatePresence>
        {visible ? (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: DURATION.normal, ease: ease.outBack }}
            className={cn(
              "fixed right-6 bottom-24 z-[var(--z-sticky)] flex flex-col items-end gap-3",
              "lg:right-10 lg:bottom-28",
              className,
            )}
          >
            <Tooltip
              side="left"
              content={
                <span className="flex items-center gap-2">
                  Search everything
                  <Kbd keys={["mod", "k"]} />
                </span>
              }
            >
              <button
                type="button"
                onClick={togglePalette}
                aria-label="Search everything"
                className={cn(
                  "grid size-11 place-items-center rounded-full",
                  "glass text-muted shadow-lg backdrop-blur-xl",
                  "transition-colors duration-[var(--duration-fast)]",
                  "hover:text-foreground focus-ring press",
                )}
              >
                <Search aria-hidden="true" className="size-4" />
              </button>
            </Tooltip>

            <Magnetic strength={0.2} maxDistance={8}>
              <Tooltip side="left" content={chatCopy.title}>
                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  aria-label={chatCopy.title}
                  aria-haspopup="dialog"
                  aria-expanded={chatOpen}
                  className={cn(
                    "group/fab relative grid size-14 place-items-center rounded-full",
                    "bg-primary text-primary-foreground shadow-xl surface-sheen",
                    "transition-colors duration-[var(--duration-fast)]",
                    "hover:bg-primary-hover focus-ring press",
                  )}
                >
                  {/* Soft halo. Decorative, so reduced motion removes it entirely. */}
                  <span
                    aria-hidden="true"
                    data-motion-decorative
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full bg-primary/40 blur-lg",
                      !reduceMotion && "animate-glow",
                    )}
                  />

                  <MessageSquare aria-hidden="true" className="size-5" />

                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -top-0.5 -right-0.5 grid size-4 place-items-center",
                      "rounded-full border-2 border-background bg-accent",
                    )}
                  >
                    <Sparkles className="size-2 text-accent-foreground" />
                  </span>
                </button>
              </Tooltip>
            </Magnetic>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Reuses Sprint 0's `Drawer` as the frame: it already provides the focus trap,
          escape handling, Lenis pause and the close button. The title is hidden
          visually because `ChatPanel` renders its own header, but it stays in the
          accessibility tree as the dialog's name. */}
      <Drawer
        open={chatOpen}
        onOpenChange={setChatOpen}
        side={isMobile ? "bottom" : "right"}
        title={chatCopy.title}
        hideTitle
        className={cn(
          isMobile
            ? "h-[88dvh] max-h-none rounded-t-3xl"
            : "w-[min(30rem,92vw)] max-w-none",
        )}
      >
        <ChatPanel fill ephemeral autoFocus className="border-0 bg-transparent" />
      </Drawer>
    </>
  );
}
