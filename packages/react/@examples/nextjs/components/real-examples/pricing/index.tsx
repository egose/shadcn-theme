'use client';

import { useEffect, useRef, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@egose/shadcn-theme/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@egose/shadcn-theme/components/ui/dialog';
import { Separator } from '@egose/shadcn-theme/components/ui/separator';
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

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { simulate } from '../_shared/async-simulation';
import { ExampleStateToolbar, type ExampleState } from '../_shared/example-state-toolbar';

import { PlanCard } from './components/plan-card';
import { COMPARISON_ROWS, CURRENT_PLAN_ID, FAQ_ENTRIES, PLANS } from './fixtures';
import type { BillingPeriod, Plan, PlanId, UpgradeOutcome } from './types';

/** Fixed delay for the simulated plan-change request (keeps loading states observable). */
const PLAN_CHANGE_DELAY_MS = 400;

type ChangeResult = { kind: 'success'; planName: string } | { kind: 'failure'; message: string };

export default function PricingExample() {
  const [viewState, setViewState] = useState<ExampleState>('loaded');
  const [billing, setBilling] = useState<BillingPeriod>('monthly');
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>(CURRENT_PLAN_ID);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ChangeResult | null>(null);
  // Catalog control: which deterministic outcome the simulated request returns.
  const [simulatedOutcome, setSimulatedOutcome] = useState<UpgradeOutcome>('success');
  // Focus restoration: remember the button that opened the confirmation dialog
  // and return focus to it when the dialog is cancelled.
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  function openDialog(plan: Plan, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setSelectedPlan(plan);
  }

  function cancelDialog() {
    setSelectedPlan(null);
    restoreFocusRef.current = true;
  }

  const restoreFocusRef = useRef(false);

  // Focus restoration: after the dialog unmounts (so Radix focus management is
  // done), return focus to the "Choose <plan>" button that opened it.
  useEffect(() => {
    if (selectedPlan === null && restoreFocusRef.current && lastTriggerRef.current) {
      const trigger = lastTriggerRef.current;
      requestAnimationFrame(() => trigger.focus());
    }
    if (selectedPlan === null) {
      lastTriggerRef.current = null;
      restoreFocusRef.current = false;
    }
  }, [selectedPlan]);

  async function confirmPlanChange() {
    if (!selectedPlan || submitting) return; // duplicate-submit prevention
    const plan = selectedPlan;
    setSubmitting(true);
    try {
      await simulate(plan.id, { outcome: simulatedOutcome, delayMs: PLAN_CHANGE_DELAY_MS });
      setCurrentPlanId(plan.id);
      setResult({ kind: 'success', planName: plan.name });
      setSelectedPlan(null);
      lastTriggerRef.current = null;
    } catch {
      setResult({
        kind: 'failure',
        message: `We could not change your plan to ${plan.name}. No changes were made — try again.`,
      });
      setSelectedPlan(null);
      lastTriggerRef.current = null;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ExamplePage
      title="Pricing and Plan Selection"
      description="A framed product preview: the plan cards, comparison table, FAQ, and confirmation dialog below are the example. The surrounding catalog sidebar and header are not part of it."
    >
      <ExampleStateToolbar value={viewState} onValueChange={setViewState} />

      {/* Catalog tooling: lets a reviewer pick the deterministic request outcome. */}
      <div
        role="group"
        aria-label="Simulated plan-change outcome (catalog control, not part of the product surface)"
        className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2 text-sm"
      >
        <span className="text-muted-foreground text-xs">Simulated plan-change outcome:</span>
        <ToggleGroup
          type="single"
          value={simulatedOutcome}
          onValueChange={(value) => value && setSimulatedOutcome(value as UpgradeOutcome)}
        >
          <ToggleGroupItem value="success" aria-label="Simulate success">
            Success
          </ToggleGroupItem>
          <ToggleGroupItem value="failure" aria-label="Simulate failure">
            Failure
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewState === 'loading' && <p role="status">Loading plans…</p>}

      {viewState === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Plans could not be loaded</AlertTitle>
          <AlertDescription>
            <p>Something went wrong while loading pricing. Retry to load the plans again.</p>
            <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => setViewState('loaded')}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {viewState === 'empty' && <p role="status">No plans are available right now. Check back later.</p>}

      {viewState === 'loaded' && (
        <>
          {/* Persistent, visible outcome of the last plan change (not toast-only). */}
          <div aria-live="polite">
            {result?.kind === 'success' && (
              <p role="status" className="text-sm font-medium">
                Your plan is now {result.planName}.
              </p>
            )}
            {result?.kind === 'failure' && (
              <Alert variant="destructive">
                <AlertTitle>Plan change failed</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <div role="group" aria-labelledby="billing-toggle-label" className="flex flex-wrap items-center gap-3">
            <span id="billing-toggle-label" className="text-sm font-medium">
              Billing period
            </span>
            <ToggleGroup
              type="single"
              variant="outline"
              value={billing}
              aria-labelledby="billing-toggle-label"
              onValueChange={(value) => value && setBilling(value as BillingPeriod)}
            >
              <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
              <ToggleGroupItem value="annual">Annual</ToggleGroupItem>
            </ToggleGroup>
            <span className="text-muted-foreground text-sm">
              {billing === 'annual'
                ? 'Annual billing selected — per-month prices reflect the annual discount.'
                : 'Switch to annual billing to save up to 18%.'}
            </span>
          </div>

          <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
            {PLANS.map((plan) => (
              <li key={plan.id}>
                <PlanCard
                  plan={plan}
                  billing={billing}
                  isCurrent={plan.id === currentPlanId}
                  busy={submitting}
                  onSelect={openDialog}
                />
              </li>
            ))}
          </ul>

          <Separator />

          <ExampleSection
            title="Compare plans"
            description="All values are fixed example data. The table scrolls horizontally on narrow screens."
          >
            <div
              role="region"
              aria-label="Plan feature comparison, scrollable horizontally"
              tabIndex={0}
              className="overflow-x-auto"
            >
              <Table>
                <TableCaption>Feature comparison across the Starter, Growth, and Scale plans.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Feature</TableHead>
                    {PLANS.map((plan) => (
                      <TableHead key={plan.id} scope="col">
                        {plan.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARISON_ROWS.map((row) => (
                    <TableRow key={row.feature}>
                      <TableHead scope="row" className="font-normal">
                        {row.feature}
                      </TableHead>
                      {PLANS.map((plan) => (
                        <TableCell key={plan.id}>{row.values[plan.id]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ExampleSection>

          <ExampleSection
            title="Frequently asked questions"
            description="Answers about billing, trials, and plan changes."
          >
            <Accordion type="single" collapsible>
              {FAQ_ENTRIES.map((entry) => (
                <AccordionItem key={entry.question} value={entry.question}>
                  <AccordionTrigger>{entry.question}</AccordionTrigger>
                  <AccordionContent>{entry.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ExampleSection>
        </>
      )}

      <Dialog
        open={selectedPlan !== null}
        onOpenChange={(open) => {
          if (submitting) return; // no dismissing while the request is in flight
          if (!open) cancelDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change plan to {selectedPlan?.name}?</DialogTitle>
            <DialogDescription>
              Your workspace will move from the {PLANS.find((p) => p.id === currentPlanId)?.name} plan to the{' '}
              {selectedPlan?.name} plan, billed {billing}. This example simulates the request — no payment is collected.
            </DialogDescription>
          </DialogHeader>
          {submitting && (
            <p role="status" className="text-sm">
              Changing your plan…
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" disabled={submitting} onClick={cancelDialog}>
              Cancel
            </Button>
            <Button type="button" loading={submitting} onClick={confirmPlanChange}>
              Confirm plan change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ExamplePage>
  );
}
