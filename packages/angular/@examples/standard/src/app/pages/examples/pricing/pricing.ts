import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
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
import {
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogService,
  HlmDialogTitle,
} from '@egose/shadcn-theme-ng/dialog';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmSeparator } from '@egose/shadcn-theme-ng/separator';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EXAMPLE_READ_ONLY_MESSAGE, ExampleViewState } from '../../../shared/real-examples/example-view-state';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import {
  BillingCadence,
  EXAMPLE_PLANS,
  ExamplePlan,
  PRICING_BILLING_ANCHOR_ISO,
  PRICING_COMPARISON_ROWS,
  PRICING_FAQS,
  describeCadence,
  totalPriceCopy,
  unitPriceCopy,
} from './pricing-fixtures';

export interface PlanConfirmContext {
  readonly planName: string;
  readonly unitCopy: string;
}

export interface PlanConfirmResult {
  readonly seats: number;
}

/**
 * Plan confirmation/details dialog. Carries its own typed seats form so the
 * confirmation total is validated before the page records a visible outcome.
 * No payment provider is involved; confirming only previews the selection.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmDialogDescription,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmInput,
    HlmLabel,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="confirm()" novalidate class="tw:contents">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Confirm {{ context.planName }} plan</h3>
        <p hlmDialogDescription>
          {{ context.unitCopy }}. Enter seats to preview the confirmation total. No payment is collected.
        </p>
      </hlm-dialog-header>

      <div class="tw:grid tw:gap-2 tw:py-4">
        <label hlmLabel for="plan-seats">Seats</label>
        <input
          hlmInput
          id="plan-seats"
          data-testid="plan-seats"
          type="number"
          min="1"
          max="1000"
          formControlName="seats"
        />
        @if (seatsError(); as error) {
          <p data-testid="plan-seats-error" class="tw:text-sm tw:text-red-600">{{ error }}</p>
        }
      </div>

      <hlm-dialog-footer>
        <button hlmButton type="button" variant="secondary" appearance="outline" (click)="cancel()">Cancel</button>
        <button hlmButton type="submit" variant="primary" data-testid="plan-confirm">Confirm plan</button>
      </hlm-dialog-footer>
    </form>
  `,
  host: { class: 'tw:flex tw:flex-col tw:gap-2' },
})
export class PlanConfirmDialog {
  private readonly _dialogRef = inject<BrnDialogRef<PlanConfirmResult | null>>(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<PlanConfirmContext>();
  private readonly _fb = inject(FormBuilder);

  protected readonly form = this._fb.nonNullable.group({
    seats: this._fb.nonNullable.control<number>(5, {
      validators: [Validators.required, Validators.min(1), Validators.max(1000)],
    }),
  });

  protected seatsError(): string | null {
    const control = this.form.controls.seats;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Seats are required';
    if (control.hasError('min')) return 'Seats must be at least 1';
    if (control.hasError('max')) return 'Seats must be at most 1000';
    return 'Enter a valid seat count';
  }

  protected cancel(): void {
    this._dialogRef.close(null);
  }

  protected confirm(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this._dialogRef.close({ seats: this.form.getRawValue().seats });
  }
}

/**
 * Pricing and plan selection product flow.
 *
 * Responsive conversion surface composed from package cards, badges,
 * buttons, separators, labels, inputs, and dialogs: a typed billing-cadence
 * form, three differentiated plans with a text-labeled recommended plan, a
 * semantic feature-comparison table, native FAQ disclosures, an accessible
 * selection summary, and a confirmation dialog (contact-only for
 * Enterprise). Loading, empty, error, and loaded previews run through the
 * shared catalog tooling without a backend.
 */
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
  template: `
    <section class="tw:space-y-6">
      <app-demo-header
        title="Pricing"
        description="Compare plans and confirm a selection. The catalog toolbar switches this preview between loading, empty, error, and loaded views without a backend."
      />

      <app-example-state-toolbar
        [(viewState)]="viewState"
        [(readOnly)]="readOnly"
        [(simulateFailure)]="simulateFailure"
      />

      <p class="tw:text-xs tw:text-slate-500">
        Prices anchor to {{ PRICING_BILLING_ANCHOR_ISO | date: 'mediumDate' : 'UTC' : 'en-US' }} and never to today.
      </p>

      @switch (viewState()) {
        @case ('loading') {
          <div role="status" aria-label="Loading plans" class="tw:grid tw:gap-4 md:tw:grid-cols-3">
            @for (slot of loadingSlots; track slot) {
              <div class="tw:animate-pulse tw:rounded-2xl tw:border tw:border-slate-200 tw:p-5">
                <div class="tw:h-5 tw:w-1/2 tw:rounded tw:bg-slate-200"></div>
                <div class="tw:mt-3 tw:h-8 tw:w-2/3 tw:rounded tw:bg-slate-200"></div>
                <div class="tw:mt-3 tw:h-4 tw:w-full tw:rounded tw:bg-slate-200"></div>
              </div>
            }
          </div>
        }
        @case ('empty') {
          <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:text-center">
            <h3 class="tw:text-base tw:font-semibold tw:text-slate-900">No plans configured</h3>
            <p class="tw:mt-1 tw:text-sm tw:text-slate-600">This workspace has no billing plans yet.</p>
            <button hlmButton type="button" class="tw:mt-4" (click)="viewState.set('loaded')">Show fixtures</button>
          </div>
        }
        @case ('error') {
          <div role="alert" class="tw:rounded-2xl tw:border tw:border-rose-200 tw:bg-rose-50 tw:p-6 tw:text-center">
            <h3 class="tw:text-base tw:font-semibold tw:text-rose-900">Plans failed to load</h3>
            <p class="tw:mt-1 tw:text-sm tw:text-rose-700">{{ loadError() }}</p>
            <button hlmButton type="button" class="tw:mt-4" (click)="reload()">Retry</button>
          </div>
        }
        @default {
          <section aria-labelledby="billing-heading" class="tw:min-w-0 tw:space-y-3">
            <h3 id="billing-heading" class="tw:text-base tw:font-semibold tw:text-slate-900">Billing cadence</h3>
            <form [formGroup]="billingForm" class="tw:contents">
              <fieldset class="tw:flex tw:min-w-0 tw:flex-wrap tw:gap-2" data-testid="billing-cadence-group">
                <legend class="tw:sr-only">Choose monthly or annual billing</legend>
                <label
                  class="tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-slate-300 tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-slate-700"
                >
                  <input
                    type="radio"
                    formControlName="cadence"
                    value="monthly"
                    id="billing-monthly"
                    data-testid="billing-monthly"
                    class="tw:h-4 tw:w-4 tw:accent-slate-900"
                  />
                  Monthly
                </label>
                <label
                  class="tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-slate-300 tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-slate-700"
                >
                  <input
                    type="radio"
                    formControlName="cadence"
                    value="annual"
                    id="billing-annual"
                    data-testid="billing-annual"
                    class="tw:h-4 tw:w-4 tw:accent-slate-900"
                  />
                  Annual
                  <span class="tw:text-xs tw:font-normal tw:text-slate-500">save about 20%</span>
                </label>
              </fieldset>
            </form>
            <p role="status" aria-live="polite" data-testid="billing-summary" class="tw:text-sm tw:text-slate-600">
              {{ describeCadence(cadence()) }}
            </p>
          </section>

          <section aria-labelledby="plans-heading" class="tw:min-w-0 tw:space-y-3">
            <h3 id="plans-heading" class="tw:text-base tw:font-semibold tw:text-slate-900">Plans</h3>
            <ul class="tw:grid tw:min-w-0 tw:gap-4 md:tw:grid-cols-3" aria-label="Available plans">
              @for (plan of plans(); track plan.id) {
                <li [attr.data-testid]="'plan-' + plan.id" class="tw:min-w-0">
                  <article
                    hlmCard
                    class="tw:flex tw:h-full tw:min-w-0 tw:flex-col tw:border-slate-200 tw:bg-white tw:shadow-sm"
                    [class.tw:border-slate-900]="plan.recommended"
                  >
                    <div hlmCardHeader>
                      <div class="tw:flex tw:min-w-0 tw:items-center tw:justify-between tw:gap-2">
                        <h3 hlmCardTitle class="tw:min-w-0 tw:break-words tw:text-base tw:font-semibold">
                          {{ plan.name }}
                          @if (plan.recommended) {
                            <span class="tw:sr-only">(recommended)</span>
                          }
                          @if (plan.current) {
                            <span class="tw:sr-only">(current plan)</span>
                          }
                        </h3>
                        @if (plan.recommended) {
                          <span hlmBadge variant="primary" [attr.data-testid]="'recommended-' + plan.id">
                            Recommended
                          </span>
                        }
                      </div>
                      <div hlmCardDescription>
                        @if (plan.current) {
                          <span>Your workspace is on this plan.</span>
                        } @else if (plan.contactOnly) {
                          <span>Contact-only plan with custom terms.</span>
                        } @else {
                          <span>Self-serve plan with instant confirmation.</span>
                        }
                      </div>
                    </div>

                    <div hlmCardContent class="tw:min-w-0 tw:space-y-3">
                      <p
                        class="tw:break-words tw:text-2xl tw:font-bold tw:text-slate-950"
                        [attr.data-testid]="'price-' + plan.id"
                      >
                        {{ unitPrice(plan) }}
                      </p>
                      <p class="tw:min-w-0 tw:break-words tw:text-sm tw:leading-6 tw:text-slate-600">
                        {{ plan.blurb }}
                      </p>
                      <ul
                        class="tw:space-y-1.5 tw:text-sm tw:text-slate-700"
                        [attr.aria-label]="plan.name + ' features'"
                      >
                        @for (feature of plan.features; track feature) {
                          <li class="tw:flex tw:min-w-0 tw:gap-2">
                            <span aria-hidden="true" class="tw:text-emerald-600">✓</span>
                            <span class="tw:min-w-0 tw:break-words">{{ feature }}</span>
                          </li>
                        }
                      </ul>
                      @if (plan.contactOnly) {
                        <p class="tw:min-w-0 tw:break-words tw:text-sm tw:text-slate-600">
                          Prefer email?
                          <a class="tw:underline" href="mailto:sales@example.com" data-testid="enterprise-mailto">
                            sales&#64;example.com
                          </a>
                        </p>
                      }
                    </div>

                    <div hlmCardFooter>
                      @if (plan.current) {
                        <button
                          hlmButton
                          type="button"
                          class="tw:w-full"
                          [disabled]="true"
                          aria-describedby="current-plan-note"
                          [attr.data-testid]="'select-' + plan.id"
                        >
                          Current plan
                        </button>
                      } @else if (plan.contactOnly) {
                        <button
                          hlmButton
                          variant="secondary"
                          type="button"
                          class="tw:w-full"
                          [disabled]="readOnly()"
                          [attr.data-testid]="'select-' + plan.id"
                          (click)="selectPlan(plan)"
                        >
                          Contact sales
                        </button>
                      } @else {
                        <button
                          hlmButton
                          type="button"
                          class="tw:w-full"
                          [disabled]="readOnly()"
                          [attr.data-testid]="'select-' + plan.id"
                          (click)="selectPlan(plan)"
                        >
                          Choose {{ plan.name }}
                        </button>
                      }
                    </div>
                  </article>
                </li>
              }
            </ul>
            <p id="current-plan-note" class="tw:text-xs tw:text-slate-500">
              The current plan cannot be reselected; its button stays disabled.
            </p>
          </section>

          <p role="status" aria-live="polite" data-testid="selection-summary" class="tw:text-sm tw:text-slate-700">
            {{ selectionSummary() }}
          </p>
          @if (confirmation()) {
            <p
              role="status"
              data-testid="confirmation-result"
              class="tw:break-words tw:rounded-2xl tw:border tw:border-emerald-200 tw:bg-emerald-50 tw:p-4 tw:text-sm tw:text-emerald-900"
            >
              {{ confirmation() }}
            </p>
          }
          @if (readOnly()) {
            <p class="tw:text-xs tw:text-slate-500">{{ READ_ONLY_MESSAGE }}</p>
          }

          <hlm-separator />

          <section aria-labelledby="compare-heading" class="tw:min-w-0 tw:space-y-3">
            <h3 id="compare-heading" class="tw:text-base tw:font-semibold tw:text-slate-900">Compare features</h3>
            <div
              class="tw:max-w-full tw:overflow-x-auto tw:rounded-2xl tw:border tw:border-slate-200"
              data-testid="feature-comparison"
            >
              <table class="tw:w-full tw:border-collapse tw:text-left tw:text-sm">
                <caption class="tw:sr-only">
                  Feature availability across the Starter, Team, and Enterprise plans
                </caption>
                <thead>
                  <tr class="tw:border-b tw:border-slate-200 tw:bg-slate-50">
                    <th scope="col" class="tw:min-w-0 tw:break-words tw:p-3 tw:font-medium tw:text-slate-500">
                      Feature
                    </th>
                    <th scope="col" class="tw:min-w-0 tw:break-words tw:p-3 tw:font-semibold tw:text-slate-900">
                      Starter
                    </th>
                    <th scope="col" class="tw:min-w-0 tw:break-words tw:p-3 tw:font-semibold tw:text-slate-900">
                      Team <span class="tw:font-normal tw:text-slate-500">(Recommended)</span>
                    </th>
                    <th scope="col" class="tw:min-w-0 tw:break-words tw:p-3 tw:font-semibold tw:text-slate-900">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of comparisonRows; track row.feature) {
                    <tr class="tw:border-b tw:border-slate-100 tw:last:tw:border-0">
                      <th scope="row" class="tw:min-w-0 tw:break-words tw:p-3 tw:font-medium tw:text-slate-900">
                        {{ row.feature }}
                      </th>
                      <td class="tw:min-w-0 tw:break-words tw:p-3 tw:text-slate-600">{{ row.starter }}</td>
                      <td class="tw:min-w-0 tw:break-words tw:p-3 tw:text-slate-600">{{ row.team }}</td>
                      <td class="tw:min-w-0 tw:break-words tw:p-3 tw:text-slate-600">{{ row.enterprise }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <hlm-separator />

          <section aria-labelledby="faq-heading" class="tw:min-w-0 tw:space-y-3">
            <h3 id="faq-heading" class="tw:text-base tw:font-semibold tw:text-slate-900">Frequently asked questions</h3>
            <ul class="tw:min-w-0 tw:space-y-2">
              @for (faq of faqs; track faq.id) {
                <li class="tw:min-w-0">
                  <details
                    class="tw:min-w-0 tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:px-4 tw:py-3"
                    [attr.data-testid]="faq.id"
                  >
                    <summary
                      class="tw:min-w-0 tw:cursor-pointer tw:break-words tw:text-sm tw:font-medium tw:text-slate-900"
                    >
                      {{ faq.question }}
                    </summary>
                    <p class="tw:mt-2 tw:min-w-0 tw:break-words tw:text-sm tw:leading-6 tw:text-slate-600">
                      {{ faq.answer }}
                    </p>
                  </details>
                </li>
              }
            </ul>
          </section>
        }
      }

      <div class="tw:flex tw:flex-wrap tw:gap-2">
        <button hlmButton variant="secondary" type="button" (click)="reload()">Simulate reload</button>
      </div>
    </section>
  `,
})
export class PricingExamplePage {
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogs = inject(HlmDialogService);

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  protected readonly plans = signal<readonly ExamplePlan[]>(EXAMPLE_PLANS);
  protected readonly selectedPlanId = signal<string | null>(null);
  protected readonly confirmation = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);

  protected readonly billingForm = this._fb.nonNullable.group({
    cadence: this._fb.nonNullable.control<BillingCadence>('monthly'),
  });
  protected readonly cadence = toSignal(this.billingForm.controls.cadence.valueChanges, {
    initialValue: 'monthly' as BillingCadence,
  });

  protected readonly selectionSummary = computed(() => {
    const selected = this.plans().find((plan) => plan.id === this.selectedPlanId());
    if (!selected) {
      return 'No plan selected yet. Choose a plan below to preview its confirmation step.';
    }
    const price = unitPriceCopy(selected, this.cadence());
    if (selected.current) {
      return `Selected: ${selected.name} — ${price}. This is the current plan.`;
    }
    if (selected.contactOnly) {
      return `Selected: ${selected.name} — ${price}. Contact sales to complete this plan.`;
    }
    return `Selected: ${selected.name} — ${price}. Confirm the details in the dialog to finish.`;
  });

  protected readonly loadingSlots = [0, 1, 2];
  protected readonly faqs = PRICING_FAQS;
  protected readonly comparisonRows = PRICING_COMPARISON_ROWS;
  protected readonly PRICING_BILLING_ANCHOR_ISO = PRICING_BILLING_ANCHOR_ISO;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;
  protected readonly describeCadence = describeCadence;

  protected unitPrice(plan: ExamplePlan): string {
    return unitPriceCopy(plan, this.cadence());
  }

  protected selectPlan(plan: ExamplePlan): void {
    if (plan.current || this.readOnly()) {
      return;
    }
    this.selectedPlanId.set(plan.id);
    if (plan.contactOnly) {
      this.confirmation.set(
        `Enterprise inquiry noted for ${plan.name} (${unitPriceCopy(plan, this.cadence())}). ` +
          `Email sales@example.com and our team replies within one business day. ` +
          `No payment is collected in this demo.`,
      );
      return;
    }
    const cadence = this.cadence();
    const dialogRef = this._dialogs.open<PlanConfirmResult | null>(PlanConfirmDialog, {
      context: { planName: plan.name, unitCopy: unitPriceCopy(plan, cadence) },
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });
    dialogRef.closed$.subscribe((result) => {
      if (result == null) {
        return;
      }
      const seats = result.seats;
      const seatWord = seats === 1 ? 'seat' : 'seats';
      this.confirmation.set(
        `${plan.name} confirmed: ${seats} ${seatWord} × ${unitPriceCopy(plan, this.cadence())} — ` +
          `${totalPriceCopy(plan, this.cadence(), seats)}. No payment is collected in this demo.`,
      );
    });
  }

  protected async reload(): Promise<void> {
    this.viewState.set('loading');
    this.loadError.set(null);
    try {
      const plans = await simulateExampleLoad(EXAMPLE_PLANS, { shouldFail: this.simulateFailure() });
      this.plans.set(plans);
      this.viewState.set('loaded');
    } catch (error) {
      this.loadError.set(error instanceof Error ? error.message : 'Plans failed to load.');
      this.viewState.set('error');
    }
  }
}
