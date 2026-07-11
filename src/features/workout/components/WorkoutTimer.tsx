import React, { useEffect, useMemo, useState } from 'react';

import { Text, type TextProps } from '@/components/ui';

/** Seconds → "HH:MM:SS". */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Seconds → a compact label like "20s", "3min 18s", "1h 5min". */
export function formatCompactDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  if (safe < 60) {
    return `${safe}s`;
  }
  if (safe < 3600) {
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return seconds > 0 ? `${minutes}min ${seconds}s` : `${minutes}min`;
  }
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
}

/** Live elapsed seconds since an ISO timestamp, ticking once per second. */
export function useElapsedSeconds(startedAt: string): number {
  const startMs = useMemo(() => {
    const parsed = Date.parse(startedAt);
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }, [startedAt]);

  const [seconds, setSeconds] = useState(() => Math.max(0, Math.floor((Date.now() - startMs) / 1000)));

  useEffect(() => {
    const tick = () => setSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startMs]);

  return seconds;
}

export interface WorkoutTimerProps extends Omit<TextProps, 'children'> {
  seconds: number;
}

/** Presentational HH:MM:SS display; the ticking is owned by the caller. */
export const WorkoutTimer = React.memo(function WorkoutTimerBase({
  seconds,
  ...textProps
}: WorkoutTimerProps) {
  return <Text {...textProps}>{formatDuration(seconds)}</Text>;
});
