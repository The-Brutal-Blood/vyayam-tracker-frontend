import React from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, type ColorToken } from '@/theme';

export interface LoaderProps {
  size?: 'small' | 'large';
  /** Semantic color token. Defaults to the brand primary. */
  color?: ColorToken;
  /** Fills and centers within the whole screen on the app background. */
  fullscreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Loader = React.memo(function LoaderBase({
  size = 'large',
  color = 'primary',
  fullscreen = false,
  style,
}: LoaderProps) {
  const indicator = (
    <ActivityIndicator size={size} color={colors[color]} accessibilityLabel="Loading" />
  );

  if (!fullscreen) {
    return <View style={style}>{indicator}</View>;
  }

  return <View style={[styles.fullscreen, style]}>{indicator}</View>;
});

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
