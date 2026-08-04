import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rendered inside the field, before the text. Decorative only. */
  leading?: ReactNode;
  /** Rendered inside the field, after the text. Interactive is fine here. */
  trailing?: ReactNode;
  /** Applies the invalid treatment and wires `aria-invalid`. */
  invalid?: boolean;
  /** Id of the element describing this field — an error or a hint. */
  describedBy?: string;
}

/**
 * Text input.
 *
 * The wrapper carries the border and the focus ring rather than the `<input>` itself, so
 * leading and trailing content sits inside the visual field and the ring surrounds all
 * of it. `focus-within` is what makes that work without JavaScript.
 *
 * `invalid` drives both the colour and `aria-invalid`, so the state can never be
 * communicated visually without also being communicated to assistive tech.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, leading, trailing, invalid = false, describedBy, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        "group/input flex h-12 items-center gap-2.5 rounded-xl border px-3.5",
        "bg-input transition-colors duration-[var(--duration-fast)]",
        "focus-ring-within",
        invalid
          ? "border-danger/60"
          : "border-border hover:border-border-strong focus-within:border-border-strong",
        className,
      )}
    >
      {leading ? (
        <span aria-hidden="true" className="shrink-0 text-subtle [&_svg]:size-4">
          {leading}
        </span>
      ) : null}

      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-sm text-foreground",
          "outline-none placeholder:text-subtle",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      />

      {trailing ? <span className="shrink-0 [&_svg]:size-4">{trailing}</span> : null}
    </div>
  );
});
