import { provideZonelessChangeDetection, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { PricingExamplePage } from './pricing';
import { EXAMPLE_PLANS } from './pricing-fixtures';
import type { BillingCadence, ExamplePlan, PlanConfirmResult } from './pricing-types';
import type { ExampleViewState } from '../../../shared/real-examples/example-view-state';

interface PageActions {
  readOnly: WritableSignal<boolean>;
  viewState: WritableSignal<ExampleViewState>;
  plans: WritableSignal<readonly ExamplePlan[]>;
  simulateFailure: WritableSignal<boolean>;
  billingForm: FormGroup<{ cadence: FormControl<BillingCadence> }>;
  confirmation(): string | null;
  setReadOnly(value: boolean): void;
  setViewState(value: ExampleViewState): void;
  selectPlan(plan: ExamplePlan): void;
  reload(): Promise<void>;
}

describe('Pricing confirmation and reload interleavings', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(PricingExamplePage);
    const host = fixture.nativeElement as HTMLElement;
    const page = fixture.componentInstance as unknown as PageActions;
    fixture.detectChanges();
    const render = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const choose = () => host.querySelector<HTMLButtonElement>('[data-testid="select-plan-team"]')!.click();
    const result = () => host.querySelector('[data-testid="confirmation-result"]');
    return { fixture, host, page, render, choose, result };
  }

  // Deliberately emit even after close, to verify the route's commit boundary independently of overlay cleanup.
  function dialog() {
    const closed = new Subject<PlanConfirmResult | null>();
    const close = jasmine.createSpy('close');
    const spy = spyOn(TestBed.inject(HlmDialogService), 'open').and.returnValue({
      closed$: closed.asObservable(),
      close,
    } as unknown as ReturnType<HlmDialogService['open']>);
    return { closed, close, spy };
  }

  for (const boundary of ['readonly', 'preview', 'cadence', 'reload', 'destroy'] as const) {
    it(`ignores late confirmation after ${boundary}, including round trips to the original context`, async () => {
      const ui = setup();
      const modal = dialog();
      ui.choose();
      let pending: Promise<void> | undefined;
      if (boundary === 'readonly') {
        ui.page.setReadOnly(true);
        ui.page.setReadOnly(false);
      }
      if (boundary === 'preview') {
        ui.page.setViewState('empty');
        ui.page.setViewState('loaded');
      }
      if (boundary === 'cadence') {
        ui.page.billingForm.controls.cadence.setValue('annual');
        ui.page.billingForm.controls.cadence.setValue('monthly');
      }
      if (boundary === 'reload') pending = ui.page.reload();
      if (boundary === 'destroy') ui.fixture.destroy();
      await pending;
      modal.closed.next({ seats: 5 });
      expect(modal.close).toHaveBeenCalled();
      expect(ui.page.confirmation()).toBeNull();
      if (boundary !== 'destroy') {
        await ui.render();
        expect(ui.result()).toBeNull();
        expect(ui.host.textContent).toContain('No plan selected');
      }
    });
  }

  for (const boundary of ['readonly', 'preview']) {
    it(`rechecks ${boundary} before effects run`, async () => {
      const ui = setup();
      const modal = dialog();
      ui.choose();
      if (boundary === 'readonly') ui.page.readOnly.set(true);
      else ui.page.viewState.set('empty');
      modal.closed.next({ seats: 10 });
      await ui.render();
      expect(ui.result()).toBeNull();
      expect(ui.page.confirmation()).toBeNull();
    });
  }

  for (const value of [0, 1001, 1.5, NaN, Infinity, -Infinity]) {
    it(`rejects invalid seat count ${value} at commit, independent of the dialog form`, async () => {
      const ui = setup();
      const modal = dialog();
      ui.choose();
      modal.closed.next({ seats: value });
      await ui.render();
      expect(ui.result()).toBeNull();
      expect(ui.host.textContent).toContain('Confirmation cancelled');
    });
  }

  it('opens once for duplicate starts and consumes only the first result', async () => {
    const ui = setup();
    const modal = dialog();
    ui.choose();
    ui.choose();
    expect(modal.spy).toHaveBeenCalledTimes(1);
    modal.closed.next({ seats: 1 });
    modal.closed.next({ seats: 1000 });
    await ui.render();
    expect(ui.result()?.textContent).toContain('1 seat ×');
    expect(ui.result()?.textContent).not.toContain('1000');
    expect(ui.host.querySelectorAll('[data-testid="confirmation-result"]').length).toBe(1);
  });

  it('does not let a cancelled dialog emit a later confirmation', async () => {
    const ui = setup();
    const modal = dialog();
    ui.choose();
    modal.closed.next(null);
    modal.closed.next({ seats: 5 });
    await ui.render();
    expect(ui.result()).toBeNull();
    expect(ui.host.textContent).toContain('Confirmation cancelled');
  });

  it('keeps a newer Enterprise selection when the previous dialog settles', async () => {
    const ui = setup();
    const modal = dialog();
    ui.choose();
    ui.host.querySelector<HTMLButtonElement>('[data-testid="select-plan-enterprise"]')!.click();
    modal.closed.next({ seats: 5 });
    await ui.render();
    expect(modal.close).toHaveBeenCalled();
    expect(ui.result()?.textContent).toContain('Enterprise inquiry noted');
    expect(ui.result()?.textContent).not.toContain('Team confirmed');
  });

  it('keeps a newer annual dialog when the earlier monthly dialog settles', async () => {
    const ui = setup();
    const monthly = new Subject<PlanConfirmResult | null>();
    const annual = new Subject<PlanConfirmResult | null>();
    const open = spyOn(TestBed.inject(HlmDialogService), 'open');
    // Queued return values ensure each subscription has its own dialog identity.
    open.and.returnValues(
      ...[monthly, annual].map(
        (stream) =>
          ({
            closed$: stream.asObservable(),
            close: jasmine.createSpy('close'),
          }) as unknown as ReturnType<HlmDialogService['open']>,
      ),
    );
    ui.choose();
    ui.host.querySelector<HTMLInputElement>('#billing-annual')!.click();
    await ui.render();
    ui.choose();
    const config = open.calls.mostRecent().args[1];
    expect(config?.context).toEqual(
      jasmine.objectContaining({ unitCopy: '$31.20/mo, billed annually ($374.40/year)' }),
    );
    monthly.next({ seats: 1000 });
    await ui.render();
    expect(ui.result()).toBeNull();
    annual.next({ seats: 2 });
    await ui.render();
    expect(ui.result()?.textContent).toContain('2 seats');
    expect(ui.result()?.textContent).toContain('$62.40/mo, billed as $748.80 per year');
  });

  for (const change of ['replacement', 'removed', 'price', 'current', 'contact'] as const) {
    it(`requires reconfirmation when the captured plan changes: ${change}`, async () => {
      const ui = setup();
      // Use local records so the in-place eligibility probes cannot modify shared fixtures.
      const plans = EXAMPLE_PLANS.map((plan) => ({ ...plan }));
      ui.page.plans.set(plans);
      await ui.render();
      const modal = dialog();
      ui.choose();
      if (change === 'replacement') ui.page.plans.set(plans.map((plan) => ({ ...plan })));
      if (change === 'removed') ui.page.plans.set(plans.filter((plan) => plan.id !== 'plan-team'));
      if (change === 'price') plans[1].monthlyCents = 5000;
      if (change === 'current') plans[1].current = true;
      if (change === 'contact') plans[1].contactOnly = true;
      modal.closed.next({ seats: 5 });
      await ui.render();
      expect(ui.result()).toBeNull();
      expect(ui.host.textContent).toContain('selected offer changed');
    });
  }

  it('guards direct selection of current, stale, readonly and unloaded plans', async () => {
    const ui = setup();
    const modal = dialog();
    ui.page.selectPlan(EXAMPLE_PLANS[0]);
    ui.page.selectPlan({ ...EXAMPLE_PLANS[1] });
    ui.page.setReadOnly(true);
    ui.page.selectPlan(EXAMPLE_PLANS[1]);
    ui.page.selectPlan(EXAMPLE_PLANS[2]);
    ui.page.setReadOnly(false);
    ui.page.setViewState('loading');
    ui.page.selectPlan(EXAMPLE_PLANS[1]);
    await ui.render();
    expect(modal.spy).not.toHaveBeenCalled();
    expect(ui.result()).toBeNull();
  });

  it('reloads confirmed annual pricing into an unselected monthly fixture session', async () => {
    const ui = setup();
    const modal = dialog();
    ui.host.querySelector<HTMLInputElement>('#billing-annual')!.click();
    ui.choose();
    modal.closed.next({ seats: 5 });
    await ui.render();
    expect(ui.result()?.textContent).toContain('$1872.00 per year');
    const pending = ui.page.reload();
    await ui.render();
    expect(ui.host.querySelector('[aria-label="Loading plans"]')).not.toBeNull();
    await pending;
    await ui.render();
    expect(ui.result()).toBeNull();
    expect(ui.host.querySelector<HTMLInputElement>('#billing-monthly')?.checked).toBeTrue();
    expect(ui.host.textContent).toContain('No plan selected');
  });

  for (const shouldFail of [false, true]) {
    for (const boundary of ['readonly', 'preview', 'destroy']) {
      it(`suppresses ${shouldFail ? 'failed' : 'successful'} reload settlement after ${boundary}`, async () => {
        const ui = setup();
        ui.page.simulateFailure.set(shouldFail);
        const pending = ui.page.reload();
        if (boundary === 'readonly') ui.page.setReadOnly(true);
        if (boundary === 'preview') ui.page.setViewState('empty');
        if (boundary === 'destroy') ui.fixture.destroy();
        await pending;
        expect(ui.page.viewState()).toBe(
          boundary === 'readonly' ? 'loaded' : boundary === 'preview' ? 'empty' : 'loading',
        );
        if (boundary !== 'destroy') {
          await ui.render();
          expect(ui.host.querySelector('[role="alert"]')).toBeNull();
          expect(ui.result()).toBeNull();
        }
      });
    }
  }

  for (const latestFails of [true, false]) {
    it(`only applies the latest overlapping reload (${latestFails ? 'failure' : 'success'})`, async () => {
      const ui = setup();
      ui.page.simulateFailure.set(!latestFails);
      const first = ui.page.reload();
      ui.page.simulateFailure.set(latestFails);
      const latest = ui.page.reload();
      await Promise.all([first, latest]);
      await ui.render();
      expect(ui.page.viewState()).toBe(latestFails ? 'error' : 'loaded');
      expect(!!ui.host.querySelector('[role="alert"]')).toBe(latestFails);
    });
  }
});
