'use client';

import { useCallback, useRef, useState } from 'react';

import { simulate, type SimulatedOutcome } from '../../_shared/async-simulation';
import type { SaveStatus } from '../types';

/** Only Workspace/Billing participate in the session's deletion boundary. */
type WorkspaceSaveAccess = {
  beginSave: () => boolean;
  endSave: () => void;
  saveBlockedReason: string | null;
};

/**
 * The deterministic persistence state machine shared by every editable
 * settings section: pristine → unsaved (any edit) → saving → saved | error.
 * Uses `_shared/simulate` — explicit outcome, fixed delay, no randomness.
 * Called above the switchable views by useSettingsSession. A save captures
 * its draft/outcome at invocation; newer edits stay live and unsaved when it
 * settles. Failure leaves the previous saved baseline available to discard.
 */
export function useSaveSection<T>(initial: T, outcome: SimulatedOutcome, workspace?: WorkspaceSaveAccess) {
  const { beginSave, endSave, saveBlockedReason = null } = workspace ?? {};
  const [draft, setDraft] = useState<T>(initial);
  const [saved, setSaved] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);
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
    if (inFlight.current || !dirty) return;
    if (beginSave && !beginSave()) return;
    inFlight.current = true;
    setSaving(true);
    try {
      await simulate(draft, { outcome });
      setSaved(draft);
      setResult('saved');
    } catch {
      // Failed saves keep the draft — the section stays in the error state
      // with its unsaved changes intact.
      setResult('error');
    } finally {
      endSave?.();
      inFlight.current = false;
      setSaving(false);
    }
  }, [dirty, draft, outcome, beginSave, endSave]);

  const discard = useCallback(() => {
    setDraft(saved);
    setResult(null);
  }, [saved]);

  return { draft, update, status, save, discard, saveBlockedReason };
}
