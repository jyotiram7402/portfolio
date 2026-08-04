/**
 * Result envelope used by every service call.
 *
 * Services never throw for expected failures — they return a discriminated
 * union so callers are forced by the type system to handle the error branch.
 */
export type ServiceResult<TData> =
  | { ok: true; data: TData }
  | { ok: false; error: ServiceError };

export interface ServiceError {
  message: string;
  /** HTTP status when the failure came from a response. */
  status?: number;
  code?: ServiceErrorCode;
  /** Original thrown value, for logging only. Never render this. */
  cause?: unknown;
}

export type ServiceErrorCode =
  | "network"
  | "timeout"
  | "aborted"
  | "http"
  | "parse"
  | "rate_limited"
  | "not_configured"
  | "unknown";

export interface RequestOptions {
  signal?: AbortSignal;
  /** Milliseconds before the request is aborted. */
  timeout?: number;
  headers?: Record<string, string>;
  /** Passed through to Next's extended fetch for ISR-style caching. */
  revalidate?: number | false;
  tags?: readonly string[];
}
