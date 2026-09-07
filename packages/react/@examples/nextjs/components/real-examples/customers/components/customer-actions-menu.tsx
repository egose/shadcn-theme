'use client';

import { useRef } from 'react';

import { Badge } from '@egose/shadcn-theme/components/ui/badge';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { ActionMenu, type ActionMenuItem } from '@egose/shadcn-theme/components/widgets/action-menu';
import { MoreHorizontalIcon } from 'lucide-react';

import type { Customer } from '../types';

type CustomerActionsMenuProps = {
  customer: Customer;
  /**
   * The row owns the dialog; the trigger element is passed back so the row
   * can restore keyboard focus when the dialog closes.
   */
  onRename: (customer: Customer, trigger: HTMLButtonElement | null) => void;
  onArchive: (customer: Customer, trigger: HTMLButtonElement | null) => void;
};

/**
 * Per-row actions, shared by the desktop table and the mobile card list so
 * both representations offer identical, keyboard-reachable actions.
 */
export function CustomerActionsMenu({ customer, onRename, onArchive }: CustomerActionsMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  if (!customer.actionsEnabled) {
    // Disabled-row fixture: no menu, but the unavailable action stays
    // visible and announced instead of disappearing.
    return (
      <Button
        type="button"
        variant="secondary"
        appearance="outline-filled"
        size="icon-sm"
        disabled
        aria-label={`Actions for ${customer.name} (unavailable)`}
      >
        <MoreHorizontalIcon aria-hidden />
      </Button>
    );
  }

  const archived = customer.status === 'archived';
  const items: ActionMenuItem[] = [
    { label: 'Rename…', onSelect: () => onRename(customer, triggerRef.current) },
    {
      label: archived ? 'Already archived' : 'Archive…',
      variant: 'destructive',
      disabled: archived,
      onSelect: () => onArchive(customer, triggerRef.current),
    },
    // A clearly disabled item so reviewers can inspect the state.
    { label: 'Export (coming soon)', disabled: true },
  ];

  return (
    <ActionMenu
      items={items}
      trigger={
        <Button
          ref={triggerRef}
          type="button"
          variant="secondary"
          appearance="outline-filled"
          size="icon-sm"
          aria-label={`Actions for ${customer.name}`}
        >
          <MoreHorizontalIcon aria-hidden />
        </Button>
      }
    />
  );
}

/** Plan label rendered as a plain text badge (meaning via text, not color). */
export function CustomerPlanBadge({ plan }: { plan: Customer['plan'] }) {
  const label = plan === 'free' ? 'Free' : plan === 'pro' ? 'Pro' : 'Team';
  return (
    <Badge variant="secondary" appearance="outline">
      {label}
    </Badge>
  );
}
