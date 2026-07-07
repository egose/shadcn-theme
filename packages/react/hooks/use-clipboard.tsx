import { useState, useCallback } from 'react';

/**
 * Copy text to the clipboard and track the copied / error state.
 *
 * @returns `{ copied, copy, error }`:
 *   - `copy(value)` — writes `value` to `navigator.clipboard` and flips
 *     `copied` to `true` for `timeout` ms (default 2000ms).
 *   - `copied` — whether a copy is still "fresh".
 *   - `error` — `Error | null` from a failed write.
 *
 * @example
 * const { copy, copied } = useClipboard({ timeout: 1500 })
 */
export function useClipboard({ timeout = 2000 }: { timeout?: number } = {}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setError(null);
        setTimeout(() => setCopied(false), timeout);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [timeout],
  );

  return { copied, copy, error };
}
