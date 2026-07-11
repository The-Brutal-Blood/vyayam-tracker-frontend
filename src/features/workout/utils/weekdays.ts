import type { Weekday } from '../types/workout.types';

export interface WeekdayOption {
  key: Weekday;
  /** Short label shown in the picker and on cards, e.g. "Mon". */
  label: string;
  /** Full name for screen readers. */
  fullName: string;
}

/**
 * Monday-first canonical week order, shared by the scheduler picker, routine
 * cards, and the create/update payload so days always read in the same order.
 */
export const WEEKDAYS: readonly WeekdayOption[] = [
  { key: 'MONDAY', label: 'Mon', fullName: 'Monday' },
  { key: 'TUESDAY', label: 'Tue', fullName: 'Tuesday' },
  { key: 'WEDNESDAY', label: 'Wed', fullName: 'Wednesday' },
  { key: 'THURSDAY', label: 'Thu', fullName: 'Thursday' },
  { key: 'FRIDAY', label: 'Fri', fullName: 'Friday' },
  { key: 'SATURDAY', label: 'Sat', fullName: 'Saturday' },
  { key: 'SUNDAY', label: 'Sun', fullName: 'Sunday' },
];

/** Returns the given days in canonical Mon→Sun order, de-duplicated. */
export function sortWeekdays(days: readonly Weekday[]): Weekday[] {
  const selected = new Set(days);
  return WEEKDAYS.filter(day => selected.has(day.key)).map(day => day.key);
}

/** Compact label like "Mon • Thu"; empty string when no days are given. */
export function formatWeekdayLabels(days: readonly Weekday[]): string {
  const selected = new Set(days);
  return WEEKDAYS.filter(day => selected.has(day.key))
    .map(day => day.label)
    .join(' • ');
}
