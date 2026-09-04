'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@egose/shadcn-theme/components/ui/alert-dialog';
import { Button } from '@egose/shadcn-theme/components/ui/button';

import { simulate } from '../../_shared/async-simulation';
import type { SimulatedOutcomeChoice } from '../types';

/** Fixed delay for the simulated deletion request. */
const DELETE_DELAY_MS = 400;

export function DangerZoneSection({ saveOutcome }: { saveOutcome: SimulatedOutcomeChoice }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  // Radix's AlertDialogAction closes the dialog before invoking onClick; this
  // flag distinguishes that confirm-close from a real cancel.
  const confirmedDeleteRef = useRef(false);
  // Focus restoration: the trigger is remembered before the dialog opens.
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);

  function restoreFocus() {
    deleteTriggerRef.current?.focus();
  }

  async function confirmDelete() {
    if (deleting) return; // duplicate-submit prevention
    confirmedDeleteRef.current = true;
    setDeleting(true);
    try {
      await simulate(null, {
        outcome: saveOutcome,
        delayMs: DELETE_DELAY_MS,
        failureMessage: 'Workspace deletion failed',
      });
      setDeleted(true);
      toast.success('Workspace deleted (simulated).');
    } catch {
      toast.error('The workspace could not be deleted. Nothing was removed.');
    } finally {
      setDeleting(false);
      // The action's close request flows through the controlled `onOpenChange`
      // during the pending phase, so close explicitly once it resolves.
      setDialogOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Danger zone</h3>
        <p className="text-muted-foreground text-sm">Irreversible actions for this workspace.</p>
      </div>

      <div className="border-destructive/50 rounded-md border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Delete this workspace</h4>
            <p className="text-muted-foreground max-w-prose text-sm">
              Permanently removes the workspace, all of its projects, settings, and member access. This example
              simulates the request — no real data exists to delete.
            </p>
          </div>
          <Button
            type="button"
            variant="danger"
            disabled={deleted}
            onClick={(event) => {
              deleteTriggerRef.current = event.currentTarget;
              setDialogOpen(true);
            }}
          >
            Delete workspace
          </Button>
        </div>
      </div>

      {/* Persistent deletion outcome (toast is additional feedback, never the only one). */}
      <div aria-live="polite">
        {deleted && (
          <p role="status" className="text-sm font-medium">
            The workspace was deleted (simulated). Reload the page to reset this example.
          </p>
        )}
      </div>

      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (deleting) return; // no dismissing while the request is in flight
          if (open) return;
          if (confirmedDeleteRef.current) {
            confirmedDeleteRef.current = false;
            return;
          }
          setDialogOpen(false);
        }}
      >
        <AlertDialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            restoreFocus();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the workspace and everything in it. Cancel keeps the workspace unchanged; the
              request is simulated by this example.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleting && (
            <p role="status" className="text-sm">
              Deleting workspace…
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction variant="danger" disabled={deleting} onClick={confirmDelete}>
              Delete workspace permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
