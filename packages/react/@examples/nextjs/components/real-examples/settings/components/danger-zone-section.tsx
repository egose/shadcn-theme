'use client';

import { useRef } from 'react';

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
import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';

import type { SettingsSession } from '../use-settings-session';

export function DangerZoneSection({
  state,
  onFocusFallback,
}: {
  state: SettingsSession['deletion'];
  onFocusFallback: () => void;
}) {
  const { dialogOpen, setDialogOpen, deleting, deleted, failure, confirmDelete, onOpenChange, deleteBlockedReason } =
    state;
  // Focus restoration: the trigger is remembered before the dialog opens.
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const resultRef = useRef<HTMLParagraphElement | null>(null);

  function restoreFocus() {
    const trigger = deleteTriggerRef.current;
    if (trigger?.isConnected && !trigger.disabled) trigger.focus();
    else if (resultRef.current) resultRef.current.focus();
    else onFocusFallback();
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
              simulates the request — no real data exists to delete. Account Profile and inbox preferences remain
              available.
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            disabled={!!deleteBlockedReason}
            aria-describedby={deleteBlockedReason ? 'settings-delete-reason' : undefined}
            onClick={(event) => {
              deleteTriggerRef.current = event.currentTarget;
              setDialogOpen(true);
            }}
          >
            Delete workspace
          </Button>
        </div>

        {deleteBlockedReason && (
          <p id="settings-delete-reason" role="status" className="text-muted-foreground mt-3 text-sm">
            {deleteBlockedReason}
          </p>
        )}
      </div>
      {/* Persistent deletion outcome (toast is additional feedback, never the only one). */}

      <div aria-live="polite">
        {deleted && (
          <p ref={resultRef} tabIndex={-1} role="status" className="text-sm font-medium">
            The workspace was deleted (simulated). Reload the page to reset this example.
          </p>
        )}

        {failure && (
          <Alert variant="destructive">
            <AlertTitle>Workspace deletion failed</AlertTitle>

            <AlertDescription>
              <p>{failure}</p>

              <Button
                type="button"
                variant="secondary"
                disabled={!!deleteBlockedReason}
                aria-describedby={deleteBlockedReason ? 'settings-delete-reason' : undefined}
                onClick={(event) => {
                  deleteTriggerRef.current = event.currentTarget;
                  setDialogOpen(true);
                }}
              >
                Retry deletion
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={onOpenChange}>
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

          {deleteBlockedReason && (
            <p id="settings-delete-confirm-reason" className="text-muted-foreground text-sm">
              {deleteBlockedReason}
            </p>
          )}

          {deleting && (
            <p role="status" className="text-sm">
              Deleting workspace…
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              variant="danger"
              disabled={!!deleteBlockedReason}
              aria-describedby={deleteBlockedReason ? 'settings-delete-confirm-reason' : undefined}
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
            >
              Delete workspace permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
