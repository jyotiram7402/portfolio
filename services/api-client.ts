import type { RequestOptions, ServiceError, ServiceResult } from "@/types/api";

/**
 * Thin fetch wrapper shared by every service.
 *
 * Two decisions worth stating:
 *
 * 1. It never throws for an expected failure. A rejected promise forces every
 *    call site into a try/catch that TypeScript cannot verify; a discriminated
 *    `ServiceResult` makes the error branch impossible to forget.
 *
 * 2. Timeouts are enforced here, not left to the platform. An upstream that
 *    hangs would otherwise hold a server render open until the whole route
 *    times out.
 */

const DEFAULT_TIMEOUT_MS = 8_000;

function toServiceError(cause: unknown): ServiceError {
  if (cause instanceof DOMException && cause.name === "AbortError") {
    return { message: "The request was aborted.", code: "aborted", cause };
  }
  if (cause instanceof TypeError) {
    return { message: "Network request failed.", code: "network", cause };
  }
  return {
    message: cause instanceof Error ? cause.message : "Unknown error.",
    code: "unknown",
    cause,
  };
}

/**
 * Combines a caller's signal with an internal timeout.
 *
 * `AbortSignal.any` is used when available; the manual fallback keeps this
 * working on runtimes that predate it.
 */
function createSignal(
  timeout: number,
  external?: AbortSignal,
): { signal: AbortSignal; cleanup: () => void } {
  const timeoutSignal = AbortSignal.timeout(timeout);
  if (!external) {
    return { signal: timeoutSignal, cleanup: () => {} };
  }

  if (typeof AbortSignal.any === "function") {
    return {
      signal: AbortSignal.any([timeoutSignal, external]),
      cleanup: () => {},
    };
  }

  const controller = new AbortController();
  const abort = () => controller.abort();
  timeoutSignal.addEventListener("abort", abort);
  external.addEventListener("abort", abort);
  return {
    signal: controller.signal,
    cleanup: () => {
      timeoutSignal.removeEventListener("abort", abort);
      external.removeEventListener("abort", abort);
    },
  };
}

export async function requestJson<TData>(
  url: string,
  options: RequestOptions = {},
): Promise<ServiceResult<TData>> {
  const {
    timeout = DEFAULT_TIMEOUT_MS,
    headers = {},
    signal: externalSignal,
    revalidate,
    tags,
  } = options;

  const { signal, cleanup } = createSignal(timeout, externalSignal);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", ...headers },
      signal,
      // Next's extended fetch: absent means the framework default applies.
      ...(revalidate !== undefined || tags
        ? { next: { revalidate, tags: tags ? [...tags] : undefined } }
        : {}),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: {
          message: `Request failed with status ${response.status}.`,
          status: response.status,
          code: response.status === 403 || response.status === 429
            ? "rate_limited"
            : "http",
        },
      };
    }

    try {
      const data = (await response.json()) as TData;
      return { ok: true, data };
    } catch (cause) {
      return {
        ok: false,
        error: { message: "Response was not valid JSON.", code: "parse", cause },
      };
    }
  } catch (cause) {
    return { ok: false, error: toServiceError(cause) };
  } finally {
    cleanup();
  }
}
