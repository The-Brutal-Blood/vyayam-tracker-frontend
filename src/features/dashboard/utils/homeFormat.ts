/**
 * Display formatters for the Home tab. Kept locale-independent (no `Intl`) so
 * the output is identical across Hermes builds.
 */

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Groups an integer with commas, e.g. 1284250 → "1,284,250". */
export function formatNumber(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Volume with unit, e.g. 14820 → "14,820 kg". */
export function formatVolume(value: number): string {
  return `${formatNumber(value)} kg`;
}

/**
 * A lifted weight with unit — keeps a half-kg when present but drops trailing
 * zeros, e.g. 50 → "50 kg", 52.5 → "52.5 kg".
 */
export function formatWeight(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded} kg`;
}

/** Whole minutes with a pluralized unit, e.g. 58 → "58 Minutes". */
export function formatMinutes(minutes: number): string {
  const value = Math.round(minutes);
  return `${value} ${value === 1 ? 'Minute' : 'Minutes'}`;
}

/** Minutes rounded to whole hours, e.g. 10320 → "172 Hours". */
export function formatHours(minutes: number): string {
  const hours = Math.round(minutes / 60);
  return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
}

/** Exercise count with a pluralized unit, e.g. 8 → "8 Exercises". */
export function formatExerciseCount(count: number): string {
  return `${count} ${count === 1 ? 'Exercise' : 'Exercises'}`;
}

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/**
 * Friendly relative day: "Today", "Yesterday", "N days ago" (within a week),
 * otherwise a short date like "Jul 8". Empty string for an unparseable input.
 */
export function formatRelativeDay(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const diffDays = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY_MS);
  if (diffDays <= 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  return `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`;
}
