import { ChevronDown } from "lucide-react";
import { type SelectHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: readonly SelectOption[];
  /** Rendered as a disabled first option, so the field can start genuinely empty. */
  placeholder?: string;
  invalid?: boolean;
}

/**
 * A native `<select>`, styled.
 *
 * Deliberately not a custom listbox. The native control gets the platform picker on mobile —
 * a full-height wheel on iOS, a proper dropdown on Android — plus type-ahead, keyboard
 * behaviour and screen reader support that a div-based replacement has to reimplement and
 * usually gets subtly wrong.
 *
 * The only concessions are visual: `appearance-none` to drop the platform arrow, and a chevron
 * positioned over the field. The chevron is `pointer-events-none`, so clicking it still opens
 * the select rather than swallowing the event.
 *
 * The placeholder option is `disabled` so it cannot be re-selected once a real value is chosen,
 * and it is what makes `required` meaningful on a select.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options, placeholder, invalid = false, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-12 w-full appearance-none rounded-xl border pr-10 pl-3.5 text-sm",
          "bg-input text-foreground transition-colors duration-[var(--duration-fast)]",
          "outline-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid
            ? "border-danger/60"
            : "border-border hover:border-border-strong focus-visible:border-border-strong",
          // A select showing the placeholder should read as empty, not as chosen.
          props.value === "" && "text-subtle",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-subtle"
      />
    </div>
  );
});
