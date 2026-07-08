/**
 * Corner radius tokens.
 * Vyayam leans on generous rounding (md–xl) for its premium, soft-card look.
 */
export const radius = {
  none: 0,
  xs: 4, // badges, tags
  sm: 8, // small controls, chips
  md: 12, // inputs, buttons
  lg: 16, // cards
  xl: 20, // large cards, sheets
  '2xl': 28, // modals, hero cards
  pill: 999, // pill buttons, segmented controls
  full: 9999, // avatars, circular icon buttons
} as const;

export type RadiusToken = keyof typeof radius;
