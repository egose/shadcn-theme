/**
 * Deterministic async simulation for the real examples.
 *
 * Product flows need loading, success, and failure states without a backend.
 * `simulate` is the single convention: an explicit outcome, a fixed delay,
 * and no network access or randomness. Two calls with the same arguments
 * resolve (or reject) identically on every machine and in every time zone,
 * which keeps fixtures reproducible across builds and tests.
 *
 * Server-safe: no 'use client', no React imports.
 */

export type SimulatedOutcome = 'success' | 'failure';

export type SimulateOptions = {
  /** Explicit, deterministic outcome — never inferred or random. */
  outcome: SimulatedOutcome;
  /** Fixed delay in milliseconds so loading UI is observable. Defaults to 400ms. */
  delayMs?: number;
  /** Message used for the rejection on a 'failure' outcome. */
  failureMessage?: string;
};

export type SimulatedError = Error & { __simulated: true };

/** Wait, then resolve with `data` or reject with a tagged error. */
export function simulate<T>(data: T, options: SimulateOptions): Promise<T> {
  const { outcome, delayMs = 400, failureMessage = 'Simulated failure' } = options;
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (outcome === 'success') {
        resolve(data);
        return;
      }
      // Tag simulated errors so example code can distinguish them from real
      // programming errors instead of pattern-matching on the message.
      const error = new Error(failureMessage) as SimulatedError;
      error.__simulated = true;
      reject(error);
    }, delayMs);
  });
}

export function isSimulatedError(error: unknown): error is SimulatedError {
  return error instanceof Error && (error as SimulatedError).__simulated === true;
}
