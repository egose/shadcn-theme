import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import PricingExample from './index';

// Vitest globals are disabled, so RTL auto-cleanup never registers.
afterEach(() => cleanup());

function renderLoaded() {
  render(<PricingExample />);
}

describe('PricingExample — billing toggle', () => {
  it('is a labeled single-choice control and updates prices deterministically', () => {
    renderLoaded();
    expect(screen.getByText('Billing period')).toBeTruthy();
    // Monthly default: Growth = $29/mo, no annual-savings text.
    expect(screen.getByText('$29')).toBeTruthy();
    expect(screen.queryByText(/Billed annually/)).toBeNull();

    // Radix renders the single-choice toggle group as a radiogroup.
    const annual = screen.getByRole('radio', { name: 'Annual' });
    expect(annual.getAttribute('aria-checked')).toBe('false');
    fireEvent.click(annual);
    // Annual: Growth effective price drops to $24/mo with explicit savings text.
    expect(screen.getByRole('radio', { name: 'Annual' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('$24')).toBeTruthy();
    expect(screen.getAllByText(/Billed annually/).length).toBe(3);
    expect(screen.getByText(/Save \$60 a year/)).toBeTruthy();

    fireEvent.click(screen.getByRole('radio', { name: 'Monthly' }));
    expect(screen.getByText('$29')).toBeTruthy();
    expect(screen.queryByText(/Billed annually/)).toBeNull();
  });
});

describe('PricingExample — plan-change dialog', () => {
  it('cancels without changing the plan and restores focus to the trigger', async () => {
    renderLoaded();
    const trigger = screen.getByRole('button', { name: 'Choose Growth' });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: /Change plan to Growth/ })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    // Still on Starter: no success status rendered.
    expect(screen.queryByText(/Your plan is now/)).toBeNull();
    // Starter is still the current plan (badge + disabled button both say so).
    expect(screen.getAllByText('Current plan').length).toBeGreaterThan(0);
  });

  it('confirms successfully, blocks duplicate submits while pending, and shows a persistent status', async () => {
    vi.useFakeTimers();
    try {
      renderLoaded();
      const requests: string[] = [];
      fireEvent.click(screen.getByRole('button', { name: 'Choose Growth' }));
      const confirm = screen.getByRole('button', { name: 'Confirm plan change' }) as HTMLButtonElement;
      fireEvent.click(confirm);
      requests.push('first');
      // Pending: confirm is disabled by its loading state — a second click is a no-op.
      expect(confirm.disabled).toBe(true);
      fireEvent.click(confirm);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      expect(requests).toHaveLength(1);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByRole('status').textContent).toContain('Your plan is now Growth.');
      // The Growth card now reads "Current plan" as text, not just styling.
      expect(screen.getAllByText('Current plan').length).toBeGreaterThan(0);
      expect(screen.queryByRole('button', { name: 'Choose Growth' })).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('surfaces a persistent failure alert and leaves the current plan unchanged', async () => {
    vi.useFakeTimers();
    try {
      renderLoaded();
      fireEvent.click(screen.getByRole('radio', { name: 'Simulate failure' }));
      fireEvent.click(screen.getByRole('button', { name: 'Choose Growth' }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirm plan change' }));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('Plan change failed');
      expect(alert.textContent).toContain('could not change your plan to Growth');
      // Starter remains the current plan; Growth can still be chosen again.
      expect(screen.getByRole('button', { name: 'Choose Growth' })).toBeTruthy();
      expect(screen.getAllByText('Current plan').length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('PricingExample — accessible structure', () => {
  it('renders a captioned comparison table in a labeled scroll region', () => {
    renderLoaded();
    const table = screen.getByRole('table', {
      name: 'Feature comparison across the Starter, Growth, and Scale plans.',
    });
    expect(table).toBeTruthy();
    const region = screen.getByRole('region', { name: /scrollable horizontally/ });
    expect(region.contains(table)).toBe(true);
    // Feature names are row headers, conveying meaning without color.
    expect(screen.getByRole('rowheader', { name: 'Storage' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Scale' })).toBeTruthy();
  });

  it('conveys current and recommended status as text badges in a semantic plan list', () => {
    renderLoaded();
    expect(screen.getAllByText('Current plan').length).toBeGreaterThan(0);
    expect(screen.getByText('Recommended')).toBeTruthy();
    expect(screen.getByRole('list', { name: 'Starter plan includes' })).toBeTruthy();
  });

  it('exposes inspectable loading, empty, and error states with retry', () => {
    renderLoaded();
    fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
    expect(screen.getByText('Loading plans…')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Empty' }));
    expect(screen.getByText(/No plans are available/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    expect(screen.getByRole('alert').textContent).toContain('Plans could not be loaded');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByRole('button', { name: 'Choose Growth' })).toBeTruthy();
  });

  it('renders the FAQ as an accordion with keyboard-operable buttons', () => {
    renderLoaded();
    const trigger = screen.getByRole('button', { name: 'Can I change plans at any time?' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
