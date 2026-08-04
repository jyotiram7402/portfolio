"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CornerDownLeft,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { modalVariants, overlayVariants } from "@/animations/variants";
import { Kbd } from "@/components/ui/kbd";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { SECTIONS } from "@/constants/sections";
import { useMotionVariants } from "@/hooks/use-motion-variants";
import { useTheme } from "@/hooks/use-theme";
import { searchDocuments } from "@/lib/search-index";
import { cn } from "@/lib/utils";
import type { CommandItem, SearchResult } from "@/types/search";
import { highlightSegments } from "@/utils/fuzzy";
import { scrollToElement, startScroll, stopScroll } from "@/utils/scroll";

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

const KIND_LABEL: Readonly<Record<SearchResult["document"]["kind"], string>> = {
  page: "Page",
  section: "Jump to",
  project: "Project",
  post: "Article",
  skill: "Technology",
  experience: "Experience",
  achievement: "Achievement",
  resource: "Resource",
};

/**
 * The command palette.
 *
 * Built on Radix Dialog rather than on a palette library, for consistency: the focus
 * trap, escape handling and background inerting are the same implementation the modal
 * and drawer already use, and the fuzzy ranking is the same scorer the blog search and
 * the assistant's intent resolver use. One notion of "close enough" across the site.
 *
 * The keyboard model is the one this class of interface has trained people to expect:
 * type to filter, arrows to move, Enter to run, Escape to close. Focus stays in the
 * input the whole time and the list is driven by `aria-activedescendant`, which is the
 * combobox pattern — moving real focus into the list would take it out of the input and
 * break typing.
 *
 * Results are recomputed per keystroke over ~120 documents. That is a few thousand
 * character comparisons, well under a frame, so there is no index structure, no
 * debounce and no worker.
 */
