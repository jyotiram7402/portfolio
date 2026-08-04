/**
 * Subsequence fuzzy matching.
 *
 * Hand-written rather than pulled from a library, for two reasons. It is about
 * forty lines, and every consumer here — the command palette, the blog filter and
 * the assistant's intent resolver — needs the *same* notion of "close enough". One
 * scorer means a query that finds a project in the palette also finds it in search.
 *
 * The algorithm is the one every good command palette uses: the query must appear
 * in the target as a subsequence, and the score rewards matches that are early,
 * contiguous, and on word boundaries. That is what makes "sbt" rank "Spring Boot"
 * above "Subtle Backend Tooling".
 */

export interface FuzzyMatch {
  /** 0–1, where 1 is an exact prefix match. */
  score: number;
  /** Indices in the target that matched, for highlighting. */
  matches: number[];
}

const NO_MATCH: FuzzyMatch = { score: 0, matches: [] };

/** True at the start of a word — after a space, dash, dot, slash or camel hump. */
function isBoundary(target: string, index: number): boolean {
  if (index === 0) return true;
  const previous = target[index - 1];
  const current = target[index];
  if (previous === undefined || current === undefined) return false;
  if (/[\s\-_./]/.test(previous)) return true;
  return previous === previous.toLowerCase() && current !== current.toLowerCase();
}

/**
 * Scores `query` against `target`.
 *
 * Returns a zero score when the query is not a subsequence of the target, which
 * callers treat as "exclude", not as "rank last".
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatch {
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) return { score: 1, matches: [] };
  if (needle.length > target.length) return NO_MATCH;

  const haystack = target.toLowerCase();

  // Exact and prefix hits skip the walk entirely — they are the common case and
  // deserve to be unambiguously the best.
  if (haystack === needle) {
    return { score: 1, matches: Array.from({ length: needle.length }, (_, i) => i) };
  }
  if (haystack.startsWith(needle)) {
    return { score: 0.95, matches: Array.from({ length: needle.length }, (_, i) => i) };
  }

  const matches: number[] = [];
  let cursor = 0;
  let raw = 0;
  let streak = 0;

  for (const character of needle) {
    const found = haystack.indexOf(character, cursor);
    if (found === -1) return NO_MATCH;

    // Contiguity is the strongest signal, then word boundaries, then earliness.
    if (found === cursor && matches.length > 0) {
      streak += 1;
      raw += 3 + streak;
    } else {
      streak = 0;
      raw += isBoundary(target, found) ? 2.5 : 1;
    }

    matches.push(found);
    cursor = found + 1;
  }

  // Normalise against the best achievable score for a query of this length, then
  // damp by how much of the target went unmatched — a two-character query should
  // not score a forty-character title as highly as a four-character one.
  const best = needle.length * 4;
  const coverage = needle.length / haystack.length;
  const positionPenalty = 1 - (matches[0] ?? 0) / (haystack.length + 1);

  const score = Math.min(
    0.9,
    (raw / best) * 0.6 + coverage * 0.2 + positionPenalty * 0.2,
  );

  return { score, matches };
}

/**
 * Best score for a query across several fields, weighted by field importance.
 *
 * A title hit should beat a keyword hit even when the keyword match is tighter,
 * which is what the weights encode.
 */
export function fuzzyMatchFields(
  query: string,
  fields: readonly { value: string; weight: number }[],
): FuzzyMatch {
  let best = NO_MATCH;
  let bestWeighted = 0;

  for (const field of fields) {
    const result = fuzzyMatch(query, field.value);
    if (result.score === 0) continue;

    const weighted = result.score * field.weight;
    if (weighted > bestWeighted) {
      bestWeighted = weighted;
      best = result;
    }
  }

  return bestWeighted === 0 ? NO_MATCH : { ...best, score: bestWeighted };
}

/** Splits a title into matched and unmatched runs, for highlighted rendering. */
export function highlightSegments(
  text: string,
  matches: readonly number[],
): readonly { text: string; matched: boolean }[] {
  if (matches.length === 0) return [{ text, matched: false }];

  const flags = new Set(matches);
  const segments: { text: string; matched: boolean }[] = [];

  let buffer = "";
  let bufferMatched = flags.has(0);

  for (let index = 0; index < text.length; index += 1) {
    const matched = flags.has(index);
    if (matched !== bufferMatched && buffer.length > 0) {
      segments.push({ text: buffer, matched: bufferMatched });
      buffer = "";
    }
    bufferMatched = matched;
    buffer += text[index];
  }

  if (buffer.length > 0) segments.push({ text: buffer, matched: bufferMatched });
  return segments;
}
