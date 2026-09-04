'use client';

import { useState } from 'react';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@egose/shadcn-theme/components/ui/dialog';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';

type CustomerNameDialogProps = {
  /** When null the dialog is unmounted. */
  mode: 'add' | 'rename';
  initialName: string;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (name: string) => void;
  /** Focus target after the dialog closes (Radix's default target is the row menu item, which is already unmounted). */
  onRestoreFocus: () => void;
};

/**
 * Single text-input dialog used for both "Add customer" and "Rename".
 * Validation is local and deterministic: a blank name shows an inline
 * alert and keeps the dialog open.
 */
export function CustomerNameDialog({
  mode,
  initialName,
  submitting,
  onCancel,
  onSubmit,
  onRestoreFocus,
}: CustomerNameDialogProps) {
  // The dialog unmounts when a session closes, so initial state is fresh
  // each time it opens.
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError('Enter a customer name.');
      return;
    }
    onSubmit(trimmed);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (submitting) return; // no dismissing while the request is in flight
        if (!open) onCancel();
      }}
    >
      <DialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onRestoreFocus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add customer' : `Rename ${initialName}`}</DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? 'Create a customer record. This example simulates the save — no backend is contacted.'
              : 'The new name is saved to this session only.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="customer-name">Customer name</Label>
          <Input
            id="customer-name"
            value={name}
            autoFocus
            disabled={submitting}
            aria-invalid={error !== null}
            aria-describedby={error !== null ? 'customer-name-error' : undefined}
            onChange={(event) => {
              setName(event.target.value);
              if (error !== null) setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                submit();
              }
            }}
          />
          {error !== null && (
            <p id="customer-name-error" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {submitting && (
            <p role="status" className="text-sm">
              Saving customer…
            </p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" disabled={submitting} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" loading={submitting} onClick={submit}>
            {mode === 'add' ? 'Add customer' : 'Save name'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
