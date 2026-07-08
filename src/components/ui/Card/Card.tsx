import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import {
  colors,
  radius,
  shadows,
  spacing as spacingScale,
  type ShadowToken,
  type SpacingToken,
} from '@/theme';

export interface CardProps extends ViewProps {
  padding?: SpacingToken;
  shadow?: ShadowToken;
}

export const Card = React.memo(function CardBase({
  padding = 'lg',
  shadow = 'sm',
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      style={[styles.card, shadows[shadow], { padding: spacingScale[padding] }, style]}
      {...rest}
    >
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});
