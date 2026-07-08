import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  type TextInput as RNTextInput,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button, Input, Screen, Text } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing } from '@/theme';

import { useRegister } from '../hooks/useRegister';
import { normalizeEmail } from '../services/auth.service';
import { signupSchema, type SignupFormValues } from '../validation/auth.schemas';

export interface SignUpScreenProps {
  /**
   * Fired after the backend accepts the registration and has emailed an OTP.
   * Receives the normalized email; navigation is owned by the caller.
   */
  onRegistered?: (email: string) => void;
}

const FORM_SLIDE_DISTANCE = 24;

interface VisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
}

/** Show/Hide affordance for password fields. */
const VisibilityToggle = React.memo(function VisibilityToggleBase({
  visible,
  onToggle,
}: VisibilityToggleProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      onPress={onToggle}
      hitSlop={spacing.sm}
    >
      <Text variant="label" color="primary">
        {visible ? 'Hide' : 'Show'}
      </Text>
    </Pressable>
  );
});

export const SignUpScreen = React.memo(function SignUpScreenBase({
  onRegistered,
}: SignUpScreenProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const passwordRef = useRef<RNTextInput>(null);
  const confirmRef = useRef<RNTextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const register = useRegister();

  const onSubmit = handleSubmit(values => {
    if (register.isPending) {
      return;
    }
    const email = normalizeEmail(values.email);
    register.mutate(
      { email, password: values.password },
      { onSuccess: () => onRegistered?.(email) },
    );
  });

  // Entrance: screen fades in while the form slides up.
  const reduceMotion = useReducedMotion();
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(FORM_SLIDE_DISTANCE)).current;

  useEffect(() => {
    if (reduceMotion === null) {
      return undefined;
    }
    if (reduceMotion) {
      screenOpacity.setValue(1);
      formTranslateY.setValue(0);
      return undefined;
    }
    const easeOut = Easing.out(Easing.cubic);
    const entrance = Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 450,
        easing: easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 500,
        easing: easeOut,
        useNativeDriver: true,
      }),
    ]);
    entrance.start();
    return () => entrance.stop();
  }, [reduceMotion, screenOpacity, formTranslateY]);

  return (
    <Screen scrollable>
      <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
        <View style={styles.header}>
          <Text variant="headingXL" accessibilityRole="header">
            Create your account
          </Text>
          <Text variant="body" color="textSecondary" style={styles.subtitle}>
            Start tracking your training in minutes.
          </Text>
        </View>

        <Animated.View style={[styles.form, { transform: [{ translateY: formTranslateY }] }]}>
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <Input
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityHint="Enter the email address for your new account"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <Input
                ref={passwordRef}
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                helperText="Min 8 characters with uppercase, lowercase, number and special character."
                placeholder="Create a password"
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                // iOS "new password" autofill draws an opaque cover view over
                // the form unless Associated Domains are configured; opt out
                // until webcredentials support exists.
                autoComplete="off"
                textContentType="none"
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                rightIcon={
                  <VisibilityToggle
                    visible={passwordVisible}
                    onToggle={() => setPasswordVisible(current => !current)}
                  />
                }
                accessibilityHint="Create a password for your new account"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <Input
                ref={confirmRef}
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                placeholder="Re-enter your password"
                secureTextEntry={!confirmVisible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                textContentType="none"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                rightIcon={
                  <VisibilityToggle
                    visible={confirmVisible}
                    onToggle={() => setConfirmVisible(current => !current)}
                  />
                }
                accessibilityHint="Re-enter your password to confirm it"
              />
            )}
          />

          {register.isError ? (
            <View style={styles.errorBox} accessibilityRole="alert" accessibilityLiveRegion="polite">
              <Text variant="bodySmall" color="error">
                {register.error.message}
              </Text>
            </View>
          ) : null}

          <Button
            label="Create Account"
            variant="primary"
            size="lg"
            fullWidth
            loading={register.isPending}
            disabled={!isValid || register.isPending}
            onPress={onSubmit}
            accessibilityLabel="Create Account"
            accessibilityHint="Registers your account and sends a verification code to your email"
            style={styles.submit}
          />
        </Animated.View>
      </Animated.View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: spacing['4xl'],
  },
  header: {
    marginBottom: spacing['3xl'],
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.xl,
  },
  errorBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
