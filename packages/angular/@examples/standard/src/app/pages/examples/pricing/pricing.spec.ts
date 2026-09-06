import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  await new Promise((resolve) => setTimeout(resolve, 100));
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
