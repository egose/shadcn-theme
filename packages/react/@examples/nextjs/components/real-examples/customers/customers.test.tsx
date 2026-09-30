import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CustomersExample from './index';
import { SEARCH_DEBOUNCE_MS } from './use-customers-controller';
import * as simulation from '../_shared/async-simulation';

// Vitest globals are disabled, so RTL auto-cleanup never registers.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function renderExample() {
  render(<CustomersExample />);
}

function searchInput() {
  return screen.getByLabelText('Search customers') as HTMLInputElement;
}

function resultCount() {
  // The result-count paragraph is the only persistent polite status region.
  return screen.getByText(/^\d+ customers?( — showing .+)?$/, { selector: 'p' });
}

function openMenuFor(name: string) {
  const trigger = screen.getAllByLabelText(`Actions for ${name}`)[0] as HTMLButtonElement;
  fireEvent.pointerDown(trigger);
  return trigger;
}

describe('CustomersExample — debounced search', () => {
  it('recomputes filtering only after the documented debounce delay', () => {
    vi.useFakeTimers();
    try {
      renderExample();
      expect(resultCount().textContent).toBe('12 customers — showing 1–5');

      fireEvent.change(searchInput(), { target: { value: 'tanaka' } });
      // Before the debounce delay elapses, results are unchanged.
      expect(resultCount().textContent).toBe('12 customers — showing 1–5');

      act(() => {
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);
      });
      expect(resultCount().textContent).toBe('12 customers — showing 1–5');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(resultCount().textContent).toBe('1 customer — showing 1–1');
      expect(screen.getAllByText('Kira Tanaka').length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('CustomersExample — filters, reset, and pagination', () => {
  it('paginates the fixture rows in stable order', () => {
    renderExample();
    expect(resultCount().textContent).toBe('12 customers — showing 1–5');

    fireEvent.click(screen.getByRole('link', { name: '2' }));
    expect(resultCount().textContent).toBe('12 customers — showing 6–10');
    expect(screen.getByRole('link', { name: '2' }).getAttribute('aria-current')).toBe('page');

    fireEvent.click(screen.getByRole('link', { name: 'Go to next page' }));
    expect(resultCount().textContent).toBe('12 customers — showing 11–12');
  });

  it('reset clears query/filters and restores the full first page', () => {
    renderExample();
    fireEvent.click(screen.getByRole('link', { name: '2' }));
    fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'archived' } });
    expect(resultCount().textContent).toBe('2 customers — showing 1–2');

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(resultCount().textContent).toBe('12 customers — showing 1–5');
    expect((screen.getByLabelText('Filter by status') as HTMLSelectElement).value).toBe('all');
    expect(searchInput().value).toBe('');
    // Back on page 1.
    expect(screen.getByRole('link', { name: '1' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: '2' }).getAttribute('aria-current')).toBeNull();
  });
});

describe('CustomersExample — inspectable states', () => {
  it('exposes loading, initial-empty, error/retry, and loaded via the toolbar', () => {
    renderExample();
    fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
    expect(screen.getByText('Loading customers…')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Empty' }));
    expect(screen.getByText(/No customers yet/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    expect(screen.getByRole('alert').textContent).toContain('Customers could not be loaded');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(resultCount().textContent).toBe('0 customers');
  });

  it('shows a distinct filtered-empty state when no customers match', () => {
    renderExample();
    fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'archived' } });
    fireEvent.change(screen.getByLabelText('Filter by plan'), { target: { value: 'free' } });
    expect(resultCount().textContent).toBe('0 customers');
    expect(screen.getByText('No customers match the current filters.')).toBeTruthy();
  });
});

describe('CustomersExample — resource representations', () => {
  it.each(['table', 'cards'] as const)(
    'clamps the shared page after archiving the last-page rows from %s',
    async (surface) => {
      vi.useFakeTimers();
      renderExample();
      fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'active' } });
      fireEvent.click(screen.getByRole('link', { name: '2' }));
      expect(resultCount().textContent).toBe('8 customers — showing 6–8');

      for (const name of ['Henrik Sorensen', 'Kira Tanaka', 'Leila Haddad']) {
        const records =
          surface === 'table' ? screen.getByRole('table') : screen.getByRole('list', { name: 'Customers (card list)' });
        fireEvent.pointerDown(within(records).getByLabelText(`Actions for ${name}`));
        fireEvent.click(screen.getByRole('menuitem', { name: 'Archive…' }));
        fireEvent.click(screen.getByRole('button', { name: 'Archive customer' }));
        await act(() => vi.advanceTimersByTimeAsync(400));
        await act(() => vi.advanceTimersByTimeAsync(0));
        expect(screen.queryByText(name)).toBeNull();
      }

      expect(resultCount().textContent).toBe('5 customers — showing 1–5');
      expect(screen.queryByRole('navigation', { name: 'Customer pages' })).toBeNull();
      expect(document.activeElement).toBe(searchInput());
      const table = screen.getByRole('table');
      const cards = screen.getByRole('list', { name: 'Customers (card list)' });
      const actions = (element: HTMLElement) =>
        within(element)
          .getAllByRole('button')
          .map((button) => button.getAttribute('aria-label'));
      expect(actions(table)).toEqual(actions(cards));
      expect(actions(table)).toHaveLength(5);
      // The session, filters and clamped result survive temporary view unmounts.
      fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
      fireEvent.click(screen.getByRole('button', { name: 'Error' }));
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      expect(resultCount().textContent).toBe('5 customers — showing 1–5');
      fireEvent.change(screen.getByLabelText('Filter by plan'), { target: { value: 'team' } });
      expect(resultCount().textContent).toBe('2 customers — showing 1–2');
      expect(within(screen.getByRole('table')).getByText('Farah Noor')).toBeTruthy();
      expect(within(screen.getByRole('list', { name: 'Customers (card list)' })).getByText('Farah Noor')).toBeTruthy();
    },
  );

  it('renders one model as a captioned desktop table and a labeled card list', () => {
    renderExample();
    const table = screen.getByRole('table', {
      name: 'Customer records with plan, status, creation date, and row actions.',
    });
    expect(table).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toBeTruthy();
    expect(screen.getByRole('list', { name: 'Customers (card list)' })).toBeTruthy();
    // Same data in both representations (fixture state is not duplicated).
    expect(screen.getAllByText('Ada Okafor')).toHaveLength(2);
    // Avatar fallbacks are initials — no remote images.
    expect(screen.getAllByText('AO').length).toBe(2);
    // Archived-row fixture carries a text-backed status badge.
    const archivedRow = screen.getAllByText('Efe Mensah')[0].closest('tr');
    expect(archivedRow?.textContent).toContain('Archived');

    // Disabled-row fixture (page 2) announces unavailability.
    fireEvent.click(screen.getByRole('link', { name: '2' }));
    const disabledTrigger = screen.getAllByLabelText('Actions for Grace Liu (unavailable)')[0];
    expect(disabledTrigger.hasAttribute('disabled')).toBe(true);
  });
});

