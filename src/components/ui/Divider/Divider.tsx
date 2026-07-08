import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing as spacingScale, type ColorToken, type SpacingToken } from '@/theme';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  /** Margin applied along the divider's cross axis. */
  spacing?: SpacingToken;
  color?: ColorToken;
  style?: StyleProp<ViewStyle>;
}

export const Divider = React.memo(function DividerBase({
  orientation = 'horizontal',
  spacing = 'none',
  color = 'divider',
  style,
}: DividerProps) {
  const margin = spacingScale[spacing];
  const orientationStyle: ViewStyle =
    orientation === 'horizontal'
      ? { height: StyleSheet.hairlineWidth, marginVertical: margin }
      : { width: StyleSheet.hairlineWidth, marginHorizontal: margin };

  return (
    <View style={[styles.base, orientationStyle, { backgroundColor: colors[color] }, style]} />
  );
});

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
  },
});
