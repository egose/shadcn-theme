'use client';

import { Button } from '@egose/shadcn-theme/components/ui/button';

import type { SaveStatus } from '../types';

/**
 * Row of save controls plus a persistent, announced status line for one
 * settings section. Success/error are also surfaced where the flow needs
 * them (status text or a destructive alert); this bar always conveys the
 * current SaveStatus as text, never by color alone.
 */
export function SaveBar({ status, onDiscard }: { status: SaveStatus; onDiscard: () => void }) {
  const statusText =
    status === 'pristine'
      ? 'No unsaved changes.'
      : status === 'unsaved'
        ? 'You have unsaved changes.'
        : status === 'saving'
          ? 'Saving…'
          : status === 'saved'
            ? 'Saved.'
            : 'Save failed — your edits were kept.';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit" loading={status === 'saving'} disabled={status !== 'unsaved' && status !== 'error'}>
        Save changes
      </Button>
      {(status === 'unsaved' || status === 'error') && (
        <Button type="button" variant="secondary" appearance="outline" onClick={onDiscard}>
          Discard changes
        </Button>
      )}
      <p role="status" aria-live="polite" className="text-muted-foreground text-sm">
        {statusText}
      </p>
    </div>
  );
}