export function CommandPalette({
  open,
  onOpenChange,
  initialQuery = "",
}: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);

  const overlay = useMotionVariants(overlayVariants);
  const panel = useMotionVariants(modalVariants);

  /* ------------------------------------------------------------- commands -- */
  const commands = useMemo<CommandItem[]>(() => {
    const close = () => onOpenChange(false);

    return [
      {
        id: "command:assistant",
        title: "Ask the assistant",
        description: "Open the chat and ask about his work",
        keywords: ["ai", "chat", "assistant", "ask", "question"],
        icon: MessageSquare,
        run: () => {
          close();
          scrollToElement(SECTIONS.assistant);
        },
      },
      {
        id: "command:theme",
        title: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        description: "Toggle the colour scheme",
        keywords: ["theme", "dark", "light", "appearance", "colour", "color"],
        icon: resolvedTheme === "dark" ? Sun : Moon,
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          close();
        },
      },
      {
        id: "command:email",
        title: "Send an email",
        description: siteConfig.email,
        keywords: ["contact", "email", "hire", "reach", "message"],
        icon: Mail,
        run: () => {
          close();
          window.location.href = `mailto:${siteConfig.email}`;
        },
      },
      {
        id: "command:github",
        title: "Open GitHub",
        description: "Repositories and activity",
        keywords: ["github", "code", "repos", "source"],
        icon: Github,
        run: () => {
          close();
          window.open(
            socialConfig.links.find((link) => link.id === "github")?.href ?? "#",
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
      {
        id: "command:linkedin",
        title: "Open LinkedIn",
        description: "Professional profile",
        keywords: ["linkedin", "profile", "network"],
        icon: Linkedin,
        run: () => {
          close();
          window.open(
            socialConfig.links.find((link) => link.id === "linkedin")?.href ?? "#",
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
    ];
  }, [onOpenChange, resolvedTheme, setTheme]);

  /* -------------------------------------------------------------- results -- */
  const results = useMemo(() => searchDocuments(query, { limit: 7 }), [query]);

  const matchingCommands = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length === 0) return commands.slice(0, 3);

    return commands.filter((command) =>
      [command.title, command.description, ...command.keywords]
        .join(" ")
        .toLowerCase()
        .includes(trimmed),
    );
  }, [commands, query]);

  /**
   * One flat list of selectable rows.
   *
   * Arrow keys have to move through documents and commands as a single sequence — two
   * independent indexes would mean the highlight jumps or stalls at a group boundary.
   */
  const rows = useMemo(
    () => [
      ...results.map((result) => ({ kind: "result" as const, result })),
      ...matchingCommands.map((command) => ({ kind: "command" as const, command })),
    ],
    [matchingCommands, results],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery(initialQuery);
    // Radix moves focus into the panel; the input is where it belongs.
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [initialQuery, open]);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    return () => startScroll();
  }, [open]);

  // Keeps the highlighted row in view without moving focus.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const runRow = useCallback(
    (index: number) => {
      const row = rows[index];
      if (!row) return;

      if (row.kind === "command") {
        row.command.run();
        return;
      }

      const { href } = row.result.document;
      onOpenChange(false);

      // A same-page hash is a scroll, not a navigation — routing to it would reload
      // the section rather than travelling to it.
      if (href.startsWith("/#") && window.location.pathname === "/") {
        scrollToElement(href.slice(2));
        return;
      }
      router.push(href);
    },
    [onOpenChange, router, rows],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (rows.length === 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((previous) => (previous + 1) % rows.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((previous) => (previous - 1 + rows.length) % rows.length);
          break;
        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          event.preventDefault();
          setActiveIndex(rows.length - 1);
          break;
        case "Enter":
          event.preventDefault();
          runRow(activeIndex);
          break;
        default:
          break;
      }
    },
    [activeIndex, rows.length, runRow],
  );

  const activeId = rows[activeIndex] ? `${listId}-row-${activeIndex}` : undefined;

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

            {/* Centring lives on the wrapper, since Framer Motion writes `transform`
                inline and would overwrite a Tailwind translate. */}
            <div className="pointer-events-none fixed inset-0 z-[var(--z-modal)] flex items-start justify-center p-4 pt-[12vh]">
              <Dialog.Content asChild>
                <motion.div
                  variants={panel}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  data-lenis-prevent
                  className={cn(
                    "pointer-events-auto w-full max-w-2xl overflow-hidden",
                    "rounded-2xl border border-border bg-card shadow-2xl",
                    "surface-sheen",
                  )}
                >
                  <Dialog.Title className="sr-only">
                    Search and commands
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Type to search projects, articles, technologies and sections. Use the
                    arrow keys to move and Enter to select.
                  </Dialog.Description>

                  {/* ----------------------------------------------- input -- */}
                  <div className="flex items-center gap-3 border-b border-border px-4">
                    <Search
                      aria-hidden="true"
                      className="size-4 shrink-0 text-subtle"
                    />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Search projects, writing, technologies…"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      role="combobox"
                      aria-expanded
                      aria-controls={listId}
                      aria-activedescendant={activeId}
                      aria-label="Search"
                      className={cn(
                        "h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground",
                        "outline-none placeholder:text-subtle",
                      )}
                    />
                    <Kbd keys={["escape"]} className="hidden sm:inline-flex" />
                  </div>

                  {/* ---------------------------------------------- results -- */}
                  <div
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    aria-label="Results"
                    className="max-h-[min(24rem,50vh)] overflow-y-auto overscroll-contain p-2"
                  >
                    {rows.length === 0 ? (
                      <p className="px-3 py-8 text-center text-sm text-muted">
                        Nothing matches{" "}
                        <span className="font-medium text-foreground">
                          &ldquo;{query.trim()}&rdquo;
                        </span>
                        . Try a technology, a project or an article title.
                      </p>
                    ) : (
                      <>
                        {results.length > 0 ? (
                          <p className="px-3 pt-2 pb-1.5 font-mono text-2xs tracking-widest text-subtle uppercase">
                            Results
                          </p>
                        ) : null}

                        {rows.map((row, index) => {
                          const isActive = index === activeIndex;
                          const isFirstCommand =
                            row.kind === "command" &&
                            (rows[index - 1]?.kind ?? "command") === "result";

                          const Icon =
                            row.kind === "result"
                              ? row.result.document.icon
                              : row.command.icon;

                          const title =
                            row.kind === "result"
                              ? row.result.document.title
                              : row.command.title;

                          const description =
                            row.kind === "result"
                              ? row.result.document.description
                              : row.command.description;

                          return (
                            <div key={row.kind === "result" ? row.result.document.id : row.command.id}>
                              {isFirstCommand ? (
                                <p className="px-3 pt-4 pb-1.5 font-mono text-2xs tracking-widest text-subtle uppercase">
                                  Commands
                                </p>
                              ) : null}

                              <button
                                type="button"
                                id={`${listId}-row-${index}`}
                                role="option"
                                aria-selected={isActive}
                                data-active={isActive}
                                // Pointer hover moves the highlight so mouse and
                                // keyboard never disagree about what Enter will do.
                                onPointerMove={() => setActiveIndex(index)}
                                onClick={() => runRow(index)}
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                                  "transition-colors duration-[var(--duration-instant)]",
                                  isActive ? "bg-highlight" : "hover:bg-highlight/60",
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "grid size-8 shrink-0 place-items-center rounded-lg border",
                                    isActive
                                      ? "border-primary/40 bg-primary/12 text-primary"
                                      : "border-border bg-elevated text-subtle",
                                    "[&_svg]:size-4",
                                  )}
                                >
                                  <Icon />
                                </span>

                                <span className="flex min-w-0 flex-1 flex-col">
                                  <span className="truncate text-sm font-medium text-foreground">
                                    {row.kind === "result"
                                      ? highlightSegments(title, row.result.matches).map(
                                          (segment, segmentIndex) =>
                                            segment.matched ? (
                                              <mark
                                                key={segmentIndex}
                                                className="bg-transparent text-primary"
                                              >
                                                {segment.text}
                                              </mark>
                                            ) : (
                                              <span key={segmentIndex}>{segment.text}</span>
                                            ),
                                        )
                                      : title}
                                  </span>
                                  <span className="truncate text-xs text-subtle">
                                    {description}
                                  </span>
                                </span>

                                {row.kind === "result" ? (
                                  <span className="hidden shrink-0 font-mono text-2xs tracking-wider text-subtle uppercase sm:block">
                                    {KIND_LABEL[row.result.document.kind]}
                                  </span>
                                ) : null}

                                {isActive ? (
                                  <CornerDownLeft
                                    aria-hidden="true"
                                    className="size-3.5 shrink-0 text-subtle"
                                  />
                                ) : null}
                              </button>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>

                  {/* ----------------------------------------------- footer -- */}
                  <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2.5">
                    <div className="flex items-center gap-3 text-2xs text-subtle">
                      <span className="flex items-center gap-1.5">
                        <Kbd keys={["arrowup", "arrowdown"]} />
                        move
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Kbd keys={["enter"]} />
                        select
                      </span>
                    </div>

                    <Link
                      href="/blog"
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-1 text-2xs text-subtle transition-colors hover:text-foreground focus-ring rounded"
                    >
                      Browse all writing
                      <ArrowUpRight aria-hidden="true" className="size-3" />
                    </Link>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
