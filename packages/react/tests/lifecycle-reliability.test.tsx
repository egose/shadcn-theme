import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TagPicker } from '../components/ui/tag-picker';
import { useClipboard } from '../hooks/use-clipboard';

describe('owned timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('restarts the clipboard reset timer for the latest copy and clears it on unmount', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const { result, unmount } = renderHook(() => useClipboard({ timeout: 2000 }));

    await act(() => result.current.copy('first'));
    act(() => vi.advanceTimersByTime(1000));
    await act(() => result.current.copy('second'));
    act(() => vi.advanceTimersByTime(1999));
    expect(result.current.copied).toBe(true);

    act(() => vi.advanceTimersByTime(1));
    expect(result.current.copied).toBe(false);

    await act(() => result.current.copy('third'));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears success and its timer on the latest failure, then recovers with a fresh timer', async () => {
    const failure = new Error('copy B denied');
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(failure)
      .mockResolvedValueOnce(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const { result } = renderHook(() => useClipboard({ timeout: 2000 }));

    await act(() => result.current.copy('A'));
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(500));

    await act(() => result.current.copy('B'));
    expect.soft(result.current.copied).toBe(false);
    expect(result.current.error).toBe(failure);
    expect.soft(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(500));

    await act(() => result.current.copy('C'));
    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(1999));
    expect(result.current.copied).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('ignores an older clipboard write that settles after a newer write', async () => {
    let rejectFirst!: (reason: Error) => void;
    const firstWrite = new Promise<void>((_resolve, reject) => {
      rejectFirst = reject;
    });
    const writeText = vi.fn().mockReturnValueOnce(firstWrite).mockResolvedValueOnce(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const { result } = renderHook(() => useClipboard());

    let firstCopy!: Promise<void>;
    act(() => {
      firstCopy = result.current.copy('first');
    });
    await act(() => result.current.copy('second'));
    act(() => vi.advanceTimersByTime(500));
    await act(async () => {
      rejectFirst(new Error('stale failure'));
      await firstCopy;
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(1499));
    expect(result.current.copied).toBe(true);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.copied).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('ignores an older success after the latest clipboard failure', async () => {
    let resolveFirst!: () => void;
    const firstWrite = new Promise<void>((resolve) => {
      resolveFirst = resolve;
    });
    const failure = new Error('latest failure');
    const writeText = vi.fn().mockReturnValueOnce(firstWrite).mockRejectedValueOnce(failure);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const { result } = renderHook(() => useClipboard());

    let firstCopy!: Promise<void>;
    act(() => {
      firstCopy = result.current.copy('first');
    });
    await act(() => result.current.copy('second'));
    await act(async () => {
      resolveFirst();
      await firstCopy;
    });

    expect(result.current.copied).toBe(false);
    expect(result.current.error).toBe(failure);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['success', 'failure'])('ignores pending clipboard %s after unmount', async (outcome) => {
    let resolveWrite!: () => void;
    let rejectWrite!: (reason: Error) => void;
    const pendingWrite = new Promise<void>((resolve, reject) => {
      resolveWrite = resolve;
      rejectWrite = reject;
    });
    const writeText = vi.fn().mockResolvedValueOnce(undefined).mockReturnValueOnce(pendingWrite);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const { result, unmount } = renderHook(() => useClipboard());

    await act(() => result.current.copy('first'));
    let pendingCopy!: Promise<void>;
    act(() => {
      pendingCopy = result.current.copy('pending');
    });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    await act(async () => {
      if (outcome === 'success') resolveWrite();
      else rejectWrite(new Error('late failure'));
      await pendingCopy;
    });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels a pending tag-picker blur when focus returns and on unmount', () => {
    const { unmount } = render(<TagPicker value={[]} onChange={vi.fn()} suggestions={['React']} />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(screen.getByRole('button', { name: /React/ })).toBeInTheDocument();
    fireEvent.blur(input);
    fireEvent.focus(input);
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole('button', { name: /React/ })).toBeInTheDocument();

    fireEvent.blur(input);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
