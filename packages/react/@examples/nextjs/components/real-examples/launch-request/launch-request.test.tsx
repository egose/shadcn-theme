import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import * as simulation from '../_shared/async-simulation';
import LaunchRequestExample from './index';

beforeAll(() => {
  // jsdom has no ResizeObserver; Radix primitives (checkbox, toggles) require one.
  if (!('ResizeObserver' in globalThis)) {
    class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
  }
});

// Vitest globals are disabled, so RTL auto-cleanup never registers.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function completeForm() {
  // Only approval is off by default; everything else starts valid.
  fireEvent.click(screen.getByRole('checkbox', { name: /rollout checklist/ }));
}

async function advanceSave() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(400);
  });
}

async function submitRequest() {
  fireEvent.click(screen.getByRole('button', { name: 'Submit launch request' }));
  await act(async () => {});
}

async function discardChanges() {
  // After submission RHF revalidates edits asynchronously before publishing formState.
  await act(async () => {});
  fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
  fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Discard changes' }));
}

function projectName() {
  return screen.getByLabelText(/^Project name/) as HTMLInputElement;
}

function dateTrigger() {
  return screen.getByRole('combobox', { name: /^Launch date / });
}

function selectDay(day: string) {
  fireEvent.click(dateTrigger());
  fireEvent.click(screen.getByRole('button', { name: new RegExp(day) }));
}

function expectDate(iso: string, display: string) {
  expect(dateTrigger().textContent).toBe(display);
  expect(within(screen.getByRole('region', { name: 'Launch request review' })).getByText(iso)).toBeTruthy();
  expect(JSON.parse(screen.getByText(/"launchDate":/).textContent!).launchDate).toBe(iso);
}

// Repeated real-calendar/popover interactions need headroom on shared CI workers.
describe('LaunchRequestExample — calendar-date contract', { timeout: 15_000 }, () => {
  it('keeps the default March 30 day in the picker, review, debug JSON, and submitted payload', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    fireEvent.click(screen.getByRole('button', { name: /Debug: raw form state/ }));
    expectDate('2026-03-30', 'Mar 30, 2026');
    fireEvent.click(dateTrigger());
    expect(screen.getByRole('button', { name: /March 30th, 2026, selected/ })).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    completeForm();
    await submitRequest();
    expect(operation.mock.calls[0][0]).toMatchObject({ launchDate: '2026-03-30' });
    await advanceSave();
    expectDate('2026-03-30', 'Mar 30, 2026');
    expect(screen.getByText('Status: Submitted')).toBeTruthy();
  });

  it('saves an edited day, retains a newer pending day, and discards back to the submitted day', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    fireEvent.click(screen.getByRole('button', { name: /Debug: raw form state/ }));
    completeForm();
    selectDay('March 31st, 2026');
    expectDate('2026-03-31', 'Mar 31, 2026');
    await submitRequest();
    selectDay('April 1st, 2026');
    await advanceSave();
    expect(operation.mock.calls[0][0]).toMatchObject({ launchDate: '2026-03-31' });
    expectDate('2026-04-01', 'Apr 01, 2026');
    expect(screen.getByLabelText('Request status: Unsaved changes')).toBeTruthy();
    await discardChanges();
    expectDate('2026-03-31', 'Mar 31, 2026');
    expect(screen.getByText('Status: Submitted')).toBeTruthy();
    fireEvent.click(dateTrigger());
    expect(screen.getByRole('button', { name: /March 31st, 2026, selected/ })).toBeTruthy();
  });

  it('retains a failed date edit and restores the saved day after a clear without submitting an empty date', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    fireEvent.click(screen.getByRole('button', { name: /Debug: raw form state/ }));
    completeForm();
    selectDay('March 8th, 2026'); // US daylight-saving transition: still a calendar date.
    await submitRequest();
    await advanceSave();
    expect(operation.mock.calls[0][0]).toMatchObject({ launchDate: '2026-03-08' });
    fireEvent.click(screen.getByRole('radio', { name: 'Simulate failure' }));
    selectDay('March 9th, 2026');
    await submitRequest();
    await advanceSave();
    expectDate('2026-03-09', 'Mar 09, 2026');
    expect(screen.getByText('Save failed')).toBeTruthy();
    expect(screen.queryByText(/revision 2/)).toBeNull();
    selectDay('March 9th, 2026'); // Selecting the selected day clears the real picker.
    await submitRequest();
    expect(dateTrigger().textContent).toBe('Pick a date');
    expect(JSON.parse(screen.getByText(/"launchDate":/).textContent!).launchDate).toBeNull();
    expect(screen.getAllByText('Launch date is required.').length).toBeGreaterThan(0);
    expect(operation).toHaveBeenCalledTimes(2);
    await discardChanges();
    expectDate('2026-03-08', 'Mar 08, 2026');
    expect(screen.getByText('Status: Submitted')).toBeTruthy();
  });
});

