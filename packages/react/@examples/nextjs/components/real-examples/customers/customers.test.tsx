import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CustomersExample, { SEARCH_DEBOUNCE_MS } from './index';

// Vitest globals are disabled, so RTL auto-cleanup never registers.
afterEach(() => cleanup());

function renderExample() {
  render(<CustomersExample />);
}

function searchInput() {
  return screen.getByLabelText('Search customers') as HTMLInputElement;
}

function resultCount() {
  // The result-count paragraph is the only persistent polite status region.
  return screen.getByText(/customers?( — showing .+)?$/, { selector: 'p' });
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
    expect(resultCount().textContent).toBe('12 customers — showing 1–5');
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
