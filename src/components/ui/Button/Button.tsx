import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, type ColorToken } from '@/theme';

import { Text } from '../Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const textColorByVariant: Record<ButtonVariant, ColorToken> = {
  primary: 'textOnPrimary',
  secondary: 'textPrimary',
  outline: 'primary',
  ghost: 'primary',
};

export const Button = React.memo(function ButtonBase({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || loading;
  const textColor = textColorByVariant[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && pressedStyles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors[textColor]} />
      ) : (
        <>
          {leftIcon}
          <Text variant="button" color={textColor}>
            {label}
          </Text>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.45,
  },
});

const sizeStyles = StyleSheet.create({
  sm: { height: 36, paddingHorizontal: spacing.md },
  md: { height: 48, paddingHorizontal: spacing.lg },
  lg: { height: 56, paddingHorizontal: spacing.xl },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceElevated },
  outline: { borderWidth: 1, borderColor: colors.primary },
  ghost: {},
});

const pressedStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primaryDark },
  secondary: { backgroundColor: colors.surface },
  outline: { backgroundColor: colors.surface },
  ghost: { opacity: 0.7 },
});
