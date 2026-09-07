'use client';

import { useCallback, useState } from 'react';

import { simulate } from '../../_shared/async-simulation';
import type { SaveStatus, SimulatedOutcomeChoice } from '../types';

/** Fixed delay for simulated saves so the pending state stays observable. */
export const SAVE_DELAY_MS = 400;

/**
 * The deterministic persistence state machine shared by every editable
 * settings section: pristine → unsaved (any edit) → saving → saved | error.
 * Uses `_shared/simulate` — explicit outcome, fixed delay, no randomness.
 */
export function useSaveSection<T>(initial: T, outcome: SimulatedOutcomeChoice) {
  const [draft, setDraft] = useState<T>(initial);
  const [saved, setSaved] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<'saved' | 'error' | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  // A failed save keeps the draft unsaved, but the distinct `error` status
  // takes precedence so the failure is visible and retryable.
  const status: SaveStatus = saving
    ? 'saving'
    : result === 'error'
      ? 'error'
      : dirty
        ? 'unsaved'
        : result === 'saved'
          ? 'saved'
          : 'pristine';

  const update = useCallback((patch: Partial<T>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setResult(null);
  }, []);

  const save = useCallback(async () => {
    if (saving || !dirty) return; // duplicate-submit prevention
    setSaving(true);
    try {
      await simulate(draft, { outcome, delayMs: SAVE_DELAY_MS });
      setSaved(draft);
      setResult('saved');
    } catch {
      // Failed saves keep the draft — the section stays in the error state
      // with its unsaved changes intact.
      setResult('error');
    } finally {
      setSaving(false);
    }
  }, [dirty, draft, outcome, saving]);

  const discard = useCallback(() => {
    setDraft(saved);
    setResult(null);
  }, [saved]);

  return { draft, update, status, save, discard };
}
