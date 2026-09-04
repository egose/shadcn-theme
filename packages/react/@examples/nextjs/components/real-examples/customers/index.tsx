'use client';

import { useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@egose/shadcn-theme/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Avatar, AvatarFallback } from '@egose/shadcn-theme/components/ui/avatar';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@egose/shadcn-theme/components/ui/native-select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@egose/shadcn-theme/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@egose/shadcn-theme/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@egose/shadcn-theme/components/ui/toggle-group';
import { PageHeader } from '@egose/shadcn-theme/components/widgets/page-header';
import { useDebouncedValue } from '@egose/shadcn-theme/hooks/use-debounced-value';

import { ExamplePage } from '@/components/showcase-shell';
import { simulate } from '../_shared/async-simulation';
import { ExampleStateToolbar, type ExampleState } from '../_shared/example-state-toolbar';
import { avatarFallbackFor, FIXTURE_NOW, stableId } from '../_shared/fixtures';

import { CustomerActionsMenu, CustomerPlanBadge } from './components/customer-actions-menu';
import { CustomerNameDialog } from './components/customer-name-dialog';
import { CustomerStatusBadge } from './components/customer-status-badge';
import { CUSTOMERS } from './fixtures';
import type { Customer, CustomerPlan, CustomerStatus, MutationOutcome } from './types';

/**
 * Documented debounce delay for search filtering. Tests advance fake timers
 * by exactly this amount to verify filtering recomputes only after it.
 */
export const SEARCH_DEBOUNCE_MS = 300;

const PAGE_SIZE = 5;
/** Fixed delay for simulated mutations (keeps pending states observable). */
const MUTATION_DELAY_MS = 400;

type StatusFilter = 'all' | CustomerStatus;
type PlanFilter = 'all' | CustomerPlan;

type PendingMutation =
  | { kind: 'add' }
  | { kind: 'rename'; customer: Customer }
  | { kind: 'archive'; customer: Customer };

type MutationNotice = { kind: 'success' | 'failure'; text: string };

const NO_CUSTOMERS_MESSAGE = 'No customers match the current filters.';

