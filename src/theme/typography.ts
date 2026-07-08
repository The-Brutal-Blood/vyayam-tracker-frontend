import type { TextStyle } from 'react-native';

/**
 * Typography tokens — system font (SF Pro / Roboto) with a modern mobile scale.
 * Display/heading sizes use tight negative tracking; small utility styles
 * (caption, label, button) use slightly open tracking for legibility.
 */
export const typography = {
  displayXL: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  displayL: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headingXL: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headingL: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headingM: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  bodyLarge: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '400',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyToken = keyof typeof typography;
