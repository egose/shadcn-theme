import * as React from 'react';

/**
 * Returns a debounced copy of `value` that only updates after the input has
 * been stable for `delay` milliseconds. Useful for search inputs and other
 * high-frequency controlled values where you want to defer expensive work
 * (network requests, heavy filters) until the user pauses typing.
 *
 * @example
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebouncedValue(query, 250);
 * useEffect(() => { search(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = React.useState<T>(value);

  React.useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}
