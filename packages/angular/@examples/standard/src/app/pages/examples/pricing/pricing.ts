import { DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardFooter,
  HlmCardHeader,
  HlmCardTitle,
} from '@egose/shadcn-theme-ng/card';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { HlmSeparator } from '@egose/shadcn-theme-ng/separator';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EXAMPLE_READ_ONLY_MESSAGE, type ExampleViewState } from '../../../shared/real-examples/example-view-state';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import {
  EXAMPLE_PLANS,
  PRICING_BILLING_ANCHOR_ISO,
  PRICING_COMPARISON_ROWS,
  PRICING_FAQS,
  describeCadence,
  isValidSeatCount,
  totalPriceCopy,
  unitPriceCopy,
} from './pricing-fixtures';
import type { BillingCadence, ExamplePlan, PlanConfirmResult, PricingSelection } from './pricing-types';
import { PlanConfirmDialog } from './components/plan-confirm-dialog';

@Component({
  selector: 'app-pricing-example',
  imports: [
    DemoHeaderComponent,
    ExampleStateToolbarComponent,
    HlmBadge,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmCardDescription,
    HlmCardFooter,
    HlmCardHeader,
    HlmCardTitle,
    HlmSeparator,
    ReactiveFormsModule,
    DatePipe,
  ],
  templateUrl: './pricing.html',
})
export class PricingExamplePage {
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogs = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);
  private _alive = true;
  private _session = 0;
  private _closeDialog: (() => void) | null = null;
  private _observedState: ExampleViewState = 'loaded';
  private _observedReadOnly = false;

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  protected readonly plans = signal<readonly ExamplePlan[]>(EXAMPLE_PLANS);
  protected readonly selection = signal<PricingSelection | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly sessionNotice = signal<string | null>(null);
  protected readonly billingForm = this._fb.nonNullable.group({
    cadence: this._fb.nonNullable.control<BillingCadence>('monthly'),
  });
  protected readonly cadence = toSignal(this.billingForm.controls.cadence.valueChanges, {
    initialValue: 'monthly' as BillingCadence,
  });

  protected readonly selectionSummary = computed(() => {
    const selected = this.selection();
    if (!selected) return 'No plan selected yet. Choose a plan to preview its confirmation step.';
    const prefix = `Selected: ${selected.plan.name} — ${unitPriceCopy(selected.plan, selected.cadence)}.`;
    switch (selected.status) {
      case 'pending':
        return `${prefix} Confirm the details in the dialog to finish.`;
      case 'cancelled':
        return `${prefix} Confirmation cancelled. Choose the plan again to retry.`;
      case 'confirmed':
        return `${prefix} Preview confirmed below.`;
      case 'contact':
        return `${prefix} Contact sales to complete this plan.`;
    }
  });
  protected readonly confirmation = computed(() => {
    const selected = this.selection();
    if (!selected) return null;
    const { plan, cadence, seats } = selected;
    if (selected.status === 'contact') {
      return (
        `Enterprise inquiry noted for ${plan.name} (${unitPriceCopy(plan, cadence)}). ` +
        'Email sales@example.com and our team replies within one business day. No payment is collected in this demo.'
      );
    }
    if (selected.status !== 'confirmed' || seats === undefined) return null;
    return (
      `${plan.name} confirmed: ${seats} ${seats === 1 ? 'seat' : 'seats'} × ${unitPriceCopy(plan, cadence)} — ` +
      `${totalPriceCopy(plan, cadence, seats)}. No payment is collected in this demo.`
    );
  });

  protected readonly loadingSlots = [0, 1, 2];
  protected readonly faqs = PRICING_FAQS;
  protected readonly comparisonRows = PRICING_COMPARISON_ROWS;
  protected readonly PRICING_BILLING_ANCHOR_ISO = PRICING_BILLING_ANCHOR_ISO;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;
  protected readonly describeCadence = describeCadence;

  constructor() {
    effect(() => {
      this.viewState();
      this.readOnly();
      untracked(() => this._syncSession());
    });
    this.billingForm.controls.cadence.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this._invalidate();
      this.sessionNotice.set('Billing cadence changed. Choose a plan to confirm this pricing.');
    });
    this._destroyRef.onDestroy(() => {
      this._alive = false;
      this._invalidate();
    });
  }

  protected setViewState(state: ExampleViewState): void {
    this.viewState.set(state);
    this._syncSession();
  }

  protected setReadOnly(value: boolean): void {
    this.readOnly.set(value);
    this._syncSession();
  }

  /** Synchronize at entry/commit too: effects may not have run before a dialog emits. */
  private _syncSession(): void {
    if (this._observedState === this.viewState() && this._observedReadOnly === this.readOnly()) return;
    const permissionChanged = this._observedReadOnly !== this.readOnly();
    this._observedState = this.viewState();
    this._observedReadOnly = this.readOnly();
    this._invalidate();
    this.sessionNotice.set('Permission or preview changed. Previous selections and pending work were cleared.');
    if (permissionChanged && this.viewState() === 'loading') {
      this.viewState.set('loaded');
      this._observedState = 'loaded';
    }
  }

  private _invalidate(): void {
    ++this._session;
    this.selection.set(null);
    const close = this._closeDialog;
    this._closeDialog = null;
    close?.();
  }

  private _current(session: number): boolean {
    this._syncSession();
    return this._alive && this._session === session;
  }

  protected unitPrice(plan: ExamplePlan): string {
    return unitPriceCopy(plan, this.cadence());
  }

  protected selectPlan(plan: ExamplePlan): void {
    this._syncSession();
    if (
      !this._alive ||
      this.readOnly() ||
      this.viewState() !== 'loaded' ||
      plan.current ||
      !this.plans().includes(plan)
    )
      return;
    if (this.selection()?.status === 'pending' && this.selection()?.plan.id === plan.id) return;
    this._invalidate();
    this.sessionNotice.set(null);
    const session = this._session;
    const selected: PricingSelection = {
      plan: { ...plan, features: [...plan.features] },
      cadence: this.billingForm.controls.cadence.value,
      status: plan.contactOnly ? 'contact' : 'pending',
    };
    this.selection.set(selected);
    if (plan.contactOnly) return;
    const dialogRef = this._dialogs.open<PlanConfirmResult | null>(PlanConfirmDialog, {
      context: { planName: selected.plan.name, unitCopy: unitPriceCopy(selected.plan, selected.cadence) },
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });
    this._closeDialog = () => dialogRef.close(null);
    dialogRef.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (!this._current(session)) return;
      this._closeDialog = null;
      // Identity, eligibility and price must still match the captured offer.
      if (
        this.readOnly() ||
        this.viewState() !== 'loaded' ||
        this.selection() !== selected ||
        this.plans().find((candidate) => candidate.id === plan.id) !== plan ||
        plan.current ||
        plan.contactOnly ||
        plan.name !== selected.plan.name ||
        plan.monthlyCents !== selected.plan.monthlyCents ||
        plan.annualCents !== selected.plan.annualCents ||
        this.billingForm.controls.cadence.value !== selected.cadence
      ) {
        this._invalidate();
        this.sessionNotice.set('The selected offer changed. Choose a plan again to confirm current pricing.');
        return;
      }
      if (result == null || !isValidSeatCount(result.seats)) {
        this.selection.set({ ...selected, status: 'cancelled' });
        return;
      }
      this.selection.set({ ...selected, status: 'confirmed', seats: result.seats });
    });
  }

  protected async reload(): Promise<void> {
    if (!this._alive) return;
    this._syncSession();
    this._invalidate();
    this.billingForm.reset({ cadence: 'monthly' });
    const session = this._session;
    this.sessionNotice.set('Reload clears selections and restores monthly fixture pricing.');
    this.viewState.set('loading');
    this._observedState = 'loading';
    this.loadError.set(null);
    try {
      const plans = await simulateExampleLoad(EXAMPLE_PLANS, { shouldFail: this.simulateFailure() });
      if (!this._current(session)) return;
      this.plans.set(plans);
      this.viewState.set('loaded');
      this._observedState = 'loaded';
    } catch (error) {
      if (!this._current(session)) return;
      this.loadError.set(error instanceof Error ? error.message : 'Plans failed to load.');
      this.viewState.set('error');
      this._observedState = 'error';
    }
  }
}
