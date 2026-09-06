import {
  EXAMPLE_SIMULATED_ERROR_MESSAGE,
  EXAMPLE_SIMULATED_LATENCY_MS,
  SimulatedLoadOptions,
} from './example-view-state';

/**
 * Deterministic async simulator for catalog example previews.
 *
 * Resolves with the given fixtures after a fixed delay, or rejects with a
 * fixed error message when `shouldFail` is set. There is no randomness, no
 * `Date.now()` call, and no live backend: the same options always produce
 * the same outcome, so loading, error, and loaded states render identically
 * across runs and time zones.
 *
 * Pages pass their own already-deterministic fixtures straight through; the
 * simulator only models the async boundary (loading delay, explicit
 * success/failure control) that the planned product flows share.
 */
export function simulateExampleLoad<T>(fixtures: T, options: SimulatedLoadOptions = {}): Promise<T> {
  const latencyMs = options.latencyMs ?? EXAMPLE_SIMULATED_LATENCY_MS;
  const errorMessage = options.errorMessage ?? EXAMPLE_SIMULATED_ERROR_MESSAGE;
  const shouldFail = options.shouldFail ?? false;
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(errorMessage));
      } else {
        resolve(fixtures);
      }
    }, latencyMs);
  });
}