describe('LaunchRequestExample — deterministic initial render', () => {
  it('renders the fixed fixture date, draft status, and grouped sections', () => {
    render(<LaunchRequestExample />);

    // The form groups fields into the four workflow sections (the review
    // sidebar uses complementary subheadings, so scope to the form areas).
    expect(screen.getByText('What is launching and why.')).toBeTruthy();
    expect(screen.getByText('When the launch rolls out.')).toBeTruthy();
    expect(screen.getByText('Who is accountable for the launch.')).toBeTruthy();
    expect(screen.getByText('Confirmation required before submission.')).toBeTruthy();

    const review = screen.getByRole('region', { name: 'Launch request review' });
    // Fixed calendar date; never interpreted as a UTC instant.
    expect(within(review).getByText('2026-03-30')).toBeTruthy();
    expect(within(review).getByText('Status: Draft')).toBeTruthy();
    expect(within(review).getByText('Insights Hub')).toBeTruthy();
    expect(within(review).getByText('Morning (low traffic)')).toBeTruthy();

    // The raw JSON is secondary: it is hidden behind a labeled disclosure.
    expect(screen.getByRole('button', { name: /Debug: raw form state/ })).toBeTruthy();
    expect(screen.queryByText(/"projectName"/)).toBeNull();
  });
});

