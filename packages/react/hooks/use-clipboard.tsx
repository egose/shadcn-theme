'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Copy text to the clipboard and track the copied / error state.
 *
 * @returns `{ copied, copy, error }`:
 *   - `copy(value)` — writes `value` to `navigator.clipboard` and flips
 *     `copied` to `true` for `timeout` ms (default 2000ms).
 *   - `copied` — whether a copy is still "fresh".
 *   - `error` — `Error | null` from a failed write.
 *
 * Only the latest requested write may update feedback. Its success clears
 * `error` and restarts the reset timer; its failure sets `copied` to false,
 * cancels that timer, and sets `error`. Pending writes retain prior feedback
 * until settlement or timer expiry. Unmount cancels the timer and ignores
 * pending completions.
 *
 * @example
 * const { copy, copied } = useClipboard({ timeout: 1500 })
 */
export function useClipboard({ timeout = 2000 }: { timeout?: number } = {}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    return () => {
      requestRef.current += 1;
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string) => {
      const request = ++requestRef.current;

      try {
        await navigator.clipboard.writeText(value);
        if (request !== requestRef.current) return;

        if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
        setCopied(true);
        setError(null);
        resetTimerRef.current = setTimeout(() => {
          resetTimerRef.current = null;
          setCopied(false);
        }, timeout);
      } catch (err) {
        if (request !== requestRef.current) return;
        if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
        setCopied(false);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [timeout],
  );

  return { copied, copy, error };
}
