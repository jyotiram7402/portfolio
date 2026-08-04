"use client";

import { Search } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { Kbd } from "@/components/ui/kbd";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { cn } from "@/lib/utils";

export interface SearchTriggerProps {
  className?: string;
}

/**
 * The navbar's search affordance.
 *
 * Two shapes for two contexts. Above `md` it is a wide button showing the shortcut, because a
 * discoverable ⌘K is what turns the palette from a hidden feature into the main way people
 * navigate the site. Below that it collapses to an icon, where a 12rem button would crowd out
 * the logo.
 *
 * The `Kbd` hint is not decoration — it is the entire discovery mechanism for the keyboard
 * path, and hiding it would mean only people who already guessed would find it.
 */
export function SearchTrigger({ className }: SearchTriggerProps) {
  const { setOpen } = useCommandPalette();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "hidden items-center gap-2.5 rounded-full border border-border md:flex",
          "bg-input py-1.5 pr-2 pl-3.5 text-sm text-subtle",
          "transition-colors duration-[var(--duration-fast)]",
          "hover:border-border-strong hover:text-muted focus-ring",
          className,
        )}
      >
        <Search aria-hidden="true" className="size-3.5" />
        <span className="pr-6">Search</span>
        <Kbd keys={["mod", "k"]} />
      </button>

      <IconButton
        label="Search"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn("md:hidden", "text-muted hover:text-foreground")}
      >
        <Search />
      </IconButton>
    </>
  );
}
