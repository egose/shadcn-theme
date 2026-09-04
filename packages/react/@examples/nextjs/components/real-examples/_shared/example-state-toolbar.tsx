'use client';

import { Badge } from '@egose/shadcn-theme/components/ui/badge';
import { Button } from '@egose/shadcn-theme/components/ui/button';

/**
 * Catalog state tooling — switches a real example between its inspectable
 * states (loading, empty, error, loaded).
 *
 * This is deliberately labeled and visually separated catalog tooling; it is
 * NOT part of the product surface being demonstrated. Flows use it as the
 * single owner of the active showcase state so every state can be inspected
 * deterministically without a backend (see `_shared/async-simulation.ts`).
 */

export type ExampleState = 'loading' | 'empty' | 'error' | 'loaded';

const ALL_STATES: readonly ExampleState[] = ['loading', 'empty', 'error', 'loaded'];

const STATE_LABELS: Record<ExampleState, string> = {
  loading: 'Loading',
  empty: 'Empty',
  error: 'Error',
  loaded: 'Loaded',
};

type ExampleStateToolbarProps = {
  /** Currently active state. */
  value: ExampleState;
  /** Called with the newly selected state. */
  onValueChange: (state: ExampleState) => void;
  /** Restrict the offered states; defaults to all four. */
  states?: readonly ExampleState[];
};

export function ExampleStateToolbar({ value, onValueChange, states = ALL_STATES }: ExampleStateToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Example state tooling (catalog only, not part of the product surface)"
      className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2"
    >
      <Badge variant="muted">Catalog state tooling</Badge>
      <p className="text-muted-foreground text-xs">Preview controls — not part of the product UI.</p>
      <div className="ml-auto flex flex-wrap gap-1">
        {states.map((state) => (
          <Button
            key={state}
            type="button"
            size="sm"
            variant={state === value ? 'secondary' : 'ghost'}
            aria-pressed={state === value}
            onClick={() => onValueChange(state)}
          >
            {STATE_LABELS[state]}
          </Button>
        ))}
      </div>
    </div>
  );
}
