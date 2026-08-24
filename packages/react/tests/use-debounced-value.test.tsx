import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedValue } from '../hooks/use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('publishes only the latest value after the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: 'third' });
    act(() => vi.advanceTimersByTime(199));
    expect(result.current).toBe('first');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('third');
  });
});
