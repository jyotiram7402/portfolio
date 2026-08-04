"use client";

import "@/styles/globals.css";

import { fontVariables } from "@/lib/fonts";

/**
 * Last-resort error boundary.
 *
 * Catches failures in the root layout itself, which means neither the layout nor
 * any provider is available here — that is why it renders its own `<html>` and
 * `<body>`, and why it deliberately imports nothing beyond the stylesheet and the
 * font variables.
 *
 * Keep this file dependency-free. Anything it imports is code that could itself
 * be the thing that failed.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-dvh items-center justify-center bg-background px-6 font-sans text-foreground antialiased">
        <main className="flex max-w-md flex-col gap-5 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Something went badly wrong.
          </h1>
          <p className="text-muted">
            The page could not be rendered at all. Reloading usually resolves it.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mx-auto inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground focus-ring"
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
