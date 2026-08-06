"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
  className?: string;
}

const LABELS = {
  dark: "Dark theme",
  light: "Light theme",
  system: "System theme",
} as const;

/**
 * Cycles dark → light → system.
 *
 * Three states rather than a binary flip, because "follow my OS" is a real
 * preference and silently dropping it once the user touches the toggle is a
 * regression they cannot undo.
 *
 * Before hydration the resolved theme is unknown, so the button renders in a
 * disabled placeholder state with a reserved footprint — this avoids both a
 * hydration mismatch and a layout shift in the navbar.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, isReady, cycleTheme } = useTheme();

  if (!isReady) {
    return (
      <div
        aria-hidden="true"
        // Must track the `icon-sm` footprint at every breakpoint, or the navbar
        // shifts the moment the real button replaces this placeholder.
        className={cn("size-11 shrink-0 md:size-9", className)}
      />
    );
  }

  const Icon = theme === "light" ? Sun : theme === "system" ? Monitor : Moon;

  return (
    <Tooltip content={`${LABELS[theme]} — click to change`}>
      <IconButton
        label={`Change theme. Current: ${LABELS[theme]}`}
        variant="ghost"
        size="sm"
        onClick={cycleTheme}
        className={cn("text-muted hover:text-foreground", className)}
      >
        <Icon />
      </IconButton>
    </Tooltip>
  );
}