describe('CustomersExample — rename workflow', () => {
  it('opens from a keyboard-reachable action, validates input, and updates on success', async () => {
    vi.useFakeTimers();
    try {
      renderExample();
      const trigger = screen.getAllByLabelText('Actions for Ada Okafor')[0] as HTMLButtonElement;
      // Actions are reachable without hover: keyboard activation opens the menu.
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'Enter' });
      fireEvent.click(screen.getByRole('menuitem', { name: 'Rename…' }));

      const dialog = screen.getByRole('dialog', { name: 'Rename Ada Okafor' });
      const input = screen.getByLabelText('Customer name');

      // Blank names are rejected inline and keep the dialog open.
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save name' }));
      expect(screen.getByRole('alert').textContent).toBe('Enter a customer name.');
      expect(dialog).toBeTruthy();

      fireEvent.change(input, { target: { value: 'Ada Lovelace Okafor' } });
      fireEvent.click(screen.getByRole('button', { name: 'Save name' }));
      expect(screen.getByText('Saving customer…')).toBeTruthy();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByText('Renamed Ada Okafor to Ada Lovelace Okafor.')).toBeTruthy();
      expect(screen.getAllByText('Ada Lovelace Okafor').length).toBeGreaterThan(0);
      // Focus restored to the row action that opened the dialog.
      expect(document.activeElement).toBe(trigger);
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancel preserves the name and restores focus to the row action', async () => {
    renderExample();
    const trigger = openMenuFor('Ada Okafor');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename…' }));
    fireEvent.change(screen.getByLabelText('Customer name'), { target: { value: 'Discarded Name' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getAllByText('Ada Okafor').length).toBe(2);
    expect(screen.queryByText('Discarded Name')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});

describe('CustomersExample — archive workflow', () => {
  it('requires explicit confirmation; cancel preserves the customer', async () => {
    renderExample();
    const trigger = openMenuFor('Ada Okafor');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Archive…' }));

    const dialog = screen.getByRole('alertdialog', { name: 'Archive Ada Okafor?' });
    expect(dialog).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('alertdialog')).toBeNull();
    // Nothing changed: no notice, still an active badge in Ada's row.
    expect(screen.queryByText('Archived Ada Okafor.')).toBeNull();
    const row = screen.getAllByText('Ada Okafor')[0].closest('tr');
    expect(row?.textContent).toContain('Active');
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('confirm archives the customer and updates visible status', async () => {
    vi.useFakeTimers();
    try {
      renderExample();
      openMenuFor('Ada Okafor');
      fireEvent.click(screen.getByRole('menuitem', { name: 'Archive…' }));
      const confirm = screen.getByRole('button', { name: 'Archive customer' });
      fireEvent.click(confirm);

      expect(screen.getByText('Archiving customer…')).toBeTruthy();
      // Pending: dialog cannot be dismissed and confirm stays disabled.
      expect((screen.getByRole('button', { name: 'Archive customer' }) as HTMLButtonElement).disabled).toBe(true);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      expect(screen.queryByRole('alertdialog')).toBeNull();
      expect(screen.getByText('Archived Ada Okafor.')).toBeTruthy();
      const row = screen.getAllByText('Ada Okafor')[0].closest('tr');
      expect(row?.textContent).toContain('Archived');
      expect(row?.textContent).not.toContain('Active');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('CustomersExample — add workflow', () => {
  it('adds a customer via the text-input dialog after confirmation', async () => {
    vi.useFakeTimers();
    try {
      renderExample();
      fireEvent.click(screen.getByRole('button', { name: 'Add customer' }));
      const dialog = screen.getByRole('dialog', { name: 'Add customer' });
      fireEvent.change(screen.getByLabelText('Customer name'), { target: { value: 'Marta Silva' } });
      // The submit button is inside the dialog; the header action is not.
      const buttons = screen.getAllByRole('button', { name: 'Add customer' });
      fireEvent.click(buttons.find((button) => dialog.contains(button)) ?? buttons[1]);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      expect(screen.getByText('Added Marta Silva.')).toBeTruthy();
      expect(resultCount().textContent).toBe('13 customers — showing 1–5');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('CustomersExample — recovery and settlement', () => {
  it('falls back to search when a connected responsive opener cannot receive focus', async () => {
    vi.useFakeTimers();
    renderExample();
    const trigger = openMenuFor('Ada Okafor');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename…' }));
    // jsdom does not implement CSS visibility. Model the browser's no-op focus
    // on a display:none table/card opener; EXB-08 also checks actual resizing.
    vi.spyOn(trigger, 'focus').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(trigger.isConnected).toBe(true);
    expect(document.activeElement).toBe(searchInput());
  });

  it('captures the outcome at submission while the retained dialog picker controls the next retry', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    renderExample();
    fireEvent.click(screen.getByRole('button', { name: 'Add customer' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByRole('radiogroup')).toHaveLength(1);
    fireEvent.change(screen.getByLabelText('Customer name'), { target: { value: 'Outcome snapshot' } });
    fireEvent.click(within(dialog).getByRole('radio', { name: 'Simulate failure' }));
    const submit = within(dialog).getByRole('button', { name: 'Add customer' });
    fireEvent.click(submit);
    fireEvent.click(within(dialog).getByRole('radio', { name: 'Simulate success' }));
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(within(dialog).getByRole('alert').textContent).toContain('Could not add');
    expect(operation).toHaveBeenNthCalledWith(1, 'Outcome snapshot', { outcome: 'failure' });
    fireEvent.click(submit);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(operation).toHaveBeenNthCalledWith(2, 'Outcome snapshot', { outcome: 'success' });
    expect(screen.getByText('Added Outcome snapshot.')).toBeTruthy();
    expect(screen.getAllByRole('radiogroup', { name: 'Simulated mutation outcome:' })).toHaveLength(1);
  });

  it.each(['add', 'rename'] as const)('retains failed %s input and retries the actual operation once', async (mode) => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    renderExample();
    fireEvent.click(screen.getByRole('radio', { name: 'Simulate failure' }));
    if (mode === 'add') fireEvent.click(screen.getByRole('button', { name: 'Add customer' }));
    else {
      openMenuFor('Ada Okafor');
      fireEvent.click(screen.getByRole('menuitem', { name: 'Rename…' }));
    }
    const input = screen.getByLabelText('Customer name');
    fireEvent.change(input, { target: { value: 'Retained customer' } });
    const submit = within(screen.getByRole('dialog')).getByRole('button', {
      name: mode === 'add' ? 'Add customer' : 'Save name',
    });
    fireEvent.click(submit);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(input).toHaveProperty('value', 'Retained customer');
    expect(within(screen.getByRole('dialog')).getByRole('alert').textContent).toContain('No changes were made');
    expect(document.activeElement).toBe(input);
    fireEvent.click(screen.getByRole('radio', { name: 'Simulate success' }));
    fireEvent.click(submit);
    fireEvent.click(submit);
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(operation).toHaveBeenCalledTimes(2);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(
      screen.getByText(mode === 'add' ? 'Added Retained customer.' : 'Renamed Ada Okafor to Retained customer.'),
    ).toBeTruthy();
    expect(operation).toHaveBeenLastCalledWith('Retained customer', expect.any(Object));
  });

  it('starts with an actual empty dataset and adds the first visible customer', async () => {
    vi.useFakeTimers();
    renderExample();
    fireEvent.change(screen.getByLabelText('Filter by plan'), { target: { value: 'team' } });
    fireEvent.click(screen.getByRole('button', { name: 'Empty' }));
    expect(screen.queryByText('Ada Okafor')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Add customer' }));
    fireEvent.change(screen.getByLabelText('Customer name'), { target: { value: 'First customer' } });
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add customer' }));
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(resultCount().textContent).toBe('1 customer — showing 1–1');
    expect(screen.getAllByText('First customer')).toHaveLength(2);
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Add customer' }));
  });

  it.each(['rename', 'archive'] as const)('focuses search after filtered %s removes its opener', async (mode) => {
    vi.useFakeTimers();
    renderExample();
    if (mode === 'rename') {
      fireEvent.change(searchInput(), { target: { value: 'Ada Okafor' } });
      await act(() => vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS));
    } else fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'active' } });
    const trigger = openMenuFor('Ada Okafor');
    fireEvent.click(screen.getByRole('menuitem', { name: mode === 'rename' ? 'Rename…' : 'Archive…' }));
    if (mode === 'rename') fireEvent.change(screen.getByLabelText('Customer name'), { target: { value: 'New name' } });
    fireEvent.click(screen.getByRole('button', { name: mode === 'rename' ? 'Save name' : 'Archive customer' }));
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(trigger.isConnected).toBe(false);
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(document.activeElement).toBe(searchInput());
  });

  it('retains archive failure feedback and retries from the restored row action', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    renderExample();
    fireEvent.click(screen.getByRole('radio', { name: 'Simulate failure' }));
    const trigger = openMenuFor('Ada Okafor');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Archive…' }));
    fireEvent.click(screen.getByRole('button', { name: 'Archive customer' }));
    await act(() => vi.advanceTimersByTimeAsync(400));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(screen.getByRole('alert').textContent).toContain('Could not archive Ada Okafor');
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(screen.getByRole('radio', { name: 'Simulate success' }));
    openMenuFor('Ada Okafor');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Archive…' }));
    const confirm = screen.getByRole('button', { name: 'Archive customer' });
    fireEvent.click(confirm);
    fireEvent.click(confirm);
    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' });
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    expect(operation).toHaveBeenCalledTimes(2);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(screen.getByText('Archived Ada Okafor.')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('uses search on cancel when an already queued search removes the opener', async () => {
    vi.useFakeTimers();
    renderExample();
    fireEvent.change(searchInput(), { target: { value: 'tanaka' } });
    const trigger = openMenuFor('Ada Okafor');
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename…' }));
    await act(() => vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS));
    expect(trigger.isConnected).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(document.activeElement).toBe(searchInput());
  });
});
