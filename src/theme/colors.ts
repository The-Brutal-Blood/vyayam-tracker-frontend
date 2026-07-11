/**
 * Vyayam color tokens — dark-mode-first, derived from the splash screen:
 * a deep midnight-navy field with a warm orange energy accent.
 *
 * Components must never hardcode hex values; consume these semantic tokens.
 */
export const colors = {
  // Brand
  primary: '#FF6B2C', // energetic orange — primary actions only
  primaryLight: '#FF9159', // pressed/hover tints, gradient tops, glows
  primaryDark: '#D9531A', // pressed state on dark, gradient bottoms
  primarySoft: '#FF6B2C29', // translucent orange (~16%) — active/completed row fills
  accent: '#FFA24C', // warm amber — highlights, streaks, active glows

  // Backgrounds (deep midnight navy, never pure black)
  background: '#0A1120', // app canvas — matches the splash field
  backgroundSecondary: '#0D1626', // grouped sections, tab bars, headers

  // Surfaces (each step lighter to create depth)
  surface: '#121C2E', // inputs, list rows, sheets
  surfaceElevated: '#182438', // modals, popovers, floating elements
  card: '#141F33', // workout cards, stat tiles

  // Lines
  border: '#243248', // input borders, card outlines
  divider: '#1C2A40', // hairline separators

  // Text (cool near-white ramp for AAA/AA contrast on navy)
  textPrimary: '#F5F7FA', // headings, primary content — 16.9:1 on background
  textSecondary: '#A8B3C5', // supporting copy — 7.6:1 on background
  textDisabled: '#5C6B82', // disabled labels
  textOnPrimary: '#1C1109', // text/icons on orange buttons — 7.2:1 on primary
  placeholder: '#6E7D94', // input placeholders

  // Feedback (400-weight hues tuned for dark surfaces)
  success: '#34D399', // completed sets, PRs, positive trends
  warning: '#FBBF24', // caution states, near-limit indicators
  error: '#F87171', // validation errors, destructive actions
  info: '#60A5FA', // tips, informational banners

  // Layers (8-digit hex: RRGGBBAA)
  overlay: '#0A1120A6', // scrim over images/video (65% navy)
  backdrop: '#050B14E6', // behind modals and sheets (90% near-black navy)
} as const;

export type ColorToken = keyof typeof colors;
