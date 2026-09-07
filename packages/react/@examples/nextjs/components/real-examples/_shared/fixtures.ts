/**
 * Shared determinism conventions for real-example fixtures.
 *
 * Every real example keeps its *domain* fixtures colocated in its own
 * directory (`<slug>/fixtures.ts`); this module holds only the shared,
 * domain-neutral conventions they all follow:
 *
 * 1. Dates are fixed ISO 8601 UTC strings (never `new Date()`), so snapshots
 *    and renders are identical across builds, clocks, and time zones. Use
 *    `FIXTURE_NOW` as "today" and `addDaysUtc` only to offset it.
 * 2. IDs come from `stableId` — readable, collision-free, and identical on
 *    every run (no `Math.random`, no time-based IDs).
 * 3. Text lengths vary: `SHORT_LABEL`/`LONG_LABEL` exercise truncation and
 *    wrapping deliberately.
 * 4. Images always pair a source with a text fallback via
 *    `avatarFallbackFor` (initials), so a missing image degrades gracefully.
 * 5. Every example ships fixtures for zero-result and disabled states, not
 *    only the happy path.
 *
 * Server-safe: no 'use client', no React imports.
 */

/** Fixed "today" for all real examples — one UTC instant, never the wall clock. */
export const FIXTURE_NOW = '2026-03-09T12:00:00.000Z';

/** Offset the fixed instant by whole UTC days; returns an ISO string. */
export function addDaysUtc(iso: string, days: number): string {
  const base = new Date(iso);
  return new Date(base.getTime() + days * 86_400_000).toISOString();
}

/** Deterministic, human-readable ID: stableId('customer', 7) === 'customer-007'. */
export function stableId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

/** Initials fallback for avatars so a missing image always has a text stand-in. */
export function avatarFallbackFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/** Deliberately varied label lengths for truncation and wrapping coverage. */
export const SHORT_LABEL = 'Ops';
export const LONG_LABEL = 'Cross-functional platform reliability and developer experience working group';

/** Explicit empty fixture every list-like example reuses for its zero-result state. */
export const EMPTY_RESULTS: readonly never[] = Object.freeze([]);