describe('LaunchRequestExample — invalid submit', { timeout: 15_000 }, () => {
  it.each(['', '   ', '\n', '\n  \n'])('rejects blank required text %j before simulation', async (blank) => {
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: blank } });
    fireEvent.change(screen.getByLabelText(/^Launch summary/), { target: { value: blank } });
    await submitRequest();
    expect(operation).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(projectName());
    expect(screen.getByText('Status: Draft')).toBeTruthy();
    expectAssociatedError(projectName(), 'Project name is required.');
    expectAssociatedError(screen.getByLabelText(/^Launch summary/), 'Launch summary is required.');
  });

  it.each([
    ['Launch summary', '   ', 'Launch summary is required.'],
    ['Launch summary', '\n\n', 'Launch summary is required.'],
    ['Owner email', '', 'Owner email is required.'],
    ['Owner email', 'invalid', 'Enter a valid email address.'],
  ])('associates and focuses the sole invalid %s (%j)', async (label, value, message) => {
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    completeForm();
    const input = screen.getByLabelText(new RegExp(`^${label}`));
    fireEvent.change(input, { target: { value } });
    await submitRequest();
    expect(operation).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input);
    expectAssociatedError(input, message);
  });

  it('focuses and associates the sole invalid date trigger after clearing', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    completeForm();
    selectDay('March 30th, 2026');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    screen.getByRole('button', { name: 'Submit launch request' }).focus();
    await submitRequest();
    expect(operation).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(dateTrigger());
    expect(screen.getByLabelText(/^Launch date/)).toBe(dateTrigger());
    expectAssociatedError(dateTrigger(), 'Launch date is required.');
  });

  it('repairs the invalid date with keyboard selection and submits a date-only payload', async () => {
    // Freeze only the calendar's clock; user-event/Radix keep real scheduling.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 2, 30, 12));
    const user = userEvent.setup();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    completeForm();
    await user.click(dateTrigger());
    await user.click(screen.getByRole('button', { name: /March 30th, 2026/ }));
    await waitFor(() => expect(document.activeElement).toBe(dateTrigger()));
    await user.click(screen.getByRole('button', { name: 'Submit launch request' }));
    expect(document.activeElement).toBe(dateTrigger());
    expect(dateTrigger().getAttribute('aria-required')).toBe('true');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: 'Choose launch date' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /March 30th, 2026/ }));
    await user.keyboard('{ArrowRight}{Enter}');
    await waitFor(() => expect(document.activeElement).toBe(dateTrigger()));
    expect(dateTrigger().getAttribute('aria-invalid')).toBe('false');
    expect(dateTrigger().hasAttribute('aria-describedby')).toBe(false);
    expect(screen.queryByText('Launch date is required.')).toBeNull();
    await submitRequest();
    expect(operation).toHaveBeenCalledTimes(1);
    expect(operation.mock.calls[0][0]).toMatchObject({ launchDate: '2026-03-31' });
    expect(await screen.findByText('Launch request submitted (revision 1).')).toBeTruthy();
  });

  it('retains meaningful whitespace exactly in accepted payloads and the saved baseline', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: '  Insights  Hub  ' } });
    fireEvent.change(screen.getByLabelText(/^Launch summary/), {
      target: { value: '  First line\n\n  Second line  ' },
    });
    await submitRequest();
    expect(operation.mock.calls[0][0]).toMatchObject({
      projectName: '  Insights  Hub  ',
      summary: '  First line\n\n  Second line  ',
    });
    await advanceSave();
    fireEvent.change(projectName(), { target: { value: '   ' } });
    await submitRequest();
    expect(operation).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/revision 2/)).toBeNull();
    await discardChanges();
    expect(projectName().value).toBe('  Insights  Hub  ');
    expect((screen.getByLabelText(/^Launch summary/) as HTMLTextAreaElement).value).toBe(
      '  First line\n\n  Second line  ',
    );
  });

  it('announces errors and focuses the first invalid field', async () => {
    render(<LaunchRequestExample />);

    fireEvent.change(screen.getByLabelText(/^Project name/), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit launch request' }));

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Project name is required.')).toBeTruthy();
    // Focus moves to the first invalid field (Project name).
    expect(document.activeElement).toBe(screen.getByLabelText(/^Project name/));
    // The request stays a draft.
    expect(screen.getByText('Status: Draft')).toBeTruthy();
  });
});

function expectAssociatedError(control: HTMLElement, message: string) {
  expect(control.getAttribute('aria-invalid')).toBe('true');
  const descriptionIds = control.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
  expect(descriptionIds.length).toBeGreaterThan(0);
  const descriptions = descriptionIds.map((id) => document.getElementById(id));
  expect(descriptions.every(Boolean)).toBe(true);
  expect(descriptions.some((description) => description?.textContent === message)).toBe(true);
}

