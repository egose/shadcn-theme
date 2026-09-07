'use client';

import Link from 'next/link';

import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Badge } from '@egose/shadcn-theme/components/ui/badge';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@egose/shadcn-theme/components/ui/field';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Switch } from '@egose/shadcn-theme/components/ui/switch';

import { CURRENT_PLAN, INITIAL_BILLING, REQUIRED_PLAN, SAVE_ERROR_HINT } from '../fixtures';
import type { SimulatedOutcomeChoice } from '../types';
import { SaveBar } from './save-bar';
import { useSaveSection } from './use-save-section';

export function BillingSection({ saveOutcome }: { saveOutcome: SimulatedOutcomeChoice }) {
  const { draft, update, status, save, discard } = useSaveSection(INITIAL_BILLING, saveOutcome);

  return (
    <form
      aria-label="Billing settings"
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-muted-foreground text-sm">
          Current plan: <Badge variant="secondary">{CURRENT_PLAN.name}</Badge>
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="settings-billing-email">Billing email</FieldLabel>
          <Input
            id="settings-billing-email"
            type="email"
            value={draft.billingEmail}
            onChange={(event) => update({ billingEmail: event.target.value })}
          />
          <FieldDescription>Invoices and payment receipts are sent here.</FieldDescription>
        </Field>

        {/* Plan-gated control: the gate is explained as text referenced by
            aria-describedby, not conveyed by disabled styling alone. */}
        <Field orientation="horizontal" data-disabled="true">
          <Switch
            id="settings-consolidated-billing"
            disabled
            aria-labelledby="settings-consolidated-billing-label"
            aria-describedby="settings-consolidated-billing-reason"
          />
          <div className="flex flex-col gap-1">
            <FieldLabel id="settings-consolidated-billing-label" htmlFor="settings-consolidated-billing">
              Consolidated billing across workspaces
            </FieldLabel>
            <FieldDescription id="settings-consolidated-billing-reason">
              Consolidated billing requires the {REQUIRED_PLAN.name} plan — this workspace is on the {CURRENT_PLAN.name}{' '}
              plan. See plans and pricing in the{' '}
              <Link href="/real-examples/pricing" className="underline underline-offset-2">
                pricing example
              </Link>
              .
            </FieldDescription>
          </div>
        </Field>
      </FieldGroup>

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Billing settings could not be saved</AlertTitle>
          <AlertDescription>{SAVE_ERROR_HINT}</AlertDescription>
        </Alert>
      )}

      <SaveBar status={status} onDiscard={discard} />
    </form>
  );
}
