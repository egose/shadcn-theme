'use client';

import { useState } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Collapsible, CollapsibleContent } from '@egose/shadcn-theme/components/ui/collapsible';

import type { LaunchRequestValues } from '../types';

/**
 * Labeled debug disclosure. The raw JSON state is secondary catalog tooling,
 * not part of the review UI: the panel renders its broad full-form
 * subscription only while open, so the primary surface never pays for it.
 */
export function DebugStatePanel({ control }: { control: Control<LaunchRequestValues> }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-xl border border-dashed p-3">
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(!open)} aria-expanded={open}>
        Debug: raw form state (catalog only, not part of the product UI)
      </Button>
      <CollapsibleContent>{open ? <RawState control={control} /> : null}</CollapsibleContent>
    </Collapsible>
  );
}

function RawState({ control }: { control: Control<LaunchRequestValues> }) {
  const values = useWatch({ control });
  return (
    <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-muted/40 p-3 text-xs leading-5">
      {JSON.stringify(values, (key, value: unknown) => (value instanceof Date ? value.toISOString() : value), 2)}
    </pre>
  );
}
