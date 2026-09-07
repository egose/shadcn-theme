import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@egose/shadcn-theme/components/ui/table';

import { orders } from '../fixtures';

export default function TableShowcase() {
  return (
    <ExamplePage title="Table" description="Tables are best for structured, comparable data with predictable columns.">
      <ExampleSection title="Billing snapshot">
        <Table>
          <TableCaption>Recent subscription renewals</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.customer}>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.plan}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell className="text-right">{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$8,460</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ExampleSection>
    </ExamplePage>
  );
}
