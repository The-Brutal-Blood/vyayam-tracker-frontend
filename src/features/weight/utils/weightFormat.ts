/** Display formatters for the Weight Tracker. Locale-independent. */

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

/** A weight with one decimal + unit, e.g. 84 → "84.0 kg"; null → "—". */
export function formatKg(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }
  return `${value.toFixed(1)} kg`;
}

/** Signed weight delta, e.g. +1.8 → "+1.8 kg", -2.6 → "-2.6 kg". */
export function formatWeightChange(change: number): string {
  const magnitude = Math.abs(change).toFixed(1);
  return `${change > 0 ? '+' : '-'}${magnitude} kg`;
}

/** "YYYY-MM-DD" → "13 Jul" (parsed by parts to avoid timezone shifts). */
export function formatEntryDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day || month < 1 || month > 12) {
    return dateStr;
  }
  return `${day} ${SHORT_MONTHS[month - 1]}`;
}

/** "YYYY-MM-DD" → the day of month with an ordinal suffix, e.g. "13th", "1st". */
export function formatDayOrdinal(dateStr: string): string {
  const day = Number(dateStr.split('-')[2]);
  if (!day) {
    return dateStr;
  }
  const teens = day % 100;
  const suffix =
    teens >= 11 && teens <= 13
      ? 'th'
      : day % 10 === 1
        ? 'st'
        : day % 10 === 2
          ? 'nd'
          : day % 10 === 3
            ? 'rd'
            : 'th';
  return `${day}${suffix}`;
}
