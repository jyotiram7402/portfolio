"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, CircleDashed, Loader } from "lucide-react";
import { useId, useState } from "react";

import { ease } from "@/animations/easings";
import { DURATION } from "@/config/animations";
import { ROADMAP_STATUS_META } from "@/data/roadmap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { RoadmapNode as Node, RoadmapStatus } from "@/types/explore";

export interface RoadmapNodeProps {
  node: Node;
  /** Open by default. Used for the first `learning` node, which is the interesting one. */
  defaultOpen?: boolean;
}

const STATUS_STYLE: Record<
  RoadmapStatus,
  { ring: string; text: string; icon: typeof Check }
> = {
  completed: {
    ring: "border-success/40 bg-success/12",
    text: "text-success",
    icon: Check,
  },
  learning: {
    ring: "border-primary/45 bg-primary/12",
    text: "text-primary",
    icon: Loader,
  },
  planned: {
    ring: "border-border bg-elevated",
    text: "text-subtle",
    icon: CircleDashed,
  },
};

/**
 * One expandable roadmap node.
 *
 * A native disclosure pattern rather than a custom one: a `<button>` with `aria-expanded`
 * and `aria-controls` pointing at the panel. That is all a screen reader needs, and it is
 * what makes the whole roadmap navigable by keyboard without any extra handling.
 *
 * The panel animates `height: auto`, which Framer Motion measures for us. This is one of
 * the few places a layout-affecting animation is worth it — the content genuinely changes
 * size, and a fade alone would make the expansion feel like a jump. Under reduced motion
 * it opens instantly.
 *
 * `status` drives the icon, the ring colour *and* an explicit text label, so the state is
 * never carried by colour alone.
 */
export function RoadmapNode({ node, defaultOpen = false }: RoadmapNodeProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  const style = STATUS_STYLE[node.status];
  const meta = ROADMAP_STATUS_META[node.status];
  const StatusIcon = style.icon;
  const NodeIcon = node.icon;

  return (
    <li
      className={cn(
        "overflow-hidden rounded-2xl border bg-card/60 transition-colors",
        "duration-[var(--duration-normal)]",
        open ? "border-border-strong" : "border-border hover:border-border-strong",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3.5 p-4 text-left focus-ring"
      >
        <span
          aria-hidden="true"
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl border",
            style.ring,
            style.text,
            "[&_svg]:size-4",
          )}
        >
          <NodeIcon />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              {node.label}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
                "font-mono text-2xs tracking-wider uppercase",
                style.ring,
                style.text,
              )}
            >
              <StatusIcon
                aria-hidden="true"
                className={cn(
                  "size-2.5",
                  node.status === "learning" && !reduceMotion && "animate-spin-slow",
                )}
              />
              {meta.label}
            </span>
          </span>

          <span className="text-xs leading-relaxed text-muted">{node.detail}</span>
        </span>

        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-subtle transition-transform",
            "duration-[var(--duration-normal)] ease-[var(--ease-out-quint)]",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0.01 : DURATION.slow,
              ease: ease.outQuart,
            }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 border-t border-border px-4 py-4">
              <div className="flex flex-col gap-2.5">
                <p className="font-mono text-2xs tracking-widest text-subtle uppercase">
                  What done looks like
                </p>
                <ul className="flex flex-col gap-2">
                  {node.milestones.map((milestone) => (
                    <li
                      key={milestone}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1.5 size-1 shrink-0 rounded-full",
                          node.status === "completed" ? "bg-success/70" : "bg-border-strong",
                        )}
                      />
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>

              {node.stack && node.stack.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {node.stack.map((technology) => (
                    <li key={technology}>
                      <span
                        className={cn(
                          "inline-flex h-6 items-center rounded-full border border-border",
                          "bg-input px-2.5 font-mono text-2xs text-muted",
                        )}
                      >
                        {technology}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
