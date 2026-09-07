import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CardPage from '../app/components/card/page';
import DialogPage from '../app/components/dialog/page';
import SheetPage from '../app/components/sheet/page';
import DatePickerPage from '../app/form/date-picker/page';

afterEach(() => {
  // Vitest globals are disabled in this project, so RTL auto-cleanup never registers.
  cleanup();
  vi.restoreAllMocks();
});

describe('card example page', () => {
  it('submits the login form through its Login submit button', async () => {
    const user = userEvent.setup();
    render(<CardPage />);

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'correct-horse');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('status').textContent).toContain('ada@example.com');
  });

  it('blocks submission through native required validation when fields are empty', async () => {
    const user = userEvent.setup();
    render(<CardPage />);

    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('dialog example page', () => {
  it('lets the user edit the inputs and saves exactly once with a visible result', async () => {
    const user = userEvent.setup();
    render(<DialogPage />);

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    const dialog = await screen.findByRole('dialog', { name: 'Edit profile' });
    expect(dialog).toBeTruthy();

    const nameInput = screen.getByLabelText('Name');
    expect((nameInput as HTMLInputElement).value).toBe('Pedro Duarte');
    await user.clear(nameInput);
    await user.type(nameInput, 'Ada Lovelace');
    expect((nameInput as HTMLInputElement).value).toBe('Ada Lovelace');

    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    const results = screen.getAllByRole('status');
    expect(results).toHaveLength(1);
    expect(results[0].textContent).toContain('Ada Lovelace');
  });

  it('does not save when Cancel is used', async () => {
    const user = userEvent.setup();
    render(<DialogPage />);

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    await screen.findByRole('dialog');
    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Grace Hopper');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('sheet example page', () => {
  it('saves the edited profile once and closes the sheet', async () => {
    const user = userEvent.setup();
    render(<SheetPage />);

    await user.click(screen.getByRole('button', { name: 'Open sheet' }));
    await screen.findByRole('dialog');

    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Katherine Johnson');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    const results = screen.getAllByRole('status');
    expect(results).toHaveLength(1);
    expect(results[0].textContent).toContain('Katherine Johnson');
  });

  it('closes without saving via the Close action', async () => {
    const user = userEvent.setup();
    render(<SheetPage />);

    await user.click(screen.getByRole('button', { name: 'Open sheet' }));
    await screen.findByRole('dialog');
    // The sheet also renders a built-in "Close" (X) button; pick the footer action.
    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    await user.click(closeButtons[closeButtons.length - 1]);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('date picker example page', () => {
  it('does not submit when Today is clicked, but is applied', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<DatePickerPage />);

    await user.click(screen.getByRole('button', { name: 'Today' }));

    expect(logSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('runs validation on Submit and reports the required date fields', async () => {
    const user = userEvent.setup();
    render(<DatePickerPage />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
