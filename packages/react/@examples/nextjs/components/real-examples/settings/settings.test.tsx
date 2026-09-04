import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import SettingsExample from './index';

// Vitest globals are disabled, so RTL auto-cleanup never registers.
afterEach(() => cleanup());

beforeAll(() => {
  // jsdom has no matchMedia; the package Sidebar's useIsMobile needs one.
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
  // jsdom has no ResizeObserver; Radix primitives (Switch et al.) require one.
  if (!('ResizeObserver' in globalThis)) {
    class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
  }
});

function navButton(name: string) {
  return screen.getByRole('button', { name });
}

describe('SettingsExample — ContentSidebar navigation', () => {
  it('exposes all five sections as keyboard-reachable buttons and switches content', () => {
    render(<SettingsExample />);
    for (const label of ['Profile', 'Workspace', 'Notifications and digest preferences', 'Billing', 'Danger zone']) {
      const button = navButton(label);
      expect(button.tagName).toBe('BUTTON');
      expect(button.getAttribute('type')).toBe('button');
    }

    // Default section.
    expect(screen.getByRole('form', { name: 'Profile settings' })).toBeTruthy();

    fireEvent.click(navButton('Notifications and digest preferences'));
    expect(screen.queryByRole('form', { name: 'Profile settings' })).toBeNull();
    expect(screen.getByRole('form', { name: 'Notification settings' })).toBeTruthy();

    fireEvent.click(navButton('Billing'));
    expect(screen.getByRole('form', { name: 'Billing settings' })).toBeTruthy();
  });
});

