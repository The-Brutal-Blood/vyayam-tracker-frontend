/**
 * Display formatters for the History tab. Locale-independent (no `Intl`) so
 * output is identical across Hermes builds.
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

/** Groups an integer with commas, e.g. 15420 → "15,420". */
function groupThousands(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** "145 Workouts" / "1 Workout". */
export function formatWorkoutCount(count: number): string {
  return `${groupThousands(count)} ${count === 1 ? 'Workout' : 'Workouts'}`;
}

/** Total volume with unit, e.g. 15420 → "15,420 kg". */
export function formatVolume(value: number): string {
  return `${groupThousands(value)} kg`;
}

/** Whole-minute duration, e.g. 58 → "58 min". */
export function formatDuration(minutes: number): string {
  return `${Math.round(minutes)} min`;
}

/** Completed-set count, e.g. 18 → "18 Sets" / "1 Set". */
export function formatSetCount(count: number): string {
  return `${count} ${count === 1 ? 'Set' : 'Sets'}`;
}

/** Drops trailing zeros from a weight: 50 → "50", 22.5 → "22.5". */
function formatWeight(weight: number): string {
  return String(Math.round(weight * 100) / 100);
}

/**
 * A completed set's value. With load: "45 × 10"; bodyweight (weight 0):
 * "10 Reps".
 */
export function formatSetValue(weight: number, reps: number): string {
  return weight > 0 ? `${formatWeight(weight)} × ${reps}` : `${reps} Reps`;
}

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "Today" / "Yesterday", otherwise "11 Jul 2026". Empty for bad input. */
export function formatHistoryDate(iso: string): string {
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
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
