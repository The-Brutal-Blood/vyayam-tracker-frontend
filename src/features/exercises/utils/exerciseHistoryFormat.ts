/**
 * Display formatters for the Exercise History tab. Locale-independent (no
 * `Intl`) so output is identical across Hermes builds — matching the weight
 * and workout-history feature formatters.
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

/** Groups an integer with commas, e.g. 1925 → "1,925". */
function groupThousands(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Drops trailing zeros from a weight: 30 → "30", 22.5 → "22.5". */
function trimWeight(weight: number): string {
  return String(Math.round(weight * 100) / 100);
}

/** A load with unit, e.g. 35 → "35 kg", 22.5 → "22.5 kg". */
export function formatWeight(weight: number): string {
  return `${trimWeight(weight)} kg`;
}

/** An average rep count to one decimal without a trailing ".0", e.g. 19.3. */
export function formatAverageReps(reps: number): string {
  return String(Math.round(reps * 10) / 10);
}

/** Total/best volume with unit and thousands grouping, e.g. 1925 → "1,925 kg". */
export function formatVolume(value: number): string {
  return `${groupThousands(value)} kg`;
}

/** Whole-minute duration, e.g. 24 → "24 min". */
export function formatDuration(minutes: number): string {
  return `${Math.round(minutes)} min`;
}

/** A completed set's value, e.g. "35 kg × 15". */
export function formatSetValue(weight: number, reps: number): string {
  return `${trimWeight(weight)} kg × ${reps}`;
}

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** "Today" / "Yesterday", otherwise "12 Jul 2026". Empty for bad input. */
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

/**
 * "YYYY-MM-DD" → "12 Jul" for compact chart axis labels (parsed by parts to
 * avoid timezone shifts).
 */
export function formatChartDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12) {
    return dateStr;
  }
  return `${day} ${SHORT_MONTHS[month - 1]}`;
}
