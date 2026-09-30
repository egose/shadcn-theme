import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as simulation from '../_shared/async-simulation';
import SupportInboxExample from './index';

let desktop = true;
const mediaListeners = new Set<() => void>();
beforeEach(() => {
  desktop = true;
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({
    matches: desktop,
    addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener),
  }));
  // jsdom has no geometry. Controls are real; resize/overflow belongs to EXB-08.
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  mediaListeners.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const button = (name: string) => screen.getByRole('button', { name });
const reply = () => screen.getByRole('textbox', { name: /^Reply to/ }) as HTMLTextAreaElement;
const open = (id: number) => screen.getByRole('button', { name: new RegExp(`^Open SUP-${id}:`) });
const choose = (id: number) => fireEvent.click(open(id));
const edit = (text: string) => fireEvent.change(reply(), { target: { value: text } });
const outcome = (value: 'success' | 'failure') =>
  fireEvent.click(screen.getByRole('radio', { name: `Simulate ${value}` }));
async function settle() {
  await act(() => vi.advanceTimersByTimeAsync(400));
  await act(() => vi.advanceTimersByTimeAsync(0));
}

describe('Support inbox', () => {
  it('keeps pending focus on an enabled result and respects deliberate movement before settlement', async () => {
    desktop = false;
    render(<SupportInboxExample />);
    choose(101);
    edit('Mobile focus');
    button('Send reply').focus();
    fireEvent.click(button('Send reply'));
    expect(document.activeElement).toBe(screen.getByText('Saving ticket…'));
    await settle();
    expect(document.activeElement).toBe(reply());
    edit('Do not steal focus');
    button('Send reply').focus();
    fireEvent.click(button('Send reply'));
    expect(document.activeElement).toBe(screen.getByText('Saving ticket…'));
    const choice = screen.getByRole('radio', { name: 'Simulate failure' });
    choice.focus();
    await settle();
    expect(document.activeElement).toBe(choice);
  });

  it('keeps independent drafts and failed replies, retries once, and appends the captured payload', async () => {
    const operations = vi.spyOn(simulation, 'simulate');
    render(<SupportInboxExample />);
    edit('First draft');
    choose(102);
    edit('Second draft');
    choose(101);
    expect(reply().value).toBe('First draft');
    outcome('failure');
    button('Send reply').focus();
    fireEvent.click(button('Send reply'));
    fireEvent.click(button('Send reply'));
    fireEvent.click(button('Resolve ticket'));
    expect(operations).toHaveBeenCalledTimes(1);
    expect(reply().disabled).toBe(true);
    outcome('success'); // Captured failure still wins; success is for the retry.
    await settle();
    expect(screen.getByRole('alert').textContent).toContain('Your draft is retained');
    expect(reply().value).toBe('First draft');
    expect(document.activeElement).toBe(reply());
    expect(within(screen.getByRole('list', { name: 'Messages' })).queryByText('First draft')).toBeNull();
    fireEvent.click(button('Send reply'));
    await settle();
    expect(operations).toHaveBeenCalledTimes(2);
    expect(operations.mock.calls[1][0]).toEqual({ ticketId: 'SUP-101', action: 'send', body: 'First draft' });
    expect(reply().value).toBe('');
    expect(within(screen.getByRole('list', { name: 'Messages' })).getAllByText('First draft')).toHaveLength(1);
    expect(screen.getByText('Reply sent.')).toBeTruthy();
    choose(102);
    expect(reply().value).toBe('Second draft');
    choose(101);
    expect(reply().value).toBe('');
  });

  it('guards same-turn form submissions and refuses blank replies', async () => {
    const operations = vi.spyOn(simulation, 'simulate');
    render(<SupportInboxExample />);
    edit('   ');
    fireEvent.submit(reply().closest('form')!);
    expect(operations).not.toHaveBeenCalled();
    edit('One request');
    act(() => {
      fireEvent.submit(reply().closest('form')!);
      fireEvent.submit(reply().closest('form')!);
    });
    expect(operations).toHaveBeenCalledTimes(1);
    await settle();
    expect(within(screen.getByRole('list', { name: 'Messages' })).getAllByText('One request')).toHaveLength(1);
  });

  it('settles on the original ticket through navigation and catalog previews, without stealing focus', async () => {
    const operations = vi.spyOn(simulation, 'simulate');
    render(<SupportInboxExample />);
    edit('Keep with Maya');
    fireEvent.click(button('Send reply'));
    choose(102);
    edit('Keep with Luis');
    reply().focus();
    fireEvent.click(button('Send reply'));
    expect(operations).toHaveBeenCalledTimes(1);
    expect(reply().disabled).toBe(false);
    await settle();
    expect(document.activeElement).toBe(reply());
    expect(reply().value).toBe('Keep with Luis');
    outcome('failure');
    fireEvent.click(button('Send reply'));
    fireEvent.click(button('Loading'));
    expect(screen.getByText('Loading tickets…')).toBeTruthy();
    fireEvent.click(button('Error'));
    await settle();
    fireEvent.click(button('Retry'));
    expect(reply().value).toBe('Keep with Luis');
    expect(screen.getByRole('alert').textContent).toContain('Reply failed');
    fireEvent.click(button('Empty'));
    expect(screen.getByText(/No tickets in this preview/)).toBeTruthy();
    fireEvent.click(button('Return to inbox'));
    expect(reply().value).toBe('Keep with Luis');
    choose(101);
    expect(reply().value).toBe('');
    expect(screen.getByText('Keep with Maya')).toBeTruthy();
  });

  it('resolves outside the active filter with stable focus, retains drafts, and retries reopen failures', async () => {
    const operations = vi.spyOn(simulation, 'simulate');
    render(<SupportInboxExample />);
    edit('Unsent before resolution');
    fireEvent.change(screen.getByLabelText('Ticket status'), { target: { value: 'open' } });
    outcome('failure');
    fireEvent.click(button('Resolve ticket'));
    await settle();
    expect(screen.getByRole('alert').textContent).toContain('Resolve failed');
    expect(open(101)).toBeTruthy();
    outcome('success');
    button('Resolve ticket').focus();
    fireEvent.click(button('Resolve ticket'));
    fireEvent.click(button('Resolve ticket'));
    await settle();
    expect(operations).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('button', { name: /^Open SUP-101:/ })).toBeNull();
    expect(document.activeElement).toBe(screen.getByText('Ticket resolved.'));
    expect(screen.getByText(/Selected ticket is outside/)).toBeTruthy();
    expect(reply().disabled).toBe(true);
    expect(reply().value).toBe('Unsent before resolution');
    expect(screen.getByText(/Resolved tickets cannot receive replies/)).toBeTruthy();
    outcome('failure');
    fireEvent.click(button('Reopen ticket'));
    await settle();
    expect(screen.getByRole('alert').textContent).toContain('Reopen failed');
    expect(reply().disabled).toBe(true);
    outcome('success');
    fireEvent.click(button('Reopen ticket'));
    await settle();
    expect(open(101)).toBeTruthy();
    expect(reply().disabled).toBe(false);
    expect(reply().value).toBe('Unsent before resolution');
    expect(operations.mock.calls.map(([payload]) => payload)).toEqual([
      { ticketId: 'SUP-101', action: 'resolve' },
      { ticketId: 'SUP-101', action: 'resolve' },
      { ticketId: 'SUP-101', action: 'reopen' },
      { ticketId: 'SUP-101', action: 'reopen' },
    ]);
  });

  it('searches subject/customer/ID, clears no results with focus, and explains read-only restrictions', () => {
    const operations = vi.spyOn(simulation, 'simulate');
    render(<SupportInboxExample />);
    const search = screen.getByRole('textbox', { name: 'Search tickets' });
    for (const term of ['expired', 'Luis', 'SUP-102']) {
      fireEvent.change(search, { target: { value: term } });
      expect(within(screen.getByRole('list', { name: 'Tickets' })).getAllByRole('button')).toHaveLength(1);
      expect(open(102)).toBeTruthy();
    }
    search.focus();
    fireEvent.change(search, { target: { value: 'no-such-ticket' } });
    expect(document.activeElement).toBe(search);
    expect(screen.getByText('No tickets match the current filters.')).toBeTruthy();
    fireEvent.click(button('Clear filters'));
    expect(document.activeElement).toBe(search);
    expect((search as HTMLInputElement).value).toBe('');
    choose(109);
    expect(screen.getByText('Historical workspace: this conversation is read-only.')).toBeTruthy();
    expect(reply().disabled).toBe(true);
    fireEvent.click(button('Reopen ticket'));
    fireEvent.submit(reply().closest('form')!);
    expect(operations).not.toHaveBeenCalled();
  });

  it('uses a real mobile Sheet, reachable failure tooling, retained drafts, and opener/fallback focus', async () => {
    desktop = false;
    const operations = vi.spyOn(simulation, 'simulate');
    render(<SupportInboxExample />);
    const trigger = open(101);
    trigger.focus();
    choose(101);
    expect(screen.getByRole('dialog', { name: 'Ticket SUP-101' })).toBeTruthy();
    edit('Mobile retry');
    outcome('failure');
    fireEvent.click(button('Send reply'));
    await settle();
    expect(reply().value).toBe('Mobile retry');
    outcome('success');
    fireEvent.click(button('Send reply'));
    await settle();
    expect(operations).toHaveBeenCalledTimes(2);
    edit('Mobile draft');
    fireEvent.click(button('Close'));
    await settle();
    expect(document.activeElement).toBe(trigger);
    choose(102);
    edit('Other mobile draft');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    await settle();
    choose(101);
    expect(reply().value).toBe('Mobile draft');
    fireEvent.click(button('Close'));
    await settle();
    fireEvent.change(screen.getByLabelText('Ticket status'), { target: { value: 'open' } });
    choose(101);
    fireEvent.click(button('Resolve ticket'));
    await settle();
    fireEvent.click(button('Close'));
    await settle();
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Search tickets' }));
  });

  it('allows mobile close during pending and preserves the session across layout changes and remount reset', async () => {
    desktop = false;
    const view = render(<SupportInboxExample />);
    choose(101);
    edit('Send while closed');
    fireEvent.click(button('Send reply'));
    fireEvent.click(button('Close'));
    await settle();
    choose(101);
    expect(reply().value).toBe('');
    expect(screen.getByText('Send while closed')).toBeTruthy();
    edit('Across layout');
    act(() => {
      desktop = true;
      mediaListeners.forEach((listener) => listener());
    });
    await settle();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(reply().value).toBe('Across layout');
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Search tickets' }));
    view.unmount();
    render(<SupportInboxExample />);
    expect(reply().value).toBe('');
    expect(screen.queryByText('Send while closed')).toBeNull();
  });
});
