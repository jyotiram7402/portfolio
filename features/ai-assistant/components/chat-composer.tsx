"use client";

import { ArrowUp, Square } from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { IconButton } from "@/components/ui/icon-button";
import { CHAT_LIMITS, chatCopy } from "@/data/ai";
import { cn } from "@/lib/utils";

export interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  isStreaming: boolean;
  error: string | null;
  /** Focuses the field on mount. Used by the drawer, not by the inline panel. */
  autoFocus?: boolean;
  className?: string;
}

const MAX_ROWS = 4;

/**
 * The message composer.
 *
 * A `<textarea>` rather than an `<input>`, because a two-line question should not scroll
 * horizontally. It grows to a four-row cap and then scrolls — unbounded growth would push
 * the transcript off the screen on a phone.
 *
 * Enter sends and Shift+Enter inserts a newline, which is the convention every chat
 * interface has settled on. IME composition is respected: pressing Enter to accept a
 * candidate in a Japanese or Chinese input method must not send the message.
 *
 * A real `<form>`, so the mobile keyboard shows a submit action and the browser's own
 * handling works. The button becomes Stop while streaming rather than sitting disabled —
 * the useful action at that moment is cancelling.
 */
export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming,
  error,
  autoFocus = false,
  className,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composingRef = useRef(false);

  // Autosize. Reset to `auto` first, or the height only ever grows.
  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;

    element.style.height = "auto";
    const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight) || 20;
    const max = lineHeight * MAX_ROWS;
    element.style.height = `${Math.min(element.scrollHeight, max)}px`;
    element.style.overflowY = element.scrollHeight > max ? "auto" : "hidden";
  }, [value]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (isStreaming) return;
      onSubmit();
    },
    [isStreaming, onSubmit],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      // `isComposing` covers most browsers; the ref covers the rest.
      if (event.nativeEvent.isComposing || composingRef.current) return;

      event.preventDefault();
      if (!isStreaming) onSubmit();
    },
    [isStreaming, onSubmit],
  );

  const remaining = CHAT_LIMITS.maxInput - value.length;
  const nearLimit = remaining <= 40;

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border px-3 py-2.5",
          "bg-input transition-colors duration-[var(--duration-fast)]",
          "focus-ring-within",
          error ? "border-danger/60" : "border-border focus-within:border-border-strong",
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          rows={1}
          maxLength={CHAT_LIMITS.maxInput}
          placeholder={chatCopy.placeholder}
          aria-label={chatCopy.placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "chat-composer-error" : undefined}
          className={cn(
            "min-w-0 flex-1 resize-none bg-transparent py-1 text-sm leading-relaxed",
            "text-foreground outline-none placeholder:text-subtle",
          )}
        />

        {isStreaming ? (
          <IconButton
            label={chatCopy.stop}
            type="button"
            variant="secondary"
            size="sm"
            onClick={onStop}
          >
            <Square className="size-3" />
          </IconButton>
        ) : (
          <IconButton
            label={chatCopy.send}
            type="submit"
            size="sm"
            disabled={value.trim().length === 0}
          >
            <ArrowUp />
          </IconButton>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 px-1">
        {error ? (
          <p id="chat-composer-error" role="alert" className="text-xs text-danger">
            {error}
          </p>
        ) : (
          <p className="text-2xs leading-relaxed text-subtle">{chatCopy.disclosure}</p>
        )}

        {nearLimit ? (
          <p
            className={cn(
              "shrink-0 font-mono text-2xs",
              remaining < 0 ? "text-danger" : "text-subtle",
            )}
          >
            {remaining}
          </p>
        ) : null}
      </div>
    </form>
  );
}
