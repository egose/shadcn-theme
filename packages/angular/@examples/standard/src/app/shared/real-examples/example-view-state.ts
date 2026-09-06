/**
 * Domain-neutral view-state vocabulary for the real product examples
 * (`pages/examples/<slug>/`).
 *
 * This file is intentionally free of product semantics: it names the states
 * every catalog example can be previewed in (loading, empty, error, loaded)
 * plus the read-only/permission and outcome controls the planned flows
 * (pricing, team management, settings, support inbox) all need. Feature
 * pages keep their own models and fixtures; only this state contract is
 * shared.
 */

/** Every visual state the catalog tooling can put an example page into. */
export type ExampleViewState = 'loading' | 'empty' | 'error' | 'loaded';

/** All selectable view states, in toolbar order. */
export const EXAMPLE_VIEW_STATES: readonly ExampleViewState[] = ['loading', 'empty', 'error', 'loaded'];

/**
 * Deterministic simulated network latency for catalog previews. Fixed so
 * reloads behave identically across runs and time zones; specs may override
 * it per call through `SimulatedLoadOptions.latencyMs`.
 */
export const EXAMPLE_SIMULATED_LATENCY_MS = 120;

/** Error copy used when a simulated reload fails without a custom message. */
export const EXAMPLE_SIMULATED_ERROR_MESSAGE =
  'The preview request failed. Retry to load the deterministic fixtures again.';

/**
 * Read-only/permission explanation shown next to disabled mutation controls
 * in catalog previews. Pages render their own domain copy alongside this.
 */
export const EXAMPLE_READ_ONLY_MESSAGE = 'Read-only preview: mutation controls are disabled.';

/**
 * Options for {@link simulateExampleLoad}. Outcomes are always explicit —
 * there is no random failure and no current-time default anywhere.
 */
export interface SimulatedLoadOptions {
  /** When true the returned promise rejects instead of resolving. */
  readonly shouldFail?: boolean;
  /** Rejection message; defaults to {@link EXAMPLE_SIMULATED_ERROR_MESSAGE}. */
  readonly errorMessage?: string;
  /** Fixed delay in milliseconds; defaults to {@link EXAMPLE_SIMULATED_LATENCY_MS}. */
  readonly latencyMs?: number;
}
