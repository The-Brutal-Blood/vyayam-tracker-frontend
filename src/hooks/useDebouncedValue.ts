import { useEffect, useState } from 'react';

/**
 * Trails the input value by `delayMs`. Used to avoid firing a server query
 * on every keystroke of a search field.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
