import { Avatar, AvatarFallback } from '@egose/shadcn-theme/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@egose/shadcn-theme/components/ui/table';

import { avatarFallbackFor } from '../../_shared/fixtures';
import type { CustomerRecordsModel } from '../use-customers-controller';
import { CustomerActionsMenu, CustomerPlanBadge } from './customer-actions-menu';
import { CustomerStatusBadge } from './customer-status-badge';

export function CustomerTable({ rows, onRename, onArchive }: CustomerRecordsModel) {
  return (
    <div className="hidden md:block">

      <Table>
                <TableCaption>Customer records with plan, status, creation date, and row actions.</TableCaption>

        <TableHeader>

          <TableRow>
                        <TableHead scope="col">Customer</TableHead>
                        <TableHead scope="col">Plan</TableHead>
                        <TableHead scope="col">Status</TableHead>
                        <TableHead scope="col">Created</TableHead>
                        <TableHead scope="col">Actions</TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {rows.map((customer) => (
            <TableRow key={customer.id} data-archived={customer.status === 'archived'}>

              <TableCell>

                <div className="flex min-w-0 items-center gap-2">

                  <Avatar>
                                        <AvatarFallback>{avatarFallbackFor(customer.name)}</AvatarFallback>

                  </Avatar>

                  <div className="min-w-0">
                                        <p className="truncate font-medium">{customer.name}</p>
                                        <p className="text-muted-foreground truncate text-xs">{customer.email}</p>

                  </div>

                </div>

              </TableCell>

              <TableCell>
                <CustomerPlanBadge plan={customer.plan} />
              </TableCell>

              <TableCell>
                <CustomerStatusBadge status={customer.status} />
              </TableCell>
                            <TableCell>{customer.createdAt.slice(0, 10)}</TableCell>

              <TableCell>

                <CustomerActionsMenu customer={customer} onRename={onRename} onArchive={onArchive} />

              </TableCell>

            </TableRow>
          ))}

        </TableBody>

      </Table>

    </div>
  );
}
