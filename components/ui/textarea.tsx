import { type TextareaHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Applies the invalid treatment and wires `aria-invalid`. */
  invalid?: boolean;
}

/**
 * Multi-line text input.
 *
 * `field-sizing-content` lets the browser grow the box to fit its content with no JavaScript at
 * all — no resize observer, no scroll-height measurement, no layout thrash. `min-h` and `max-h`
 * bound it, and `rows` remains the fallback where the property is unsupported.
 *
 * `resize-y` rather than `resize-none`: taking away a native affordance to protect a layout is
 * the wrong trade when the layout can simply accommodate it.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid = false, rows = 5, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full rounded-xl border px-3.5 py-3 text-sm leading-relaxed",
          "field-sizing-content max-h-80 min-h-28 resize-y",
          "bg-input text-foreground transition-colors duration-[var(--duration-fast)]",
          "outline-none placeholder:text-subtle",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid
            ? "border-danger/60"
            : "border-border hover:border-border-strong focus-visible:border-border-strong",
          className,
        )}
        {...props}
      />
    );
  },
);