describe('SettingsExample — save state machine', () => {
  it('goes pristine → unsaved → saving → saved with a loading save button', async () => {
    vi.useFakeTimers();
    try {
      render(<SettingsExample />);
      const profile = screen.getByRole('form', { name: 'Profile settings' });

      expect(within(profile).getByText('No unsaved changes.')).toBeTruthy();
      expect(within(profile).getByRole('button', { name: 'Save changes' })).toHaveProperty('disabled', true);

      fireEvent.change(within(profile).getByLabelText('Display name'), {
        target: { value: 'Rowan Q. Whitfield' },
      });
      expect(within(profile).getByText('You have unsaved changes.')).toBeTruthy();

      const save = within(profile).getByRole('button', { name: 'Save changes' }) as HTMLButtonElement;
      fireEvent.click(save);
      // Pending: loading swap disables the button and announces the request.
      expect(save.disabled).toBe(true);
      expect(within(profile).getByText('Saving…')).toBeTruthy();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      expect(within(profile).getByText('Saved.')).toBeTruthy();
      expect(within(profile).getByRole('button', { name: 'Save changes' })).toHaveProperty('disabled', true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('surfaces save errors while keeping the unsaved edits', async () => {
    vi.useFakeTimers();
    try {
      render(<SettingsExample />);
      fireEvent.click(screen.getByRole('radio', { name: 'Simulate save failure' }));
      const profile = screen.getByRole('form', { name: 'Profile settings' });

      fireEvent.change(within(profile).getByLabelText('Display name'), {
        target: { value: 'Rowan Whitfield II' },
      });
      fireEvent.click(within(profile).getByRole('button', { name: 'Save changes' }));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      const alert = screen.getByRole('alert');
      expect(alert.textContent).toContain('Profile could not be saved');
      expect(alert.textContent).toContain('nothing was persisted');
      // Edits are kept and the state is visibly not pristine.
      expect((within(profile).getByLabelText('Display name') as HTMLInputElement).value).toBe('Rowan Whitfield II');
      expect(within(profile).getByText('Save failed — your edits were kept.')).toBeTruthy();
      // Discard restores pristine state.
      fireEvent.click(within(profile).getByRole('button', { name: 'Discard changes' }));
      expect((within(profile).getByLabelText('Display name') as HTMLInputElement).value).toBe('Rowan Whitfield');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('SettingsExample — permission and plan restrictions', () => {
  it('describes the permission-disabled switch programmatically', () => {
    render(<SettingsExample />);
    fireEvent.click(navButton('Notifications and digest preferences'));
    const securitySwitch = screen.getByRole('switch', { name: 'Security alerts' });
    expect(securitySwitch).toHaveProperty('disabled', true);
    const reasonId = securitySwitch.getAttribute('aria-describedby');
    expect(reasonId).toBeTruthy();
    const reason = document.getElementById(reasonId!);
    expect(reason?.textContent).toContain('Only an owner');
    expect(reason?.textContent).toContain('administrator');
  });

  it('describes the plan-gated switch programmatically, naming both plans', () => {
    render(<SettingsExample />);
    fireEvent.click(navButton('Billing'));
    const gated = screen.getByRole('switch', { name: 'Consolidated billing across workspaces' });
    expect(gated).toHaveProperty('disabled', true);
    const reasonId = gated.getAttribute('aria-describedby');
    expect(reasonId).toBeTruthy();
    const reason = document.getElementById(reasonId!);
    expect(reason?.textContent).toContain('Scale plan');
    expect(reason?.textContent).toContain('Starter plan');
  });
});

describe('SettingsExample — clipboard copy', () => {
  it('copies the workspace ID and shows persistent success feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText }, configurable: true });

    render(<SettingsExample />);
    fireEvent.click(navButton('Workspace'));
    fireEvent.click(screen.getByRole('button', { name: 'Copy workspace ID' }));

    expect(await screen.findByText('Copied the workspace ID to your clipboard.')).toBeTruthy();
    expect(writeText).toHaveBeenCalledWith('workspace-042');
  });

  it('surfaces a deterministic failure when catalog tooling forces it', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    render(<SettingsExample />);
    fireEvent.click(screen.getByRole('radio', { name: 'Force clipboard failure' }));
    fireEvent.click(navButton('Workspace'));
    fireEvent.click(screen.getByRole('button', { name: 'Copy workspace ID' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Clipboard access was denied');
    expect(screen.queryByText('Copied the workspace ID to your clipboard.')).toBeNull();
  });
});

describe('SettingsExample — danger zone', () => {
  it('cancels the deletion and restores focus to the trigger', async () => {
    render(<SettingsExample />);
    fireEvent.click(navButton('Danger zone'));
    const trigger = screen.getByRole('button', { name: 'Delete workspace' });
    fireEvent.click(trigger);
    expect(screen.getByRole('alertdialog', { name: 'Delete this workspace?' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(screen.queryByText(/workspace was deleted/)).toBeNull();
  });

  it('confirms the deletion with pending protection and a persistent outcome', async () => {
    vi.useFakeTimers();
    try {
      render(<SettingsExample />);
      fireEvent.click(navButton('Danger zone'));
      fireEvent.click(screen.getByRole('button', { name: 'Delete workspace' }));

      const confirm = screen.getByRole('button', { name: 'Delete workspace permanently' }) as HTMLButtonElement;
      fireEvent.click(confirm);
      // Pending: no second confirm, no dismissal.
      expect(screen.getByText('Deleting workspace…')).toBeTruthy();
      expect(confirm.disabled).toBe(true);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(400);
      });

      expect(screen.queryByRole('alertdialog')).toBeNull();
      expect(screen.getByText(/workspace was deleted \(simulated\)/)).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Delete workspace' })).toHaveProperty('disabled', true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('SettingsExample — inspectable loading/error states', () => {
  it('renders loading and error states through the catalog toolbar with retry', () => {
    render(<SettingsExample />);
    fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
    expect(screen.getByRole('status', { name: 'Loading settings' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    expect(screen.getByRole('alert').textContent).toContain('Settings could not be loaded');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByRole('form', { name: 'Profile settings' })).toBeTruthy();
  });
});
