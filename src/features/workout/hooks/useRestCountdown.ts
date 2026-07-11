import { useCallback, useEffect, useRef, useState } from 'react';

/** How often the countdown polls its deadline (ms). */
const TICK_MS = 250;

export interface RestCountdown {
  /** Seconds remaining, or `null` when no rest timer is running. */
  remaining: number | null;
  /** Seconds the running countdown started from — used for the progress bar. */
  total: number;
  /** True while a countdown is running. */
  active: boolean;
  /** Begins (or restarts) the countdown from `seconds`; a no-op for <= 0. */
  start: (seconds: number) => void;
  /** Adds/subtracts seconds from the running countdown; ends it if drained. */
  adjust: (deltaSeconds: number) => void;
  /** Cancels the running countdown. */
  skip: () => void;
}

/**
 * Drives the between-sets rest countdown shown after a set is completed.
 *
 * The deadline is tracked as an absolute timestamp so the display stays accurate
 * regardless of render cadence; the deadline value is polled and re-derived each
 * tick. `remaining` only changes once per whole second, so ticking faster than
 * 1s keeps the readout snappy without extra renders (React bails on equal state).
 */
export function useRestCountdown(): RestCountdown {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const endsAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endsAtRef.current = null;
    setRemaining(null);
  }, []);

  const tick = useCallback(() => {
    const endsAt = endsAtRef.current;
    if (endsAt === null) {
      return;
    }
    const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    setRemaining(left);
    if (left <= 0) {
      stop();
    }
  }, [stop]);

  const ensureInterval = useCallback(() => {
    if (intervalRef.current === null) {
      intervalRef.current = setInterval(tick, TICK_MS);
    }
  }, [tick]);

  const start = useCallback(
    (seconds: number) => {
      if (!seconds || seconds <= 0) {
        return;
      }
      endsAtRef.current = Date.now() + seconds * 1000;
      setTotal(seconds);
      setRemaining(seconds);
      ensureInterval();
    },
    [ensureInterval],
  );

  const adjust = useCallback(
    (deltaSeconds: number) => {
      if (endsAtRef.current === null) {
        return;
      }
      const nextEnd = endsAtRef.current + deltaSeconds * 1000;
      const left = Math.max(0, Math.ceil((nextEnd - Date.now()) / 1000));
      if (left <= 0) {
        stop();
        return;
      }
      endsAtRef.current = nextEnd;
      setTotal(current => Math.max(current, left));
      setRemaining(left);
    },
    [stop],
  );

  const skip = useCallback(() => {
    stop();
  }, [stop]);

  // Clear the interval if the screen unmounts mid-rest.
  useEffect(
    () => () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    },
    [],
  );

  return { remaining, total, active: remaining !== null, start, adjust, skip };
}
