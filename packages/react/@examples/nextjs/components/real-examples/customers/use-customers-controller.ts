'use client';

import { useRef, useState } from 'react';

import { useDebouncedValue } from '@egose/shadcn-theme/hooks/use-debounced-value';

import { simulate, type SimulatedOutcome } from '../_shared/async-simulation';
import type { ExampleState } from '../_shared/example-state-toolbar';
import { FIXTURE_NOW, stableId } from '../_shared/fixtures';
import { CUSTOMERS } from './fixtures';
import type { Customer, CustomerPlan, CustomerStatus } from './types';

/** Search tests advance this delay to verify deferred filtering. */
export const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE = 5;

export type StatusFilter = 'all' | CustomerStatus;
export type PlanFilter = 'all' | CustomerPlan;

type PendingMutation =
  | { kind: 'add' }
  | { kind: 'rename'; customer: Customer }
  | { kind: 'archive'; customer: Customer };

type MutationNotice = { kind: 'success' | 'failure'; text: string };

/** Mounted customer session: one dataset, filter/page calculation and mutation policy. */
export function useCustomersController() {
  const [viewState, setViewState] = useState<ExampleState>('loaded');
  const [customers, setCustomers] = useState<Customer[]>(() => CUSTOMERS.map((customer) => ({ ...customer })));
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
  const [page, setPage] = useState(1);
  const [mutation, setMutation] = useState<PendingMutation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<MutationNotice | null>(null);
  const [simulatedOutcome, setSimulatedOutcome] = useState<SimulatedOutcome>('success');

  // Prefer the row/header opener, then search when filtering removes the row.
  // The persistent result region also survives catalog Loading/Error previews.
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const inFlightRef = useRef(false);

  function restoreFocus() {
    const trigger = previousFocusRef.current;
    if (trigger?.isConnected && !trigger.matches(':disabled, [aria-disabled="true"]')) trigger.focus();
    // Responsive table/card openers can stay connected but become CSS-hidden.
    // A browser then ignores focus(), so verify it succeeded before returning.
    if (!trigger || trigger.ownerDocument.activeElement !== trigger) (searchRef.current ?? resultRef.current)?.focus();
    previousFocusRef.current = null;
  }

  function openMutation(next: PendingMutation, trigger: HTMLElement | null) {
    previousFocusRef.current = trigger ?? null;
    setNotice(null);
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

  function changeViewState(next: ExampleState) {
    if (next === 'empty') {
      setCustomers([]);
      resetFilters();
      setNotice(null);
    }
    setViewState(next);
  }

  async function submitName(name: string) {
    if (!mutation || mutation.kind === 'archive' || inFlightRef.current) return;
    inFlightRef.current = true;
    const current = mutation;
    setSubmitting(true);
    setNotice(null);
    try {
      await simulate(name, { outcome: simulatedOutcome });
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
        setViewState('loaded');
      }
      completeMutation();
    } catch {
      const verb = current.kind === 'rename' ? 'rename' : 'add';
      setNotice({ kind: 'failure', text: `Could not ${verb} the customer. No changes were made — try again.` });
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  }

  async function confirmArchive() {
    if (!mutation || mutation.kind !== 'archive' || inFlightRef.current) return;
    inFlightRef.current = true;
    const customer = mutation.customer;
    setSubmitting(true);
    try {
      await simulate(customer.id, { outcome: simulatedOutcome });
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
      inFlightRef.current = false;
      setSubmitting(false);
    }
  }

  return {
    viewState,
    changeViewState,
    simulatedOutcome,
    setSimulatedOutcome,
    mutation,
    submitting,
    notice,
    resultRef,
    searchRef,
    cancelMutation,
    submitName,
    confirmArchive,
    restoreFocus,
    list: {
      customerCount: customers.length,
      filteredCount: filtered.length,
      query,
      statusFilter,
      planFilter,
      page: safePage,
      pageCount,
      rangeStart,
      rangeEnd,
      onPageChange: setPage,
      onQueryChange: (value: string) => {
        setQuery(value);
        setPage(1);
      },
      onStatusChange: (value: StatusFilter) => {
        setStatusFilter(value);
        setPage(1);
      },
      onPlanChange: (value: PlanFilter) => {
        setPlanFilter(value);
        setPage(1);
      },
      onResetFilters: resetFilters,
      onAdd: (trigger: HTMLElement) => openMutation({ kind: 'add' }, trigger),
      records: {
        rows: pageRows,
        onRename: (customer: Customer, trigger: HTMLElement | null) =>
          openMutation({ kind: 'rename', customer }, trigger),
        onArchive: (customer: Customer, trigger: HTMLElement | null) =>
          openMutation({ kind: 'archive', customer }, trigger),
      },
    },
  };
}

export type CustomersController = ReturnType<typeof useCustomersController>;
export type CustomerRecordsModel = CustomersController['list']['records'];
