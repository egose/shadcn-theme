import { getDebugNode, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgControl } from '@angular/forms';
import { PricingExamplePage } from './pricing';
import {
  EXAMPLE_PLANS,
  ExamplePlan,
  PRICING_BILLING_ANCHOR_ISO,
  PRICING_COMPARISON_ROWS,
  PRICING_FAQS,
} from './pricing-fixtures';

function overlayPane(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.cdk-overlay-pane');
}

function overlayButton(text: string): HTMLButtonElement | null {
  const buttons = Array.from(overlayPane()?.querySelectorAll('button') ?? []);
  return buttons.find((button) => button.textContent?.trim() === text) ?? null;
}

function setSeats(value: string): void {
  const input = overlayPane()?.querySelector<HTMLInputElement>('#plan-seats');
  expect(input).withContext('#plan-seats should exist').not.toBeNull();
  input!.value = value;
  input!.dispatchEvent(new Event('input', { bubbles: true }));
}

async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 180));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('PricingExamplePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
  });

  afterEach(() => {
    document.querySelector('.cdk-overlay-container')?.remove();
  });

  function setup() {
    const fixture = TestBed.createComponent(PricingExamplePage);
    fixture.detectChanges();
    return { fixture, host: fixture.nativeElement as HTMLElement };
  }

  function summaryText(host: HTMLElement, testid: string): string {
    return host.querySelector(`[data-testid="${testid}"]`)?.textContent ?? '';
  }

  it('lazy-loads through the registry entry', async () => {
    const loaded = await import('./pricing').then((m) => m.PricingExamplePage);
    expect(loaded).toBe(PricingExamplePage);
  });

  it('renders one h2 title first with no h1 and no heading skips', () => {
    const { host } = setup();
    const headings = Array.from(host.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    expect(headings.length).toBeGreaterThan(0);
    expect(host.querySelector('h1')).toBeNull();
    expect(headings[0].tagName).toBe('H2');
    let previous = 2;
    for (const heading of headings.slice(1)) {
      const level = Number(heading.tagName.substring(1));
      expect(level).toBeLessThanOrEqual(previous + 1);
      previous = level;
    }
  });

  it('uses fixed UTC fixtures with stable ids and varied copy', () => {
    expect(PRICING_BILLING_ANCHOR_ISO).toBe('2026-02-01T00:00:00.000Z');
    expect(EXAMPLE_PLANS.map((plan) => plan.id)).toEqual(['plan-starter', 'plan-team', 'plan-enterprise']);
    const lengths = new Set(EXAMPLE_PLANS.map((plan) => plan.blurb.length));
    expect(lengths.size).toBe(EXAMPLE_PLANS.length);
    for (const plan of EXAMPLE_PLANS) {
      expect(plan.features.length).toBeGreaterThan(0);
    }
    expect(PRICING_COMPARISON_ROWS.length).toBeGreaterThan(0);
    expect(PRICING_FAQS.map((faq) => faq.id)).toEqual(['faq-billing', 'faq-switch', 'faq-enterprise', 'faq-payment']);
    const { host } = setup();
    for (const plan of EXAMPLE_PLANS) {
      expect(host.querySelector(`[data-testid="plan-${plan.id}"]`)).not.toBeNull();
    }
    for (const faq of PRICING_FAQS) {
      expect(host.querySelector(`[data-testid="${faq.id}"]`)).not.toBeNull();
    }
    expect(host.querySelector('[data-testid="feature-comparison"] table')).not.toBeNull();
  });

  it('exposes the catalog toolbar and all four preview states', () => {
    const { fixture, host } = setup();
    expect(host.querySelector('[data-testid="example-state-toolbar"]')).not.toBeNull();
    const page = fixture.componentInstance as unknown as {
      viewState: { set: (state: 'loading' | 'empty' | 'error' | 'loaded') => void };
    };

    page.viewState.set('loading');
    fixture.detectChanges();
    expect(host.querySelector('[aria-label="Loading plans"]')).not.toBeNull();

    page.viewState.set('empty');
    fixture.detectChanges();
    expect(host.textContent).toContain('No plans configured');

    page.viewState.set('error');
    fixture.detectChanges();
    expect(host.querySelector('[role="alert"]')).not.toBeNull();

    page.viewState.set('loaded');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="plan-plan-team"]')).not.toBeNull();
  });

  it('changes prices and accessible billing context by cadence without changing fixtures', () => {
    const { fixture, host } = setup();
    const before = JSON.parse(JSON.stringify(EXAMPLE_PLANS)) as readonly ExamplePlan[];

    const monthly = host.querySelector<HTMLInputElement>('[data-testid="billing-monthly"]')!;
    const annual = host.querySelector<HTMLInputElement>('[data-testid="billing-annual"]')!;
    expect(monthly.checked).toBeTrue();
    expect(summaryText(host, 'price-plan-team')).toContain('$39.00/mo, billed monthly');
    expect(summaryText(host, 'billing-summary')).toContain('Monthly billing');

    annual.click();
    fixture.detectChanges();

    expect(annual.checked).toBeTrue();
    expect(summaryText(host, 'price-plan-team')).toContain('$31.20/mo, billed annually ($374.40/year)');
    expect(summaryText(host, 'price-plan-starter')).toContain('$9.60/mo, billed annually');
    expect(summaryText(host, 'billing-summary')).toContain('Annual billing');
    expect(EXAMPLE_PLANS).toEqual(before);
  });

  it('supports keyboard cadence switching with a screen-reader summary', () => {
    const { fixture, host } = setup();
    const monthly = host.querySelector<HTMLInputElement>('#billing-monthly')!;
    const annual = host.querySelector<HTMLInputElement>('#billing-annual')!;
    const summary = host.querySelector('[data-testid="billing-summary"]')!;
    expect(summary.getAttribute('aria-live')).toBe('polite');
    expect(host.querySelector('fieldset legend')?.textContent).toContain('monthly or annual');

    // Tab reaches the radio and Space (activation) selects it.
    annual.focus();
    expect(document.activeElement).toBe(annual);
    annual.click();
    fixture.detectChanges();

    expect(annual.checked).toBeTrue();
    expect(monthly.checked).toBeFalse();
    expect(summaryText(host, 'price-plan-team')).toContain('billed annually');
    expect(summaryText(host, 'billing-summary')).toContain('Annual billing');
  });

  it('keeps the current plan unselectable with a text explanation, not color alone', () => {
    const { fixture, host } = setup();
    const current = host.querySelector('[data-testid="select-plan-starter"]') as HTMLButtonElement;
    expect(current.disabled).toBeTrue();
    expect(current.textContent).toContain('Current plan');
    expect(current.getAttribute('aria-describedby')).toBe('current-plan-note');
    expect(host.textContent).toContain('cannot be reselected');

    current.click();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
    expect(summaryText(host, 'selection-summary')).toContain('No plan selected yet');
  });

  it('opens a confirmation dialog with focus and records one visible confirmation', async () => {
    const { fixture, host } = setup();

    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);

    expect(overlayPane()?.textContent).toContain('Confirm Team plan');
    expect(overlayPane()?.contains(document.activeElement))
      .withContext('focus is moved into the confirmation dialog')
      .toBeTrue();
    expect(summaryText(host, 'selection-summary')).toContain('Selected: Team');

    setSeats('5');
    overlayButton('Confirm plan')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    const outcomes = host.querySelectorAll('[data-testid="confirmation-result"]');
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].textContent).toContain('Team confirmed: 5 seats');
    expect(outcomes[0].textContent).toContain('$195.00/mo, billed monthly');
  });

  it('keeps the dialog open with a visible error on invalid seats', async () => {
    const { fixture, host } = setup();

    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);

    setSeats('');
    overlayButton('Confirm plan')?.click();
    await settle(fixture);

    expect(overlayPane()?.querySelector('[data-testid="plan-seats-error"]')?.textContent).toContain(
      'Seats are required',
    );
    expect(overlayPane()).not.toBeNull('dialog stays open on validation failure');
    expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();

    overlayButton('Cancel')?.click();
    await settle(fixture);
    expect(overlayPane()).toBeNull();
  });

  it('records no confirmation when the dialog is cancelled', async () => {
    const { fixture, host } = setup();

    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);

    overlayButton('Cancel')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
    expect(summaryText(host, 'selection-summary')).toContain('Selected: Team');
  });

  it('rejects fractional seats with an error associated to the rendered input', async () => {
    const { fixture, host } = setup();
    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);
    setSeats('1.5');
    overlayButton('Confirm plan')?.click();
    await settle(fixture);
    const input = overlayPane()?.querySelector<HTMLInputElement>('#plan-seats');
    const error = overlayPane()?.querySelector<HTMLElement>('[data-testid="plan-seats-error"]');
    expect(error?.textContent).toContain('whole number');
    expect(input?.getAttribute('aria-describedby')).toContain(error?.id ?? 'missing-error');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
  });

  it('clears an unrelated prior outcome when a new selection is cancelled', async () => {
    const { fixture, host } = setup();
    (host.querySelector('[data-testid="select-plan-enterprise"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);
    overlayButton('Cancel')?.click();
    await settle(fixture);
    expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
    expect(summaryText(host, 'selection-summary')).toContain('cancelled');
  });

  it('invalidates a dialog when readonly changes before confirmation', async () => {
    const { fixture, host } = setup();
    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);
    const page = fixture.componentInstance as unknown as { readOnly: { set: (value: boolean) => void } };
    page.readOnly.set(true);
    overlayButton('Confirm plan')?.click();
    await settle(fixture);
    expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
    expect(overlayPane()).toBeNull();
  });

  it('clears a confirmed monthly selection when switching to annual comparison', async () => {
    const { fixture, host } = setup();
    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);
    overlayButton('Confirm plan')?.click();
    await settle(fixture);
    (host.querySelector('#billing-annual') as HTMLInputElement).click();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
    expect(summaryText(host, 'selection-summary')).toContain('No plan selected');
  });

  for (const value of ['', '0', '1001', '-1', '1.5', 'NaN', 'Infinity', '1e309']) {
    it(`keeps seats ${JSON.stringify(value)} invalid in the real dialog with native hints and error feedback`, async () => {
      const { fixture, host } = setup();
      (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
      await settle(fixture);
      const input = overlayPane()!.querySelector<HTMLInputElement>('#plan-seats')!;
      expect(input.required).toBeTrue();
      expect(input.min).toBe('1');
      expect(input.max).toBe('1000');
      expect(input.step).toBe('1');
      setSeats(value);
      overlayButton('Confirm plan')!.click();
      await settle(fixture);
      const error = overlayPane()?.querySelector<HTMLElement>('#plan-seats-error');
      expect(error).not.toBeNull();
      expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(error?.id);
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(document.activeElement).toBe(input);
      expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
    });
  }

  for (const value of [NaN, Infinity, -Infinity]) {
    it(`rejects a nonfinite ${value} form value even when it bypasses native input sanitization`, async () => {
      const { fixture, host } = setup();
      (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
      await settle(fixture);
      const input = overlayPane()!.querySelector<HTMLInputElement>('#plan-seats')!;
      // Number inputs sanitize nonnumeric strings to empty; exercise the typed form boundary too.
      getDebugNode(input)!.injector.get(NgControl).control!.setValue(value);
      overlayButton('Confirm plan')!.click();
      await settle(fixture);
      expect(overlayPane()?.querySelector('#plan-seats-error')?.textContent).toContain('finite whole number');
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
    });
  }

  for (const cadence of ['monthly', 'annual']) {
    for (const seats of [1, 1000]) {
      it(`confirms the ${seats}-seat boundary with captured ${cadence} arithmetic after correcting an error`, async () => {
        const { fixture, host } = setup();
        (host.querySelector(`#billing-${cadence}`) as HTMLInputElement).click();
        fixture.detectChanges();
        (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
        await settle(fixture);
        expect(overlayPane()?.textContent).toContain(
          cadence === 'annual' ? '$374.40/year' : '$39.00/mo, billed monthly',
        );
        setSeats('0');
        overlayButton('Confirm plan')!.click();
        await settle(fixture);
        setSeats(String(seats));
        await settle(fixture);
        const input = overlayPane()!.querySelector<HTMLInputElement>('#plan-seats')!;
        expect(input.getAttribute('aria-invalid')).not.toBe('true');
        expect(input.getAttribute('aria-describedby')).toBe('plan-seats-hint');
        expect(overlayPane()?.querySelector('#plan-seats-error')).toBeNull();
        overlayButton('Confirm plan')!.click();
        await settle(fixture);
        const result = summaryText(host, 'confirmation-result');
        expect(result).toContain(`Team confirmed: ${seats} ${seats === 1 ? 'seat ×' : 'seats ×'}`);
        if (cadence === 'annual') {
          expect(result).toContain(
            seats === 1 ? '$31.20/mo, billed as $374.40 per year' : '$31200.00/mo, billed as $374400.00 per year',
          );
        } else {
          expect(result).toContain(seats === 1 ? '$39.00/mo, billed monthly' : '$39000.00/mo, billed monthly');
        }
        expect(summaryText(host, 'selection-summary')).toContain('Preview confirmed below');
        expect(summaryText(host, 'selection-summary')).not.toContain('in the dialog');
      });
    }
  }

  it('restores focus on cancellation and permits a fresh confirmation', async () => {
    const { fixture, host } = setup();
    const trigger = host.querySelector<HTMLButtonElement>('[data-testid="select-plan-team"]')!;
    trigger.focus();
    trigger.click();
    await settle(fixture);
    overlayButton('Cancel')!.click();
    await settle(fixture);
    expect(document.activeElement).toBe(trigger);
    expect(summaryText(host, 'selection-summary')).toContain('cancelled');
    trigger.click();
    await settle(fixture);
    overlayButton('Confirm plan')!.click();
    await settle(fixture);
    expect(summaryText(host, 'confirmation-result')).toContain('5 seats');
  });

  for (const boundary of ['cadence', 'readonly', 'preview', 'reload', 'destroy']) {
    it(`closes the actual overlay on ${boundary}`, async () => {
      const { fixture, host } = setup();
      (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
      await settle(fixture);
      const page = fixture.componentInstance as unknown as {
        setReadOnly(value: boolean): void;
        setViewState(value: 'empty'): void;
        reload(): Promise<void>;
      };
      if (boundary === 'cadence') (host.querySelector('#billing-annual') as HTMLInputElement).click();
      if (boundary === 'readonly') page.setReadOnly(true);
      if (boundary === 'preview') page.setViewState('empty');
      if (boundary === 'reload') await page.reload();
      if (boundary === 'destroy') fixture.destroy();
      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(overlayPane()).toBeNull();
      if (boundary !== 'destroy') {
        await settle(fixture);
        expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
      }
    });
  }

  it('contains narrow pending, invalid, confirmed, cancelled and readonly states with one routed title', async () => {
    const { fixture, host } = setup();
    host.style.cssText = 'display:block;width:280px;position:absolute;top:0;left:0;';
    const fits = () => {
      expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth + 1);
      expect(host.querySelectorAll('h2').length).toBe(1);
    };
    fits();
    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);
    fits();
    setSeats('1.5');
    overlayButton('Confirm plan')!.click();
    await settle(fixture);
    const pane = overlayPane()!;
    expect(pane.scrollWidth).toBeLessThanOrEqual(pane.clientWidth + 1);
    expect(pane.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
    setSeats('1000');
    await settle(fixture);
    overlayButton('Confirm plan')!.click();
    await settle(fixture);
    expect(overlayPane()).toBeNull();
    expect(summaryText(host, 'confirmation-result')).toContain('Team confirmed: 1000 seats');
    fits();
    (host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement).click();
    await settle(fixture);
    overlayButton('Cancel')!.click();
    await settle(fixture);
    fits();
    (fixture.componentInstance as unknown as { setReadOnly(value: boolean): void }).setReadOnly(true);
    await settle(fixture);
    fits();
  });

  it('handles enterprise contact without a dialog and with one visible result', async () => {
    const { fixture, host } = setup();

    (host.querySelector('[data-testid="select-plan-enterprise"]') as HTMLButtonElement).click();
    await settle(fixture);

    expect(overlayPane()).toBeNull('enterprise contact never opens the confirmation dialog');
    const outcomes = host.querySelectorAll('[data-testid="confirmation-result"]');
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].textContent).toContain('Enterprise inquiry noted');
    expect(outcomes[0].textContent).toContain('sales@example.com');
    expect(host.querySelector('[data-testid="enterprise-mailto"]')?.getAttribute('href')).toBe(
      'mailto:sales@example.com',
    );
  });

  it('disables selection in read-only preview with an explanation', () => {
    const { fixture, host } = setup();
    const page = fixture.componentInstance as unknown as { readOnly: { set: (value: boolean) => void } };
    page.readOnly.set(true);
    fixture.detectChanges();
    const choose = host.querySelector('[data-testid="select-plan-team"]') as HTMLButtonElement;
    const contact = host.querySelector('[data-testid="select-plan-enterprise"]') as HTMLButtonElement;
    expect(choose.disabled).toBeTrue();
    expect(contact.disabled).toBeTrue();
    expect(host.textContent).toContain('Read-only preview');
    choose.click();
    contact.click();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="confirmation-result"]')).toBeNull();
  });

  it('reloads through the deterministic simulator, honoring simulated failure', async () => {
    const { fixture, host } = setup();
    const page = fixture.componentInstance as unknown as {
      viewState: { set: (state: 'loading' | 'empty' | 'error' | 'loaded') => void };
      simulateFailure: { set: (value: boolean) => void };
      reload: () => Promise<void>;
    };
    page.simulateFailure.set(true);
    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[role="alert"]')).not.toBeNull();

    page.simulateFailure.set(false);
    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="plan-plan-team"]')).not.toBeNull();
  });
});
