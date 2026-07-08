import React from 'react';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

export type LogoSize = 'small' | 'medium' | 'large';

export interface LogoProps {
  /** Named preset size. Ignored when explicit width/height are given. */
  size?: LogoSize;
  /** Custom width in points. Overrides `size`. */
  width?: number;
  /** Custom height in points. Overrides `size`. */
  height?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
}

// Loaded once at module scope; every <Logo /> shares the same asset.
const logoSource = require('@/assets/icons/logo.png');

const presetSizes: Record<LogoSize, number> = {
  small: 124,
  medium: 180,
  large: 240,
};

export const Logo = React.memo(function LogoBase({
  size = 'medium',
  width,
  height,
  accessibilityLabel = 'Vyayam Tracker logo',
  style,
}: LogoProps) {
  const preset = presetSizes[size];

  return (
    <Image
      source={logoSource}
      resizeMode="contain"
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[{ width: width ?? preset, height: height ?? preset }, style]}
    />
  );
});
