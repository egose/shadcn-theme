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
    await act(async () => {
      rejectFirst(new Error('stale failure'));
      await firstCopy;
    });

    expect(result.current.copied).toBe(true);
    expect(result.current.error).toBeNull();
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
