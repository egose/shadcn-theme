import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ExampleStateToolbar, type ExampleState } from './example-state-toolbar';
import { isSimulatedError, simulate } from './async-simulation';
import { EMPTY_RESULTS, FIXTURE_NOW, LONG_LABEL, addDaysUtc, avatarFallbackFor, stableId } from './fixtures';

// Vitest globals are disabled, so RTL auto-cleanup never registers.
afterEach(() => cleanup());

describe('ExampleStateToolbar', () => {
  it('exposes loading, empty, error, and loaded states without a backend', () => {
    render(<ExampleStateToolbar value="loaded" onValueChange={() => {}} />);
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar.getAttribute('aria-label')).toContain('not part of the product surface');
    for (const label of ['Loading', 'Empty', 'Error', 'Loaded']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
  });

  it('marks the active state with aria-pressed', () => {
    render(<ExampleStateToolbar value="empty" onValueChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Empty' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Loaded' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('reports state changes', () => {
    const calls: ExampleState[] = [];
    render(<ExampleStateToolbar value="loaded" onValueChange={(s) => calls.push(s)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
    expect(calls).toEqual(['error', 'loading']);
  });

  it('can restrict the offered states', () => {
    render(<ExampleStateToolbar value="error" onValueChange={() => {}} states={['error', 'loaded']} />);
    expect(screen.queryByRole('button', { name: 'Empty' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Error' })).toBeTruthy();
  });
});

describe('simulate (deterministic async simulation)', () => {
  it('resolves identical data for identical inputs', async () => {
    const payload = { id: 'customer-001', name: 'Ava Stone' };
    const first = await simulate(payload, { outcome: 'success', delayMs: 0 });
    const second = await simulate(payload, { outcome: 'success', delayMs: 0 });
    expect(first).toEqual(payload);
    expect(second).toEqual(first);
  });

  it('rejects deterministically on an explicit failure outcome', async () => {
    const attempt = () => simulate('x', { outcome: 'failure', delayMs: 0, failureMessage: 'Upgrade failed' });
    await expect(attempt()).rejects.toThrow('Upgrade failed');
    await expect(attempt()).rejects.toMatchObject({ __simulated: true });
  });

  it('honors the fixed delay before resolving', async () => {
    vi.useFakeTimers();
    try {
      let settled = false;
      const pending = simulate('ok', { outcome: 'success', delayMs: 400 }).then(() => {
        settled = true;
      });
      await vi.advanceTimersByTimeAsync(399);
      expect(settled).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      await pending;
      expect(settled).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('tags only simulated errors', async () => {
    const simulated = await simulate(null, { outcome: 'failure', delayMs: 0 }).catch((e: unknown) => e);
    expect(isSimulatedError(simulated)).toBe(true);
    expect(isSimulatedError(new Error('real'))).toBe(false);
    expect(isSimulatedError('boom')).toBe(false);
  });
});

describe('fixture conventions', () => {
  it('uses a fixed UTC instant that survives time-zone changes', () => {
    expect(FIXTURE_NOW).toBe('2026-03-09T12:00:00.000Z');
    // UTC day arithmetic must not depend on the local time zone.
    expect(addDaysUtc(FIXTURE_NOW, 30)).toBe('2026-04-08T12:00:00.000Z');
    expect(addDaysUtc(FIXTURE_NOW, -1)).toBe('2026-03-08T12:00:00.000Z');
  });

  it('generates stable, padded IDs', () => {
    expect(stableId('customer', 1)).toBe('customer-001');
    expect(stableId('customer', 42)).toBe('customer-042');
    expect(stableId('customer', 1)).toBe(stableId('customer', 1));
  });

  it('derives avatar fallbacks from names', () => {
    expect(avatarFallbackFor('Ava Stone')).toBe('AS');
    expect(avatarFallbackFor('Cher')).toBe('C');
    expect(avatarFallbackFor('Ada  Lovelace  III')).toBe('AL');
  });

  it('keeps long-text and zero-result coverage available', () => {
    expect(LONG_LABEL.length).toBeGreaterThan(60);
    expect(EMPTY_RESULTS).toHaveLength(0);
  });
});