export default function CustomersExample() {
  const [viewState, setViewState] = useState<ExampleState>('loaded');
  // Single resource model — desktop table and mobile cards render from the
  // same state; there is exactly one fixture/mutation source of truth.
  const [customers, setCustomers] = useState<Customer[]>(() => CUSTOMERS.map((customer) => ({ ...customer })));
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
  const [page, setPage] = useState(1);
  const [mutation, setMutation] = useState<PendingMutation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<MutationNotice | null>(null);
  // Catalog control: which deterministic outcome simulated mutations return.
  const [simulatedOutcome, setSimulatedOutcome] = useState<MutationOutcome>('success');

  // Focus restoration: Radix's default close-behavior targets the menu item
  // that opened the dialog, which is already unmounted, so the dialogs
  // prevent the default and focus this element instead.
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // Radix's AlertDialogAction closes the dialog before invoking onClick; this
  // flag distinguishes that confirm-close from a real cancel.
  const confirmedArchiveRef = useRef(false);

  function restoreFocus() {
    previousFocusRef.current?.focus();
  }

  function openMutation(next: PendingMutation, trigger: HTMLElement | null) {
    previousFocusRef.current = trigger ?? null;
    setMutation(next);
  }

  function cancelMutation() {
    setMutation(null);
  }

  function completeMutation() {
    setMutation(null);
  }

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const filtered = customers.filter((customer) => {
    if (statusFilter !== 'all' && customer.status !== statusFilter) return false;
    if (planFilter !== 'all' && customer.plan !== planFilter) return false;
    if (normalizedQuery.length === 0) return true;
    return (
      customer.name.toLowerCase().includes(normalizedQuery) || customer.email.toLowerCase().includes(normalizedQuery)
    );
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = (safePage - 1) * PAGE_SIZE + pageRows.length;

  function resetFilters() {
    setQuery('');
    setStatusFilter('all');
    setPlanFilter('all');
    setPage(1);
  }

  async function submitName(name: string) {
    if (!mutation || mutation.kind === 'archive' || submitting) return; // duplicate-submit prevention
    const current = mutation;
    setSubmitting(true);
    try {
      await simulate(name, { outcome: simulatedOutcome, delayMs: MUTATION_DELAY_MS });
      if (current.kind === 'rename') {
        const previousName = current.customer.name;
        setCustomers((list) => list.map((c) => (c.id === current.customer.id ? { ...c, name } : c)));
        setNotice({ kind: 'success', text: `Renamed ${previousName} to ${name}.` });
      } else {
        const created: Customer = {
          id: stableId('customer', customers.length + 1),
          name,
          email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@example.com`,
          plan: 'free',
          status: 'active',
          createdAt: FIXTURE_NOW,
          actionsEnabled: true,
        };
        setCustomers((list) => [...list, created]);
        setNotice({ kind: 'success', text: `Added ${name}.` });
      }
      completeMutation();
    } catch {
      const verb = current.kind === 'rename' ? 'rename' : 'add';
      setNotice({ kind: 'failure', text: `Could not ${verb} the customer. No changes were made — try again.` });
      completeMutation();
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmArchive() {
    if (!mutation || mutation.kind !== 'archive' || submitting) return;
    confirmedArchiveRef.current = true;
    const customer = mutation.customer;
    setSubmitting(true);
    try {
      await simulate(customer.id, { outcome: simulatedOutcome, delayMs: MUTATION_DELAY_MS });
      setCustomers((list) => list.map((c) => (c.id === customer.id ? { ...c, status: 'archived' } : c)));
      setNotice({ kind: 'success', text: `Archived ${customer.name}.` });
      completeMutation();
    } catch {
      setNotice({
        kind: 'failure',
        text: `Could not archive ${customer.name}. No changes were made — try again.`,
      });
      completeMutation();
    } finally {
      setSubmitting(false);
    }
  }

  const searchLabelId = 'customer-search-label';
  const statusLabelId = 'customer-status-filter-label';
  const planLabelId = 'customer-plan-filter-label';

  return (
    <ExamplePage
      title="Customer Resource Management"
      description="The product area below is the example: search, filters, pagination, and row mutations over one customer list. The surrounding catalog chrome is not part of it."
    >
      <ExampleStateToolbar value={viewState} onValueChange={setViewState} />

      {/* Catalog tooling: lets a reviewer pick the deterministic mutation outcome. */}
      <div
        role="group"
        aria-label="Simulated mutation outcome (catalog control, not part of the product surface)"
        className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2 text-sm"
      >
        <span className="text-muted-foreground text-xs">Simulated mutation outcome:</span>
        <ToggleGroup
          type="single"
          value={simulatedOutcome}
          onValueChange={(value) => value && setSimulatedOutcome(value as MutationOutcome)}
        >
          <ToggleGroupItem value="success" aria-label="Simulate success">
            Success
          </ToggleGroupItem>
          <ToggleGroupItem value="failure" aria-label="Simulate failure">
            Failure
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewState === 'loading' && <p role="status">Loading customers…</p>}

      {viewState === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Customers could not be loaded</AlertTitle>
          <AlertDescription>
            <p>Something went wrong while loading the customer list. Retry to load it again.</p>
            <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => setViewState('loaded')}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {viewState === 'empty' && <p role="status">No customers yet. Add the first customer to get started.</p>}

      {viewState === 'loaded' && (
        <div className="space-y-4">
          <PageHeader
            title="Customers"
            description="Search, filter, and manage customer records."
            actions={
              <Button type="button" onClick={(event) => openMutation({ kind: 'add' }, event.currentTarget)}>
                Add customer
              </Button>
            }
          />

          {/* Persistent, visible result of the last mutation (not toast-only). */}
          <div aria-live="polite">
            {notice?.kind === 'success' && (
              <p role="status" className="text-sm font-medium">
                {notice.text}
              </p>
            )}
            {notice?.kind === 'failure' && (
              <Alert variant="destructive">
                <AlertTitle>Customer update failed</AlertTitle>
                <AlertDescription>{notice.text}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label id={searchLabelId} htmlFor="customer-search">
                Search customers
              </Label>
              <Input
                id="customer-search"
                type="search"
                aria-labelledby={searchLabelId}
                placeholder="Name or email"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-1">
              <Label id={statusLabelId}>Filter by status</Label>
              <NativeSelect
                aria-labelledby={statusLabelId}
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  setPage(1);
                }}
              >
                <NativeSelectOption value="all">All statuses</NativeSelectOption>
                <NativeSelectOption value="active">Active</NativeSelectOption>
                <NativeSelectOption value="invited">Invited</NativeSelectOption>
                <NativeSelectOption value="archived">Archived</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="space-y-1">
              <Label id={planLabelId}>Filter by plan</Label>
              <NativeSelect
                aria-labelledby={planLabelId}
                value={planFilter}
                onChange={(event) => {
                  setPlanFilter(event.target.value as PlanFilter);
                  setPage(1);
                }}
              >
                <NativeSelectOption value="all">All plans</NativeSelectOption>
                <NativeSelectOption value="free">Free</NativeSelectOption>
                <NativeSelectOption value="pro">Pro</NativeSelectOption>
                <NativeSelectOption value="team">Team</NativeSelectOption>
              </NativeSelect>
            </div>
            <Button type="button" variant="secondary" appearance="outline" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>

          {/* Result count announced politely whenever it changes. */}
          <p role="status" aria-live="polite" className="text-muted-foreground text-sm">
            {filtered.length === 1 ? '1 customer' : `${filtered.length} customers`}
            {filtered.length > 0 && ` — showing ${rangeStart}\u2013${rangeEnd}`}
          </p>

          {filtered.length === 0 && <p role="status">{NO_CUSTOMERS_MESSAGE}</p>}

          {filtered.length > 0 && (
            <>
              {/* Desktop: semantic, captioned table. */}
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
                    {pageRows.map((customer) => (
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
                          <CustomerActionsMenu
                            customer={customer}
                            onRename={(c, trigger) => openMutation({ kind: 'rename', customer: c }, trigger)}
                            onArchive={(c, trigger) => openMutation({ kind: 'archive', customer: c }, trigger)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: same data, intentional card list representation. */}
              <ul aria-label="Customers (card list)" className="grid list-none grid-cols-1 gap-3 p-0 md:hidden">
                {pageRows.map((customer) => (
                  <li
                    key={customer.id}
                    className="rounded-md border p-3"
                    data-archived={customer.status === 'archived'}
                  >
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
                          <span className="text-muted-foreground text-xs">
                            Created {customer.createdAt.slice(0, 10)}
                          </span>
                        </div>
                      </div>
                      <CustomerActionsMenu
                        customer={customer}
                        onRename={(c, trigger) => openMutation({ kind: 'rename', customer: c }, trigger)}
                        onArchive={(c, trigger) => openMutation({ kind: 'archive', customer: c }, trigger)}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              {pageCount > 1 && (
                <Pagination aria-label="Customer pages">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#customers"
                        aria-disabled={safePage === 1}
                        className={safePage === 1 ? 'pointer-events-none opacity-50' : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          if (safePage > 1) setPage(safePage - 1);
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#customers"
                          isActive={pageNumber === safePage}
                          onClick={(event) => {
                            event.preventDefault();
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#customers"
                        aria-disabled={safePage === pageCount}
                        className={safePage === pageCount ? 'pointer-events-none opacity-50' : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          if (safePage < pageCount) setPage(safePage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      )}

      {mutation !== null && mutation.kind !== 'archive' && (
        <CustomerNameDialog
          mode={mutation.kind}
          initialName={mutation.kind === 'rename' ? mutation.customer.name : ''}
          submitting={submitting}
          onCancel={cancelMutation}
          onSubmit={submitName}
          onRestoreFocus={restoreFocus}
        />
      )}

      {mutation !== null && mutation.kind === 'archive' && (
        <AlertDialog
          open
          onOpenChange={(open) => {
            if (submitting) return; // no dismissing while the request is in flight
            if (open) return;
            if (confirmedArchiveRef.current) {
              confirmedArchiveRef.current = false;
              return;
            }
            cancelMutation();
          }}
        >
          <AlertDialogContent
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              restoreFocus();
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Archive {mutation.customer.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Archived customers are removed from active views but their records are kept. This example simulates the
                archive request. Cancel keeps the customer unchanged.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {submitting && (
              <p role="status" className="text-sm">
                Archiving customer…
              </p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={submitting} onClick={cancelMutation}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction variant="danger" disabled={submitting} onClick={confirmArchive}>
                Archive customer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ExamplePage>
  );
}