describe('LaunchRequestExample — save workflow', () => {
  it('makes a successful save pristine and marks later live edits as unsaved', async () => {
    vi.useFakeTimers();
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: 'Saved A' } });
    await submitRequest();
    await advanceSave();

    expect(screen.getByText('All changes are reflected in the saved request.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Discard changes' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(projectName(), { target: { value: 'Edited B' } });
    await act(async () => {});
    const review = screen.getByRole('region', { name: 'Launch request review' });
    expect(within(review).getByText('Edited B')).toBeTruthy();
    expect(within(review).getByLabelText('Request status: Unsaved changes')).toBeTruthy();
    expect(within(review).getByText('Showing current unsaved edits. Submitted revision 1 is unchanged.')).toBeTruthy();
    expect(within(review).queryByText('Status: Submitted')).toBeNull();
    expect(screen.getByText('You have unsaved changes.')).toBeTruthy();
  });

  it('restores the last submitted fields rather than fixtures after save → edit → discard', async () => {
    vi.useFakeTimers();
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: 'Saved A' } });
    fireEvent.change(screen.getByLabelText(/^Launch summary/), { target: { value: 'Saved summary' } });
    fireEvent.change(screen.getByLabelText(/^Rollout window/), { target: { value: 'evening' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove Design option' }));
    await submitRequest();
    await advanceSave();

    fireEvent.change(projectName(), { target: { value: 'Edited B' } });
    fireEvent.change(screen.getByLabelText(/^Launch summary/), { target: { value: 'Unsaved summary' } });
    fireEvent.change(screen.getByLabelText(/^Rollout window/), { target: { value: 'afternoon' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /rollout checklist/ }));
    await discardChanges();

    expect(projectName().value).toBe('Saved A');
    expect((screen.getByLabelText(/^Launch summary/) as HTMLTextAreaElement).value).toBe('Saved summary');
    expect((screen.getByLabelText(/^Rollout window/) as HTMLSelectElement).value).toBe('evening');
    expect(screen.queryByRole('button', { name: 'Remove Design option' })).toBeNull();
    expect(screen.getByRole('checkbox', { name: /rollout checklist/ }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('Status: Submitted')).toBeTruthy();
    expect(screen.getByText('All changes are reflected in the saved request.')).toBeTruthy();
  });

  it('retains pending edits, including a return to an old default, without committing them', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: 'Submitted snapshot' } });
    await submitRequest();
    expect(projectName().disabled).toBe(false);
    expect((screen.getByRole('button', { name: 'Discard changes' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(/Saving the submitted snapshot. You can keep editing/)).toBeTruthy();
    // Returning to the original default must still be dirty against the new baseline.
    fireEvent.change(projectName(), { target: { value: 'Insights Hub' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove Design option' }));
    fireEvent.click(screen.getByRole('button', { name: /^Submit launch request/ }));
    expect(operation).toHaveBeenCalledTimes(1);
    expect(operation.mock.calls[0][0]).toMatchObject({
      projectName: 'Submitted snapshot',
      teams: ['product', 'design'],
      confirmed: true,
    });
    await advanceSave();

    expect(projectName().value).toBe('Insights Hub');
    expect(screen.queryByRole('button', { name: 'Remove Design option' })).toBeNull();
    expect(screen.getByText('You have unsaved changes.')).toBeTruthy();
    expect(screen.getByLabelText('Request status: Unsaved changes')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Debug: raw form state/ }));
    expect(screen.getByText(/"projectName": "Insights Hub"/)).toBeTruthy();
    await discardChanges();
    expect(projectName().value).toBe('Submitted snapshot');
    expect(screen.getByRole('button', { name: 'Remove Design option' })).toBeTruthy();
    expect(screen.getByText('Status: Submitted')).toBeTruthy();
  });

  it('guards rapid submits before validation settles and becomes pristine when pending edits return to the snapshot', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: 'Submitted snapshot' } });
    const submit = screen.getByRole('button', { name: 'Submit launch request' });
    fireEvent.click(submit);
    fireEvent.click(submit);
    await act(async () => {});
    expect(operation).toHaveBeenCalledTimes(1);
    fireEvent.change(projectName(), { target: { value: 'Temporary edit' } });
    fireEvent.change(projectName(), { target: { value: 'Submitted snapshot' } });
    await advanceSave();

    expect(operation).toHaveBeenCalledTimes(1);
    expect(projectName().value).toBe('Submitted snapshot');
    expect(screen.getByText('Launch request submitted (revision 1).')).toBeTruthy();
    expect(screen.getByText('Status: Submitted')).toBeTruthy();
    expect(screen.getByText('All changes are reflected in the saved request.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Discard changes' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('keeps the previous baseline and revision on failure, retains pending edits, and permits retry', async () => {
    vi.useFakeTimers();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: 'Saved A' } });
    await submitRequest();
    await advanceSave();
    fireEvent.click(screen.getByRole('radio', { name: 'Simulate failure' }));
    fireEvent.change(projectName(), { target: { value: 'Failed B' } });
    await submitRequest();
    fireEvent.change(projectName(), { target: { value: 'Pending C' } });
    await advanceSave();

    expect(screen.getByText('Save failed')).toBeTruthy();
    expect(projectName().value).toBe('Pending C');
    expect(screen.getByLabelText('Request status: Unsaved changes')).toBeTruthy();
    expect(screen.queryByText(/revision 2/)).toBeNull();
    await discardChanges();
    expect(projectName().value).toBe('Saved A');
    expect(screen.getByText('Launch request submitted (revision 1).')).toBeTruthy();
    fireEvent.change(projectName(), { target: { value: 'Retry D' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Simulate success' }));
    await submitRequest();
    await advanceSave();
    expect(operation).toHaveBeenCalledTimes(3);
    expect(screen.getByText('Launch request submitted (revision 2).')).toBeTruthy();
    expect(screen.getByText('All changes are reflected in the saved request.')).toBeTruthy();
    fireEvent.change(projectName(), { target: { value: 'Unsaved E' } });
    await discardChanges();
    expect(projectName().value).toBe('Retry D');
  });

  it('cannot duplicate while pending and shows the submitted result', async () => {
    vi.useFakeTimers();
    try {
      render(<LaunchRequestExample />);
      completeForm();

      const submit = screen.getByRole('button', { name: 'Submit launch request' }) as HTMLButtonElement;
      fireEvent.click(submit);
      // Validation resolves asynchronously before onSubmit runs; flush it.
      await act(async () => {});
      // Pending: loading swap disables the button; a second click is a no-op.
      expect(submit.disabled).toBe(true);
      expect(screen.getByText('Saving…')).toBeTruthy();
      fireEvent.click(submit);

      await advanceSave();

      expect(screen.getByText('Launch request submitted (revision 1).')).toBeTruthy();
      expect(screen.getByText('Status: Submitted')).toBeTruthy();
      // Exactly one revision: the duplicate click did not submit twice.
      expect(screen.queryByText(/revision 2/)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('surfaces a deterministic failure and keeps the request editable', async () => {
    vi.useFakeTimers();
    try {
      render(<LaunchRequestExample />);
      // Catalog control: force the simulated save to fail.
      fireEvent.click(screen.getByRole('radio', { name: 'Simulate failure' }));
      completeForm();

      fireEvent.click(screen.getByRole('button', { name: 'Submit launch request' }));
      await advanceSave();

      expect(screen.getByText('Save failed')).toBeTruthy();
      expect(screen.getByText(/The launch request could not be saved/)).toBeTruthy();
      expect(screen.getByText('Status: Draft')).toBeTruthy();
      expect(screen.queryByText(/Launch request submitted/)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('LaunchRequestExample — discard confirmation', { timeout: 15_000 }, () => {
  // Wait past Radix FocusScope's deferred unmount callback, not just portal removal.
  async function settleClose() {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect(screen.queryByRole('alertdialog')).toBeNull();
  }

  it.each(['cancel', 'Escape'])('restores a usable opener after %s and preserves unsaved edits', async (action) => {
    const user = userEvent.setup();
    const operation = vi.spyOn(simulation, 'simulate');
    render(<LaunchRequestExample />);
    await user.clear(projectName());
    await user.type(projectName(), 'Unsaved launch');
    const opener = screen.getByRole('button', { name: 'Discard changes' }) as HTMLButtonElement;
    await user.click(opener);
    const cancel = within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Keep editing' });
    expect(document.activeElement).toBe(cancel);
    if (action === 'cancel') await user.click(cancel);
    else await user.keyboard('{Escape}');
    await settleClose();
    expect(projectName().value).toBe('Unsaved launch');
    expect(screen.getByText('You have unsaved changes.')).toBeTruthy();
    expect(operation).not.toHaveBeenCalled();
    expect(opener.disabled).toBe(false);
    expect(document.activeElement).toBe(opener);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /Debug: raw form state/ }));
    await user.tab({ shift: true });
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Submit launch request' }));
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });

  it('focuses the enabled Project name after confirm and restores the submitted baseline', async () => {
    const user = userEvent.setup();
    const operation = vi.spyOn(simulation, 'simulate').mockResolvedValueOnce({});
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: 'Saved launch' } });
    await user.click(screen.getByRole('button', { name: 'Submit launch request' }));
    expect(await screen.findByText('Launch request submitted (revision 1).')).toBeTruthy();
    await user.clear(projectName());
    await user.type(projectName(), 'Unsaved launch');
    await user.click(screen.getByRole('button', { name: 'Discard changes' }));
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Discard changes' }));
    await settleClose();
    expect(projectName().value).toBe('Saved launch');
    expect(projectName().disabled).toBe(false);
    expect(screen.getByText('All changes are reflected in the saved request.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Discard changes' }) as HTMLButtonElement).disabled).toBe(true);
    expect(operation).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(projectName());
    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText(/^Launch summary/));
  });

  it.each(['Keep editing', 'Discard changes'])('respects outside focus during %s close settlement', async (action) => {
    const user = userEvent.setup();
    render(
      <>
        <button>Outside destination</button>
        <LaunchRequestExample />
      </>,
    );
    const outside = screen.getByRole('button', { name: 'Outside destination' });
    fireEvent.change(projectName(), { target: { value: 'Unsaved launch' } });
    await user.click(screen.getByRole('button', { name: 'Discard changes' }));
    // Explicit navigation between portal removal and Radix's deferred callback.
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: action }));
    outside.focus();
    await settleClose();
    expect(document.activeElement).toBe(outside);
  });

  it('cancels the dialog on catalog view unmount without stealing focus or losing the draft', async () => {
    const user = userEvent.setup();
    render(<LaunchRequestExample />);
    const toolbar = screen.getByRole('toolbar', { name: /Example state tooling/ });
    const loading = within(toolbar).getByRole('button', { name: 'Loading' });
    fireEvent.change(projectName(), { target: { value: 'Retained draft' } });
    await user.click(screen.getByRole('button', { name: 'Discard changes' }));
    // Synthetic lifecycle transition: the modal blocks normal pointer access.
    fireEvent.click(loading);
    loading.focus();
    await settleClose();
    expect(document.activeElement).toBe(loading);
    await user.click(within(toolbar).getByRole('button', { name: 'Loaded' }));
    await settleClose();
    expect(projectName().value).toBe('Retained draft');
    expect(screen.getByText('You have unsaved changes.')).toBeTruthy();
    expect(document.activeElement).toBe(within(toolbar).getByRole('button', { name: 'Loaded' }));
    await user.click(screen.getByRole('button', { name: 'Discard changes' }));
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Discard changes' }));
    await settleClose();
    expect(projectName().value).toBe('Insights Hub');
    expect(document.activeElement).toBe(projectName());
  });

  it('does not restore focus into a departed example after full unmount', async () => {
    const user = userEvent.setup();
    const view = render(
      <>
        <button>Outside destination</button>
        <LaunchRequestExample />
      </>,
    );
    const outside = screen.getByRole('button', { name: 'Outside destination' });
    fireEvent.change(projectName(), { target: { value: 'Unsaved launch' } });
    const oldInput = projectName();
    const focus = vi.spyOn(oldInput, 'focus');
    await user.click(screen.getByRole('button', { name: 'Discard changes' }));
    view.rerender(<button>Outside destination</button>);
    outside.focus();
    await settleClose();
    expect(document.activeElement).toBe(outside);
    expect(focus).not.toHaveBeenCalled();
  });

  it('protects pending snapshots when a native submit settles validation with the dialog open', async () => {
    const user = userEvent.setup();
    let resolveSave!: (value: unknown) => void;
    const operation = vi.spyOn(simulation, 'simulate').mockImplementationOnce(() => {
      // Retained action before React renders disabled: exercise the handler guard too.
      expect(confirm.disabled).toBe(false);
      fireEvent.click(confirm);
      return new Promise((resolve) => {
        resolveSave = resolve;
      });
    });
    render(<LaunchRequestExample />);
    completeForm();
    fireEvent.change(projectName(), { target: { value: 'Pending snapshot' } });
    const input = projectName();
    const form = input.form!;
    const opener = screen.getByRole('button', { name: 'Discard changes' }) as HTMLButtonElement;
    await user.click(opener);
    const confirm = within(screen.getByRole('alertdialog')).getByRole('button', {
      name: 'Discard changes',
    }) as HTMLButtonElement;
    // Synthetic overlap via the actual form/simulator; normal modal input is trapped.
    fireEvent.submit(form);
    await act(async () => {});
    expect(operation).toHaveBeenCalledTimes(1);
    expect(confirm.disabled).toBe(true);
    fireEvent.change(input, { target: { value: 'Newer pending edit' } });
    fireEvent.click(confirm);
    expect(screen.getByRole('alertdialog')).toBeTruthy();
    expect(input.value).toBe('Newer pending edit');
    await user.keyboard('{Escape}');
    await settleClose();
    expect(opener.disabled).toBe(true);
    expect(document.activeElement).toBe(input);
    fireEvent.click(opener);
    expect(screen.queryByRole('alertdialog')).toBeNull();
    await act(async () => {
      resolveSave({});
    });
    expect(screen.getByText('Launch request submitted (revision 1).')).toBeTruthy();
    expect(input.value).toBe('Newer pending edit');
    await user.click(opener);
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Discard changes' }));
    await settleClose();
    expect(input.value).toBe('Pending snapshot');
    expect(document.activeElement).toBe(input);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('keeps edits when the discard confirmation is cancelled', async () => {
    render(<LaunchRequestExample />);

    fireEvent.change(screen.getByLabelText(/^Project name/), { target: { value: 'Signals Dashboard' } });
    expect(screen.getByText('You have unsaved changes.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText('Discard unsaved changes?')).toBeTruthy();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Keep editing' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect((screen.getByLabelText(/^Project name/) as HTMLInputElement).value).toBe('Signals Dashboard');
  });

  it('resets the form only after an explicit confirm', async () => {
    render(<LaunchRequestExample />);

    fireEvent.change(screen.getByLabelText(/^Project name/), { target: { value: 'Signals Dashboard' } });

    fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
    const dialog = await screen.findByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Discard changes' }));

    expect((screen.getByLabelText(/^Project name/) as HTMLInputElement).value).toBe('Insights Hub');
    expect(screen.getByText('All changes are reflected in the saved request.')).toBeTruthy();
  });
});

describe('LaunchRequestExample — catalog state tooling', () => {
  it('exposes loading and error states with retry', () => {
    render(<LaunchRequestExample />);
    const toolbar = screen.getByRole('toolbar', { name: /Example state tooling/ });

    fireEvent.click(within(toolbar).getByRole('button', { name: 'Loading' }));
    expect(screen.getByText('Loading launch request…')).toBeTruthy();

    fireEvent.click(within(toolbar).getByRole('button', { name: 'Error' }));
    expect(screen.getByText('The launch request could not be loaded')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByRole('button', { name: 'Submit launch request' })).toBeTruthy();
  });
});
