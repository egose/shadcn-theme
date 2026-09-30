import { Avatar, AvatarFallback } from '@egose/shadcn-theme/components/ui/avatar';

import { avatarFallbackFor } from '../../_shared/fixtures';
import type { CustomerRecordsModel } from '../use-customers-controller';
import { CustomerActionsMenu, CustomerPlanBadge } from './customer-actions-menu';
import { CustomerStatusBadge } from './customer-status-badge';

export function CustomerCards({ rows, onRename, onArchive }: CustomerRecordsModel) {
  return (
    <ul aria-label="Customers (card list)" className="grid list-none grid-cols-1 gap-3 p-0 md:hidden">

      {rows.map((customer) => (
        <li key={customer.id} className="rounded-md border p-3" data-archived={customer.status === 'archived'}>

          <div className="flex items-start gap-3">

            <Avatar>
                            <AvatarFallback>{avatarFallbackFor(customer.name)}</AvatarFallback>

            </Avatar>

            <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{customer.name}</p>
                            <p className="text-muted-foreground truncate text-xs">{customer.email}</p>

              <div className="mt-1 flex flex-wrap items-center gap-2">

                <CustomerPlanBadge plan={customer.plan} />

                <CustomerStatusBadge status={customer.status} />

                <span className="text-muted-foreground text-xs">Created {customer.createdAt.slice(0, 10)}</span>

              </div>

            </div>

            <CustomerActionsMenu customer={customer} onRename={onRename} onArchive={onArchive} />

          </div>

        </li>
      ))}

    </ul>
  );
}
