"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches a DOM listener whose handler can change without re-subscribing.
 *
 * The handler is held in a ref, so a new inline closure on every render does
 * not tear down and re-add the listener — which matters for high-frequency
 * events like `pointermove` and `scroll`.
 */
export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions & { target?: Window | null },
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  options: AddEventListenerOptions & { target: Document },
): void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options: AddEventListenerOptions & { target: HTMLElement | null },
): void;
export function useEventListener(
  type: string,
  handler: (event: Event) => void,
  options: (AddEventListenerOptions & { target?: EventTarget | null }) = {},
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const { target, ...listenerOptions } = options;
  const { capture, passive, once } = listenerOptions;

  useEffect(() => {
    const element = target === undefined ? window : target;
    if (!element) return;

    const listener = (event: Event) => handlerRef.current(event);
    element.addEventListener(type, listener, { capture, passive, once });

    return () => {
      element.removeEventListener(type, listener, { capture });
    };
  }, [type, target, capture, passive, once]);
}
