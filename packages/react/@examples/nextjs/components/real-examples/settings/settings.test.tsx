import { act, cleanup, fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import SettingsExample from './index';
import * as simulation from '../_shared/async-simulation';
import { useSettingsSession } from './use-settings-session';

// Vitest globals are disabled, so RTL auto-cleanup never registers.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

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

// Defer the actual simulator boundary, so each operation can settle separately
// and assertions observe attempted persistence rather than UI click counts.
function deferOperations() {
  const requests: { payload: unknown; resolve: () => void; reject: () => void }[] = [];
  const operation = vi.spyOn(simulation, 'simulate').mockImplementation(async (payload) => {
    await new Promise<void>((resolve, reject) => {
      requests.push({ payload, resolve, reject: () => reject(new Error('Deferred failure')) });
    });
    return payload;
  });
  return { operation, requests };
}

describe('SettingsExample — workspace save/delete boundary', () => {
  it.each([
    { nav: 'Workspace', form: 'Workspace settings', field: 'Workspace name', value: 'Retained workspace' },
    { nav: 'Billing', form: 'Billing settings', field: 'Billing email', value: 'retained@example.dev' },
  ])('rejects post-delete $nav submissions and preserves the baseline', async ({ nav, form, field, value }) => {
    const { operation, requests } = deferOperations();
    render(<SettingsExample />);
    fireEvent.click(navButton(nav));
    const baseline = (screen.getByLabelText(field) as HTMLInputElement).value;
    fireEvent.change(screen.getByLabelText(field), { target: { value } });
    fireEvent.click(navButton('Danger zone'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace permanently' }));
    await act(async () => requests[0].resolve());
    fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
    fireEvent.click(screen.getByRole('button', { name: 'Loaded' }));
    fireEvent.click(navButton(nav));
    expect(screen.getByLabelText(field)).toHaveProperty('value', value);
    // Native submission bypasses the disabled button, exercising the handler.
    fireEvent.submit(screen.getByRole('form', { name: form }));
    expect(operation).toHaveBeenCalledTimes(1);
    const save = screen.getByRole('button', { name: 'Save changes' });
    expect(save).toHaveProperty('disabled', true);
    const reason = document.getElementById(save.getAttribute('aria-describedby')!);
    expect(reason?.textContent).toContain('workspace was deleted');
    expect(screen.getByText('You have unsaved changes.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
    expect(screen.getByLabelText(field)).toHaveProperty('value', baseline);
  });

  it.each(['workspace', 'billing'] as const)(
    'guards retained $0 callbacks in both same-turn orderings',
    async (section) => {
      const { operation, requests } = deferOperations();
      const { result } = renderHook(() => useSettingsSession('success', 'force-failure'));
      act(() => {
        result.current.workspace.update({ name: 'Captured workspace' });
        result.current.billing.update({ billingEmail: 'captured@example.dev' });
      });
      const save = result.current[section].save;
      const remove = result.current.deletion.confirmDelete;
      const open = result.current.deletion.setDialogOpen;
      const close = result.current.deletion.onOpenChange;
      act(() => {
        void save();
        void remove();
      });
      expect(operation).toHaveBeenCalledTimes(1);
      expect(requests[0].payload).not.toBeNull();
      expect(result.current.deletion.deleting).toBe(false);
      await act(async () => requests[0].resolve());
      expect(result.current[section].status).toBe('saved');

      // The same callbacks retained before the first operation must now obey
      // deletion's synchronously acquired boundary, before React re-renders.
      act(() => {
        open(true);
        void remove();
        close(false);
        void save();
        void remove();
      });
      expect(operation).toHaveBeenCalledTimes(2);
      expect(result.current.deletion.dialogOpen).toBe(true);
      expect(requests[1].payload).toBeNull();
      await act(async () => requests[1].resolve());
      act(() => {
        void save();
        void remove();
        open(true);
      });
      expect(operation).toHaveBeenCalledTimes(2);
      expect(result.current.deletion.dialogOpen).toBe(false);
      expect(result.current.deletion.deleted).toBe(true);
      expect(result.current[section].status).toBe('saved');
    },
  );

  it('keeps independent saves and newer edits, blocking deletion until every workspace save settles', async () => {
    const { operation, requests } = deferOperations();
    const { result } = renderHook(() => useSettingsSession('success', 'force-failure'));
    act(() => {
      result.current.workspace.update({ name: 'Workspace snapshot' });
      result.current.billing.update({ billingEmail: 'snapshot@example.dev' });
      result.current.profile.update({ displayName: 'Account snapshot' });
    });
    const remove = result.current.deletion.confirmDelete;
    act(() => {
      void result.current.workspace.save();
      void result.current.billing.save();
      void result.current.profile.save();
      void remove();
    });
    expect(operation).toHaveBeenCalledTimes(3);
    act(() => result.current.workspace.update({ name: 'Newer workspace draft' }));
    await act(async () => requests[0].resolve());
    expect(result.current.workspace.status).toBe('unsaved');
    act(() => {
      void remove();
    });
    expect(operation).toHaveBeenCalledTimes(3);
    await act(async () => requests[1].reject());
    expect(result.current.billing.status).toBe('error');
    act(() => {
      void remove();
    });
    expect(operation).toHaveBeenCalledTimes(4);
    await act(async () => requests[3].resolve());
    // Account save is allowed to settle after deletion; workspace saves are not.
    await act(async () => requests[2].resolve());
    expect(result.current.profile.status).toBe('saved');
    expect(result.current.workspace.draft.name).toBe('Newer workspace draft');
    act(() => result.current.workspace.discard());
    expect(result.current.workspace.draft.name).toBe('Workspace snapshot');
    expect(result.current.billing.draft.billingEmail).toBe('snapshot@example.dev');
  });

  it('retains drafts/baselines on cancellation and failed deletion, then permits saves and account use after deletion', async () => {
    const { operation, requests } = deferOperations();
    render(<SettingsExample />);
    fireEvent.click(navButton('Workspace'));
    const original = (screen.getByLabelText('Workspace name') as HTMLInputElement).value;
    fireEvent.change(screen.getByLabelText('Workspace name'), { target: { value: 'Draft to retain' } });
    fireEvent.click(navButton('Danger zone'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(operation).not.toHaveBeenCalled();
    fireEvent.click(navButton('Workspace'));
    expect(screen.getByLabelText('Workspace name')).toHaveProperty('value', 'Draft to retain');
    expect(screen.getByRole('button', { name: 'Save changes' })).toHaveProperty('disabled', false);
    fireEvent.click(navButton('Danger zone'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace permanently' }));
    await act(async () => requests[0].reject());
    fireEvent.click(navButton('Workspace'));
    expect(screen.getByLabelText('Workspace name')).toHaveProperty('value', 'Draft to retain');
    fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
    expect(screen.getByLabelText('Workspace name')).toHaveProperty('value', original);
    fireEvent.change(screen.getByLabelText('Workspace name'), { target: { value: 'Saved after failure' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    fireEvent.click(navButton('Danger zone'));
    const remove = screen.getByRole('button', { name: 'Delete workspace' });
    expect(remove).toHaveProperty('disabled', true);
    expect(document.getElementById(remove.getAttribute('aria-describedby')!)?.textContent).toContain('saves to finish');
    expect(screen.getByRole('button', { name: 'Retry deletion' })).toHaveProperty('disabled', true);
    await act(async () => requests[1].resolve());
    fireEvent.click(remove);
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace permanently' }));
    await act(async () => requests[2].resolve());
    fireEvent.click(navButton('Profile'));
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Still an account' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await act(async () => requests[3].resolve());
    expect(screen.getByText('Saved.')).toBeTruthy();
    fireEvent.click(navButton('Notifications and digest preferences'));
    fireEvent.click(screen.getByRole('radio', { name: 'Daily' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await act(async () => requests[4].resolve());
    expect(screen.getByText('Saved.')).toBeTruthy();
    expect(requests[4].payload).toEqual({ mentions: true, productUpdates: false, digestFrequency: 'daily' });
    expect(operation).toHaveBeenCalledTimes(5);
  }, 15_000);

  it('describes pending deletion on workspace save controls and rejects native submissions while hidden', async () => {
    const { operation, requests } = deferOperations();
    render(<SettingsExample />);
    fireEvent.click(navButton('Workspace'));
    fireEvent.change(screen.getByLabelText('Workspace name'), { target: { value: 'Pending workspace draft' } });
    fireEvent.click(navButton('Billing'));
    fireEvent.change(screen.getByLabelText('Billing email'), { target: { value: 'pending@example.dev' } });
    fireEvent.click(navButton('Danger zone'));
    const workspace = navButton('Workspace');
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace permanently' }));
    // Synthetic lifecycle transition: the modal blocks normal pointer navigation.
    // This tests session eligibility when the confirming view is unmounted.
    fireEvent.click(workspace);
    for (const [section, form] of [
      ['Workspace', 'Workspace settings'],
      ['Billing', 'Billing settings'],
    ]) {
      fireEvent.click(navButton(section));
      const save = screen.getByRole('button', { name: 'Save changes' });
      expect(save).toHaveProperty('disabled', true);
      expect(document.getElementById(save.getAttribute('aria-describedby')!)?.textContent).toContain(
        'deletion is pending',
      );
      fireEvent.submit(screen.getByRole('form', { name: form }));
    }
    expect(operation).toHaveBeenCalledTimes(1);
    await act(async () => requests[0].reject());
    expect(screen.getByLabelText('Billing email')).toHaveProperty('value', 'pending@example.dev');
    expect(screen.getByRole('button', { name: 'Save changes' })).toHaveProperty('disabled', false);
    fireEvent.click(navButton('Workspace'));
    expect(screen.getByLabelText('Workspace name')).toHaveProperty('value', 'Pending workspace draft');
    expect(screen.getByRole('button', { name: 'Save changes' })).toHaveProperty('disabled', false);
  });

  it('blocks retained saves during deletion but releases them after failure without losing drafts', async () => {
    const { operation, requests } = deferOperations();
    const { result } = renderHook(() => useSettingsSession('success', 'force-failure'));
    act(() => {
      result.current.workspace.update({ name: 'Unsaved workspace' });
      result.current.billing.update({ billingEmail: 'unsaved@example.dev' });
    });
    const workspaceSave = result.current.workspace.save;
    const billingSave = result.current.billing.save;
    act(() => {
      void result.current.deletion.confirmDelete();
      void workspaceSave();
      void billingSave();
    });
    expect(operation).toHaveBeenCalledTimes(1);
    expect(result.current.workspace.status).toBe('unsaved');
    expect(result.current.billing.status).toBe('unsaved');
    await act(async () => requests[0].reject());
    act(() => {
      void workspaceSave();
      void billingSave();
    });
    expect(operation).toHaveBeenCalledTimes(3);
    await act(async () => {
      requests[1].resolve();
      requests[2].resolve();
    });
    expect(result.current.workspace.status).toBe('saved');
    expect(result.current.billing.status).toBe('saved');
  });
});

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
  it('starts one operation for same-turn submissions and preserves newer pending edits', async () => {
    vi.useFakeTimers();
    try {
      const operation = vi.spyOn(simulation, 'simulate');
      render(<SettingsExample />);
      const form = screen.getByRole('form', { name: 'Profile settings' });
      fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Captured profile' } });
      act(() => {
        fireEvent.submit(form);
        fireEvent.submit(form);
      });
      expect(operation).toHaveBeenCalledTimes(1);
      fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Newer draft' } });
      fireEvent.click(navButton('Workspace'));
      await act(() => vi.advanceTimersByTimeAsync(400));
      fireEvent.click(navButton('Profile'));
      expect(screen.getByLabelText('Display name')).toHaveProperty('value', 'Newer draft');
      fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
      expect(screen.getByLabelText('Display name')).toHaveProperty('value', 'Captured profile');
    } finally {
      vi.useRealTimers();
    }
  });

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

describe('SettingsExample — session round trips', () => {
  afterEach(() => vi.useRealTimers());

  const sections = [
    { nav: 'Profile', field: 'Display name', first: 'Saved profile', second: 'Later profile' },
    { nav: 'Workspace', field: 'Workspace name', first: 'Saved workspace', second: 'Later workspace' },
    { nav: 'Billing', field: 'Billing email', first: 'saved@example.dev', second: 'later@example.dev' },
    { nav: 'Notifications and digest preferences', field: null, first: 'daily', second: 'off' },
  ];

  it.each(sections)(
    'retains $nav drafts, saved baselines and failures independently',
    async ({ nav, field, first, second }) => {
      vi.useFakeTimers();
      render(<SettingsExample />);
      const edit = (value: string) => {
        if (field) fireEvent.change(screen.getByLabelText(field), { target: { value } });
        else fireEvent.click(screen.getByRole('radio', { name: value === 'daily' ? 'Daily' : 'Off' }));
      };
      const expectValue = (value: string) => {
        if (field) expect(screen.getByLabelText(field)).toHaveProperty('value', value);
        else {
          expect(
            screen.getByRole('radio', { name: value === 'daily' ? 'Daily' : 'Off' }).getAttribute('aria-checked'),
          ).toBe('true');
        }
      };
      const roundTrip = () => {
        fireEvent.click(navButton(nav === 'Profile' ? 'Billing' : 'Profile'));
        fireEvent.click(navButton(nav));
      };

      fireEvent.click(navButton(nav));
      edit(first);
      roundTrip();
      expectValue(first);
      expect(screen.getByText('You have unsaved changes.')).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
      roundTrip();
      expect(screen.getByText('Saving…')).toBeTruthy();
      await act(() => vi.advanceTimersByTimeAsync(400));
      roundTrip();
      expectValue(first);
      expect(screen.getByText('Saved.')).toBeTruthy();

      edit(second);
      fireEvent.click(screen.getByRole('radio', { name: 'Simulate save failure' }));
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
      fireEvent.click(navButton(nav === 'Profile' ? 'Billing' : 'Profile'));
      await act(() => vi.advanceTimersByTimeAsync(400));
      fireEvent.click(navButton(nav));
      expectValue(second);
      expect(screen.getByText('Save failed — your edits were kept.')).toBeTruthy();
      roundTrip();
      expect(screen.getByText('Save failed — your edits were kept.')).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
      expectValue(first);
      expect(screen.getByText('No unsaved changes.')).toBeTruthy();
    },
    15_000,
  );

  it('settles independent pending saves while hidden and keeps newer edits unsaved', async () => {
    vi.useFakeTimers();
    render(<SettingsExample />);
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Profile snapshot' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    fireEvent.click(navButton('Workspace'));
    fireEvent.change(screen.getByLabelText('Workspace name'), { target: { value: 'Workspace snapshot' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    fireEvent.click(navButton('Profile'));
    expect(screen.getByText('Saving…')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Newer profile edit' } });
    fireEvent.click(navButton('Billing'));
    fireEvent.change(screen.getByLabelText('Billing email'), { target: { value: 'draft@example.dev' } });
    fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
    await act(() => vi.advanceTimersByTimeAsync(400));
    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByLabelText('Billing email')).toHaveProperty('value', 'draft@example.dev');
    expect(screen.getByText('You have unsaved changes.')).toBeTruthy();
    fireEvent.click(navButton('Workspace'));
    expect(screen.getByLabelText('Workspace name')).toHaveProperty('value', 'Workspace snapshot');
    expect(screen.getByText('Saved.')).toBeTruthy();
    fireEvent.click(navButton('Profile'));
    expect(screen.getByLabelText('Display name')).toHaveProperty('value', 'Newer profile edit');
    expect(screen.getByText('You have unsaved changes.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
    expect(screen.getByLabelText('Display name')).toHaveProperty('value', 'Profile snapshot');
    fireEvent.click(navButton('Billing'));
    expect(screen.getByLabelText('Billing email')).toHaveProperty('value', 'draft@example.dev');
  });

  it('retains avatar acknowledgement and clipboard outcomes across section and catalog switches', async () => {
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    render(<SettingsExample />);
    fireEvent.change(screen.getByLabelText('Avatar photo'), {
      target: { files: [new File(['avatar'], 'avatar.png', { type: 'image/png' })] },
    });
    fireEvent.click(navButton('Workspace'));
    fireEvent.click(screen.getByRole('button', { name: 'Copy workspace ID' }));
    expect(await screen.findByText('Copied the workspace ID to your clipboard.')).toBeTruthy();
    fireEvent.click(navButton('Profile'));
    expect(screen.getByText(/Selected “avatar.png”/)).toBeTruthy();
    fireEvent.click(navButton('Workspace'));
    expect(screen.getByText('Copied the workspace ID to your clipboard.')).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: 'Force clipboard failure' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy workspace ID' }));
    fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
    fireEvent.click(screen.getByRole('button', { name: 'Loaded' }));
    expect(screen.getByRole('alert').textContent).toContain('Clipboard access was denied');
  });

  it('keeps deletion terminal across navigation and catalog states until a fresh mount', async () => {
    vi.useFakeTimers();
    const { unmount } = render(<SettingsExample />);
    const loading = screen.getByRole('button', { name: 'Loading' });
    fireEvent.click(navButton('Danger zone'));
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete workspace permanently' }));
    // Exercise a catalog transition during the request, even though the modal
    // blocks ordinary pointer navigation to the toolbar.
    fireEvent.click(loading);
    fireEvent.click(screen.getByRole('button', { name: 'Loaded' }));
    expect(screen.getByText('Deleting workspace…')).toBeTruthy();
    fireEvent.click(loading);
    await act(() => vi.advanceTimersByTimeAsync(400));
    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByText(/workspace was deleted \(simulated\)/)).toBeTruthy();
    fireEvent.click(navButton('Profile'));
    fireEvent.click(navButton('Danger zone'));
    expect(screen.getByText(/workspace was deleted \(simulated\)/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Delete workspace' })).toHaveProperty('disabled', true);
    fireEvent.click(loading);
    fireEvent.click(screen.getByRole('button', { name: 'Loaded' }));
    expect(screen.getByRole('button', { name: 'Delete workspace' })).toHaveProperty('disabled', true);
    unmount();
    render(<SettingsExample />);
    fireEvent.click(navButton('Danger zone'));
    expect(screen.queryByText(/workspace was deleted \(simulated\)/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Delete workspace' })).toHaveProperty('disabled', false);
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
      await act(() => vi.advanceTimersByTimeAsync(0));
      expect(document.activeElement).toBe(screen.getByText(/workspace was deleted \(simulated\)/));
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps deletion failure through navigation and retries with confirmation and single-operation protection', async () => {
    vi.useFakeTimers();
    try {
      const operation = vi.spyOn(simulation, 'simulate');
      render(<SettingsExample />);
      fireEvent.click(screen.getByRole('radio', { name: 'Simulate save failure' }));
      fireEvent.click(navButton('Danger zone'));
      const trigger = screen.getByRole('button', { name: 'Delete workspace' });
      fireEvent.click(trigger);
      fireEvent.click(screen.getByRole('button', { name: 'Delete workspace permanently' }));
      await act(() => vi.advanceTimersByTimeAsync(400));
      expect(screen.getByRole('alert').textContent).toContain('Nothing was removed');
      await act(() => vi.advanceTimersByTimeAsync(0));
      expect(document.activeElement).toBe(trigger);
      fireEvent.click(navButton('Profile'));
      fireEvent.click(navButton('Danger zone'));
      fireEvent.click(screen.getByRole('button', { name: 'Loading' }));
      fireEvent.click(screen.getByRole('button', { name: 'Loaded' }));
      expect(screen.getByRole('alert').textContent).toContain('Nothing was removed');
      fireEvent.click(screen.getByRole('radio', { name: 'Simulate save success' }));
      const retry = screen.getByRole('button', { name: 'Retry deletion' });
      fireEvent.click(retry);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      await act(() => vi.advanceTimersByTimeAsync(0));
      expect(document.activeElement).toBe(retry);
      expect(operation).toHaveBeenCalledTimes(1);
      fireEvent.click(retry);
      const confirm = screen.getByRole('button', { name: 'Delete workspace permanently' });
      fireEvent.click(confirm);
      fireEvent.click(confirm);
      fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' });
      expect(screen.getByRole('alertdialog')).toBeTruthy();
      expect(operation).toHaveBeenCalledTimes(2);
      await act(() => vi.advanceTimersByTimeAsync(400));
      expect(screen.queryByRole('alert')).toBeNull();
      await act(() => vi.advanceTimersByTimeAsync(0));
      expect(document.activeElement).toBe(screen.getByText(/workspace was deleted \(simulated\)/));
    } finally {
      vi.useRealTimers();
    }
  });

  it('focuses the persistent settings heading if catalog navigation unmounts the deletion opener', async () => {
    vi.useFakeTimers();
    try {
      render(<SettingsExample />);
      fireEvent.click(navButton('Danger zone'));
      const loading = screen.getByRole('button', { name: 'Loading' });
      const trigger = screen.getByRole('button', { name: 'Delete workspace' });
      fireEvent.click(trigger);
      fireEvent.click(screen.getByRole('button', { name: 'Delete workspace permanently' }));
      // Synthetic catalog transition, as in the EXB-03 session lifetime test.
      fireEvent.click(loading);
      await act(() => vi.advanceTimersByTimeAsync(0));
      expect(trigger.isConnected).toBe(false);
      expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Workspace settings' }));
      await act(() => vi.advanceTimersByTimeAsync(400));
      expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Workspace settings' }));
      fireEvent.click(screen.getByRole('button', { name: 'Loaded' }));
      expect(screen.getByText(/workspace was deleted \(simulated\)/)).toBeTruthy();
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
