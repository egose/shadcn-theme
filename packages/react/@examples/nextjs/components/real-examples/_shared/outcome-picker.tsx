'use client';

import { useId } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@egose/shadcn-theme/components/ui/toggle-group';

import type { SimulatedOutcome } from './async-simulation';

type OutcomePickerProps = {
  label: string;
  value: SimulatedOutcome;
  onValueChange: (value: SimulatedOutcome) => void;
  /** Optional operation name for distinct controls, e.g. "save" in settings. */
  operation?: string;
};

/** Catalog-only tooling. A selection is required; activating it again cannot clear it. */
export function OutcomePicker({ label, value, onValueChange, operation }: OutcomePickerProps) {
  const labelId = useId();
  const descriptionId = useId();
  const action = operation ? `Simulate ${operation}` : 'Simulate';

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2 text-sm">
      <span id={labelId} className="text-muted-foreground text-xs">
        {label}:
      </span>

      <span id={descriptionId} className="sr-only">
        Catalog control, not part of the product surface.
      </span>

      <ToggleGroup
        type="single"
        role="radiogroup"
        value={value}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        onValueChange={(next) => {
          if (next === 'success' || next === 'failure') onValueChange(next);
        }}
      >
        <ToggleGroupItem value="success" aria-label={`${action} success`}>
          Success
        </ToggleGroupItem>

        <ToggleGroupItem value="failure" aria-label={`${action} failure`}>
          Failure
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
