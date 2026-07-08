import React, { forwardRef, useCallback, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import { Text } from '../Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(function InputBase(
  {
    label,
    error,
    helperText,
    disabled = false,
    leftIcon,
    rightIcon,
    containerStyle,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
    event => {
      setFocused(true);
      onFocus?.(event);
    },
    [onFocus],
  );

  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
    event => {
      setFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  const borderColor = error ? colors.error : focused ? colors.primary : colors.border;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="label" color="textSecondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.field, { borderColor }, disabled && styles.disabled]}>
        {leftIcon ? <View>{leftIcon}</View> : null}
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          editable={!disabled}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {rightIcon ? <View>{rightIcon}</View> : null}
      </View>
      {error || helperText ? (
        <Text variant="caption" color={error ? 'error' : 'textSecondary'} style={styles.helper}>
          {error ?? helperText}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.sm,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    gap: spacing.sm,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  disabled: {
    opacity: 0.45,
  },
  helper: {
    marginTop: spacing.xs,
  },
});
