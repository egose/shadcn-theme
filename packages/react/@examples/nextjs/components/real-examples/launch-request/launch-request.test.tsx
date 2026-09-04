import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

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
afterEach(() => cleanup());

function completeForm() {
  // Only approval is off by default; everything else starts valid.
  fireEvent.click(screen.getByRole('checkbox', { name: /rollout checklist/ }));
}

async function advanceSave() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(400);
  });
}

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
    // Fixed fixture date: FIXTURE_NOW (2026-03-09) + 21 days; never new Date().
    expect(within(review).getByText('2026-03-30')).toBeTruthy();
    expect(within(review).getByText('Status: Draft')).toBeTruthy();
    expect(within(review).getByText('Insights Hub')).toBeTruthy();
    expect(within(review).getByText('Morning (low traffic)')).toBeTruthy();

    // The raw JSON is secondary: it is hidden behind a labeled disclosure.
    expect(screen.getByRole('button', { name: /Debug: raw form state/ })).toBeTruthy();
    expect(screen.queryByText(/"projectName"/)).toBeNull();
  });
});

describe('LaunchRequestExample — invalid submit', () => {
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

describe('LaunchRequestExample — save workflow', () => {
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

describe('LaunchRequestExample — discard confirmation', () => {
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
