"use client";

import { AlertCircle } from "lucide-react";
import { type ReactNode, useId } from "react";

import { cn } from "@/lib/utils";

export interface FieldProps {
  label: string;
  /**
   * Receives the ids and state the control needs. Render the input inside this, so the label,
   * the hint and the error are wired without the caller repeating four `aria-*` attributes on
   * every field.
   */
  children: (props: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
  /** Static guidance, shown until an error replaces it. */
  hint?: string;
  error?: string;
  required?: boolean;
  /** Live character count, rendered beside the label. */
  counter?: { value: number; max: number };
  className?: string;
}

/**
 * Label, control, hint, error and counter — wired correctly, once.
 *
 * The render-prop shape exists because the accessibility wiring is the part that gets skipped:
 * a control needs a generated id matching its label's `htmlFor`, an `aria-describedby` pointing
 * at whichever of the hint or error is currently rendered, and `aria-invalid` in sync with the
 * visual state. Passing those down means a caller cannot forget them.
 *
 * The error replaces the hint rather than stacking below it. Two messages under one input is
 * noise, and the error is always the more urgent of the two.
 *
 * `role="alert"` on the error announces it when it appears — but only then, which is why it is
 * conditionally rendered rather than always present and empty.
 *
 * The counter turns amber before the limit rather than at it, so the warning arrives while there
 * is still something to do about it.
 */
export function Field({
  label,
  children,
  hint,
  error,
  required = false,
  counter,
  className,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const describedBy = error ? errorId : hint ? hintId : undefined;
  const nearLimit = counter ? counter.max - counter.value <= 60 : false;
  const overLimit = counter ? counter.value > counter.max : false;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
          {required ? (
            <>
              <span aria-hidden="true" className="ml-0.5 text-primary">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          ) : (
            <span className="ml-1.5 text-xs font-normal text-subtle">optional</span>
          )}
        </label>

        {counter && nearLimit ? (
          <span
            aria-hidden="true"
            className={cn(
              "font-mono text-2xs tabular-nums",
              overLimit ? "text-danger" : "text-warning",
            )}
          >
            {counter.value}/{counter.max}
          </span>
        ) : null}
      </div>

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs leading-relaxed text-danger"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-3 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
