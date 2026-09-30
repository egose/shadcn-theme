'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { simulate, type SimulatedOutcome } from '../../_shared/async-simulation';

/** Session-owned exclusion: saves may overlap each other, never deletion.
 * First start wins; rejected operations are not queued. Refs protect same-turn
 * and retained handlers; state supplies the matching visible eligibility.
 */
export function useWorkspaceDeletion(outcome: SimulatedOutcome) {
  const [dialogOpen, updateDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [activeSaves, setActiveSaves] = useState(0);
  const lifecycle = useRef({ saves: 0, deleting: false, deleted: false });

  const beginSave = useCallback(() => {
    if (lifecycle.current.deleting || lifecycle.current.deleted) return false;
    lifecycle.current.saves += 1;
    setActiveSaves((count) => count + 1);
    return true;
  }, []);

  const endSave = useCallback(() => {
    lifecycle.current.saves -= 1;
    setActiveSaves((count) => count - 1);
  }, []);

  const saveBlockedReason = deleted
    ? 'The workspace was deleted. Workspace and Billing changes cannot be saved. Drafts remain available to inspect or discard.'
    : deleting
      ? 'Workspace deletion is pending. Workspace and Billing changes cannot be saved until it finishes.'
      : null;
  const deleteBlockedReason = deleted
    ? 'The workspace was already deleted. Reload the page to reset this example.'
    : deleting
      ? 'Workspace deletion is pending.'
      : activeSaves > 0
        ? 'Wait for Workspace and Billing saves to finish before deleting the workspace. Then try deletion again.'
        : null;

  function setDialogOpen(open: boolean) {
    if (lifecycle.current.deleting) return;
    if (open && (lifecycle.current.deleted || lifecycle.current.saves > 0)) return;
    updateDialogOpen(open);
  }

  async function confirmDelete() {
    if (lifecycle.current.deleting || lifecycle.current.deleted || lifecycle.current.saves > 0) return;
    lifecycle.current.deleting = true;
    setDeleting(true);
    try {
      await simulate(null, { outcome, failureMessage: 'Workspace deletion failed' });
      lifecycle.current.deleted = true;
      setDeleted(true);
      setFailure(null);
      toast.success('Workspace deleted (simulated).');
    } catch {
      setFailure('The workspace could not be deleted. Nothing was removed. Retry when you are ready.');
      toast.error('The workspace could not be deleted. Nothing was removed.');
    } finally {
      lifecycle.current.deleting = false;
      setDeleting(false);
      updateDialogOpen(false);
    }
  }

  function onOpenChange(open: boolean) {
    if (open) return;
    setDialogOpen(false);
  }

  return {
    dialogOpen,
    setDialogOpen,
    deleting,
    deleted,
    failure,
    confirmDelete,
    onOpenChange,
    beginSave,
    endSave,
    saveBlockedReason,
    deleteBlockedReason,
  };
}
