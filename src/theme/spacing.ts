/**
 * 8-point spacing system.
 * Sub-8 steps (2, 4) exist for icon gaps and dense layouts;
 * everything from `sm` up is a multiple of 4 aligned to the 8-pt grid.
 */
export const spacing = {
  none: 0,
  xxs: 2, // icon-to-badge gaps, hairline nudges
  xs: 4, // gaps inside compact rows
  sm: 8, // gaps between related elements
  md: 12, // input padding, list row padding
  lg: 16, // default screen gutter, card padding
  xl: 20, // section padding
  '2xl': 24, // gaps between sections
  '3xl': 32, // large section breaks
  '4xl': 40, // hero spacing
  '5xl': 48, // top-of-screen offsets
  '6xl': 64, // splash/empty-state breathing room
  '7xl': 80, // bottom CTA clearance
} as const;

export type SpacingToken = keyof typeof spacing;
