import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_LAUNCH_REQUEST } from '../fixtures';
import type { LaunchRequestValues } from '../types';
import { LaunchDateField } from './launch-date-field';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function DateForm() {
  const methods = useForm<LaunchRequestValues>({
    defaultValues: { ...DEFAULT_LAUNCH_REQUEST, launchDate: null },
    mode: 'onBlur',
  });
  return (
    <>

      <LaunchDateField control={methods.control} />
            <button type="button">After date</button>

      <button type="button" onClick={() => methods.setFocus('launchDate')}>
        Focus date
      </button>

      <button type="button" onClick={() => void methods.trigger('launchDate', { shouldFocus: true })}>
        Validate date
      </button>
            <p>{methods.formState.touchedFields.launchDate ? 'Date touched' : 'Date untouched'}</p>

    </>
  );
}

function dateTrigger() {
  return screen.getByRole('combobox', { name: 'Launch date Pick a date' });
}

// Allow portal close-auto-focus and the composite's deferred blur check to settle.
async function settleFocus() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
  });
}

describe('LaunchDateField — RHF focus and composite blur', { timeout: 15_000 }, () => {
  it('supports setFocus/trigger focus and only validates on leaving the trigger plus calendar', async () => {
    const user = userEvent.setup();
    render(<DateForm />);
    await user.click(screen.getByRole('button', { name: 'Focus date' }));
    expect(document.activeElement).toBe(dateTrigger());
    await user.keyboard('{Enter}');
    const dialog = screen.getByRole('dialog', { name: 'Choose launch date' });
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard('{ArrowRight}{ArrowDown}');
    await settleFocus();
    expect(screen.getByText('Date untouched')).toBeTruthy();
    expect(screen.queryByText('Launch date is required.')).toBeNull();
    await user.keyboard('{Escape}');
    await settleFocus();
    expect(document.activeElement).toBe(dateTrigger());
    expect(screen.getByText('Date untouched')).toBeTruthy();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After date' }));
    expect(await screen.findByText('Date touched')).toBeTruthy();
    expect(await screen.findByText('Launch date is required.')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Validate date' }));
    expect(document.activeElement).toBe(dateTrigger());
    const errorId = dateTrigger().getAttribute('aria-describedby');
    expect(document.getElementById(errorId!)?.textContent).toBe('Launch date is required.');
  });

  it('reports blur after outside dismissal without restoring focus over the outside destination', async () => {
    const user = userEvent.setup();
    render(<DateForm />);
    await user.click(dateTrigger());
    await settleFocus();
    expect(screen.getByText('Date untouched')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'After date' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await settleFocus();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After date' }));
    expect(screen.getByText('Date touched')).toBeTruthy();
    expect(screen.getByText('Launch date is required.')).toBeTruthy();
  });
});
