"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/utils/dom";

export interface CopyButtonProps {
  value: string;
  /** Describes what is being copied, for the accessible label. */
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Copy-to-clipboard control.
 *
 * The confirmation is announced through a live region rather than only shown as a tick,
 * because "did that work?" is the entire question the control has to answer and an icon
 * swap answers it for sighted users only.
 *
 * A failed copy — blocked permissions, insecure context — says so instead of showing a
 * tick and lying.
 */
export function CopyButton({
  value,
  label = "Copy",
  size = "sm",
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [state]);

  const onCopy = useCallback(async () => {
    const ok = await copyToClipboard(value);
    setState(ok ? "copied" : "error");
  }, [value]);

  return (
    <>
      <IconButton
        label={state === "copied" ? "Copied" : label}
        variant="ghost"
        size={size}
        onClick={onCopy}
        className={cn(state === "copied" && "text-success", className)}
      >
        {state === "copied" ? <Check /> : <Copy />}
      </IconButton>

      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Copied to clipboard" : null}
        {state === "error" ? "Could not copy — copy manually instead" : null}
      </span>
    </>
  );
}
