import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Resolves the system Reduce Motion setting.
 * Returns `null` until known so entrance animations can wait instead of
 * flashing motion at users who opted out.
 */
export function useReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (!cancelled) {
          setReduced(value);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReduced(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return reduced;
}
