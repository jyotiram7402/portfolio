import { siteConfig } from "@/config/site";

/**
 * Formatting helpers.
 *
 * `Intl` formatters are created once at module scope: constructing one is
 * comparatively expensive, and doing it inside a render would repeat that cost
 * on every pass.
 */

const LOCALE = siteConfig.language;

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "short",
});

const relativeFormatter = new Intl.RelativeTimeFormat(LOCALE, {
  numeric: "auto",
});

const compactNumberFormatter = new Intl.NumberFormat(LOCALE, {
  notation: "compact",
  maximumFractionDigits: 1,
});

function toDate(value: Date | string | number): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: Date | string | number): string {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "";
}

export function formatShortDate(value: Date | string | number): string {
  const date = toDate(value);
  return date ? shortDateFormatter.format(date) : "";
}

export function formatMonthYear(value: Date | string | number): string {
  const date = toDate(value);
  return date ? monthYearFormatter.format(date) : "";
}

/** ISO-8601 date, for `<time dateTime>` and structured data. */
export function toIsoDate(value: Date | string | number): string {
  return toDate(value)?.toISOString() ?? "";
}

const RELATIVE_UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
];

/** "3 days ago", "in 2 months". Falls back to "just now" under a minute. */
export function formatRelativeTime(value: Date | string | number): string {
  const date = toDate(value);
  if (!date) return "";

  const elapsed = date.getTime() - Date.now();
  const magnitude = Math.abs(elapsed);

  for (const [unit, ms] of RELATIVE_UNITS) {
    if (magnitude >= ms) {
      return relativeFormatter.format(Math.round(elapsed / ms), unit);
    }
  }
  return "just now";
}

/** 1234 → "1.2K" */
export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value);
}

export function formatPercent(fraction: number, decimals = 0): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "percent",
    maximumFractionDigits: decimals,
  }).format(fraction);
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : decimals)} ${units[exponent]}`;
}

/** Truncates on a word boundary and appends an ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}…`;
}

export function slugify(text: string): string {
  return text
    // NFKD splits accented characters into base + combining mark; the
    // allow-list below then drops the marks, so "Résumé" → "resume".
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** "J. Kamble" → "JK" */
export function getInitials(name: string, max = 2): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

/** Zero-padded index, for ordered lists: 1 → "01" */
export function padIndex(index: number, length = 2): string {
  return String(index).padStart(length, "0");
}

const WORDS_PER_MINUTE = 220;

export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
