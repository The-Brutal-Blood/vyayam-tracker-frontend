import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { colors, typography, type ColorToken, type TypographyToken } from '@/theme';

export interface TextProps extends RNTextProps {
  /** Typography token from the design system. */
  variant?: TypographyToken;
  /** Semantic color token from the design system. */
  color?: ColorToken;
  align?: TextStyle['textAlign'];
}

export const Text = React.memo(function TextBase({
  variant = 'body',
  color = 'textPrimary',
  align,
  style,
  children,
  ...rest
}: TextProps) {
  return (
    <RNText
      style={[typography[variant], { color: colors[color], textAlign: align }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
});
