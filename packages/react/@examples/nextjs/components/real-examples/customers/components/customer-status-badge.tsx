'use client';

import { Badge, type BadgeVariant } from '@egose/shadcn-theme/components/ui/badge';

import type { CustomerStatus } from '../types';

const STATUS_VARIANT: Record<CustomerStatus, BadgeVariant> = {
  active: 'success',
  invited: 'warning',
  archived: 'muted',
};

const STATUS_TEXT: Record<CustomerStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  archived: 'Archived',
};

/**
 * Status badge where the meaning is carried by the text, not color alone.
 * Example-local: generic enough to promote later, but currently owned by
 * the customers flow.
 */
export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_TEXT[status]}</Badge>;
}
