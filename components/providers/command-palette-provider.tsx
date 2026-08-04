"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { CommandPaletteContext } from "@/components/providers/command-palette-context";

/**
 * The palette's chunk — search index, result rows, command handlers — is only fetched
 * the first time it is opened. Most visitors never press ⌘K, and they should not pay for
 * it.
 */
const CommandPalette = dynamic(
  () =>
    import("@/components/common/command-palette").then(
      (module) => module.CommandPalette,
    ),
  { ssr: false },
);

export interface CommandPaletteProviderProps {
  children: ReactNode;
}

/**
 * Owns the palette's open state and the global shortcut.
 *
 * The shortcut is bound once here rather than in the palette itself, because the palette
 * is not mounted until it has been opened — a listener inside it could never open it.
 *
 * Two bindings, and both are guarded:
 *
 * • **⌘K / Ctrl+K** works anywhere, including inside a text field. It is the one
 *   shortcut every user of this class of app already expects.
 * • **`/`** works only when focus is not in a text field, so typing a slash into the
 *   chat composer or the blog search does not hijack the keystroke.
 *
 * `hasOpened` keeps the component mounted after the first open, so reopening is instant
 * rather than triggering the dynamic import again.
 */
export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [query, setQuery] = useState("");

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (next) setHasOpened(true);
  }, []);

  const toggle = useCallback(() => {
    setOpen((previous) => {
      if (!previous) setHasOpened(true);
      return !previous;
    });
  }, []);

  const openWith = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    setHasOpened(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    const isTextEntry = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      const tag = target.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
        return;
      }

      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (isTextEntry(event.target)) return;
        event.preventDefault();
        handleOpenChange(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleOpenChange, toggle]);

  const api = useMemo(
    () => ({ open, setOpen: handleOpenChange, toggle, openWith, query, setQuery }),
    [handleOpenChange, open, openWith, query, toggle],
  );

  return (
    <CommandPaletteContext.Provider value={api}>
      {children}
      {hasOpened ? (
        <CommandPalette
          open={open}
          onOpenChange={handleOpenChange}
          initialQuery={query}
        />
      ) : null}
    </CommandPaletteContext.Provider>
  );
}
