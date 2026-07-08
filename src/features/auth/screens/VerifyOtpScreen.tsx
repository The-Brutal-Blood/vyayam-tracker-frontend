import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing, typography } from '@/theme';

import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { OTP_LENGTH, otpSchema } from '../validation/auth.schemas';

export interface VerifyOtpScreenProps {
  /** Email the OTP was sent to; also submitted with the verification request. */
  email: string;
  /** Fired once the OTP is accepted. */
  onVerified?: () => void;
  /** Fired when the user taps continue on the success state. Navigation is owned by the caller. */
  onContinue?: () => void;
}

const FORM_SLIDE_DISTANCE = 24;
const RESEND_COOLDOWN_SECONDS = 30;

const OTP_BOX_WIDTH = 48;
const OTP_BOX_HEIGHT = 56;
const OTP_BOX_FOCUS_SCALE = 1.08;
const SUCCESS_BADGE_SIZE = 88;

interface OtpInputProps {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  /** Disables the focus scale animation (Reduce Motion). */
  animateFocus?: boolean;
}

/**
 * Six-box OTP field. Models the code as one contiguous string: focus is
 * always redirected to the first empty box, typing advances, backspace on an
 * empty box deletes the previous digit, and a multi-character change (paste
 * or OS one-time-code autofill) is distributed across the boxes.
 */
const OtpInput = React.memo(function OtpInputBase({
  value,
  onChange,
  disabled = false,
  hasError = false,
  animateFocus = true,
}: OtpInputProps) {
  const boxRefs = useRef<Array<TextInput | null>>([]);
  const scales = useRef(
    Array.from({ length: OTP_LENGTH }, () => new Animated.Value(1)),
  ).current;
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const scaleTo = useCallback(
    (index: number, toValue: number) => {
      if (!animateFocus) {
        return;
      }
      Animated.timing(scales[index], {
        toValue,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    },
    [animateFocus, scales],
  );

  const handleFocus = (index: number) => {
    // Keep the code contiguous: focusing past the first empty box snaps back.
    const firstEmpty = Math.min(value.length, OTP_LENGTH - 1);
    if (index > firstEmpty) {
      boxRefs.current[firstEmpty]?.focus();
      return;
    }
    setFocusedIndex(index);
    scaleTo(index, OTP_BOX_FOCUS_SCALE);
  };

  const handleBlur = (index: number) => {
    setFocusedIndex(current => (current === index ? null : current));
    scaleTo(index, 1);
  };

  const handleChange = (text: string, index: number) => {
    const digits = text.replace(/\D+/g, '');
    if (digits.length === 0) {
      // Backspace cleared this box; shift any following digits left.
      onChange(value.slice(0, index) + value.slice(index + 1));
      return;
    }
    // Single digit, paste, or OS autofill — insert starting at this box.
    const next = (value.slice(0, index) + digits + value.slice(index + digits.length)).slice(
      0,
      OTP_LENGTH,
    );
    onChange(next);
    if (next.length >= OTP_LENGTH) {
      boxRefs.current[index]?.blur();
    } else {
      boxRefs.current[Math.min(next.length, OTP_LENGTH - 1)]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key !== 'Backspace' || value[index] || index === 0) {
      return;
    }
    // Backspace on an empty box removes the previous digit.
    onChange(value.slice(0, index - 1) + value.slice(index));
    boxRefs.current[index - 1]?.focus();
  };

  return (
    <View
      style={styles.otpRow}
      accessibilityHint={`Enter the ${OTP_LENGTH}-digit verification code`}
    >
      {Array.from({ length: OTP_LENGTH }, (_, index) => {
        const isFocused = focusedIndex === index;
        const borderColor = hasError
          ? colors.error
          : isFocused
          ? colors.primary
          : colors.border;
        return (
          <Animated.View key={index} style={{ transform: [{ scale: scales[index] }] }}>
            <TextInput
              ref={element => {
                boxRefs.current[index] = element;
              }}
              value={value[index] ?? ''}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={event => handleKeyPress(event, index)}
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              editable={!disabled}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              selectTextOnFocus
              maxFontSizeMultiplier={1.3}
              style={[styles.otpBox, { borderColor }]}
              accessibilityLabel={`Verification code digit ${index + 1} of ${OTP_LENGTH}`}
              accessibilityState={{ disabled }}
            />
          </Animated.View>
        );
      })}
    </View>
  );
});

export const VerifyOtpScreen = React.memo(function VerifyOtpScreenBase({
  email,
  onVerified,
  onContinue,
}: VerifyOtpScreenProps) {
  const [otp, setOtp] = useState('');
  const verify = useVerifyOtp();
  const verified = verify.isSuccess;
  const otpComplete = otpSchema.safeParse(otp).success;

  const handleOtpChange = (next: string) => {
    // Editing after a failed attempt clears the stale error immediately.
    if (verify.isError) {
      verify.reset();
    }
    setOtp(next);
  };

  const handleVerify = () => {
    if (!otpComplete || verify.isPending || verified) {
      return;
    }
    verify.mutate({ email, otp }, { onSuccess: () => onVerified?.() });
  };

  // Resend cooldown. The countdown/UX is final; once the resend endpoint
  // exists, add postResendEmailOtp() (see auth.api.ts), a service function,
  // a useResendOtp() hook, and call it inside handleResend.
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => setCooldown(seconds => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown > 0) {
      return;
    }
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

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

  // Success state gently scales in once verification lands.
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (!verified) {
      return;
    }
    if (reduceMotion) {
      successOpacity.setValue(1);
      successScale.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(successScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [verified, reduceMotion, successOpacity, successScale]);

  return (
    <Screen scrollable>
      <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
        {verified ? (
          <Animated.View
            style={[
              styles.successArea,
              { opacity: successOpacity, transform: [{ scale: successScale }] },
            ]}
            accessibilityLiveRegion="polite"
          >
            <View style={styles.successBadge}>
              <View style={styles.successBadgeFill} />
              <Text variant="displayL" color="success" accessibilityLabel="Success">
                ✓
              </Text>
            </View>
            <Text variant="headingL" align="center" accessibilityRole="header">
              Email verified
            </Text>
            <Text variant="body" color="textSecondary" align="center">
              {`${email} is confirmed. Next up: setting up your profile.`}
            </Text>
            <Button
              label="Set Up Profile"
              variant="primary"
              size="lg"
              fullWidth
              onPress={onContinue}
              accessibilityLabel="Set Up Profile"
              accessibilityHint="Continues to profile setup"
              style={styles.successCta}
            />
          </Animated.View>
        ) : (
          <>
            <View style={styles.header}>
              <Text variant="headingXL" accessibilityRole="header">
                Verify your email
              </Text>
              <Text variant="body" color="textSecondary" style={styles.subtitle}>
                Enter the verification code sent to
              </Text>
              <Text variant="subtitle" style={styles.email}>
                {email}
              </Text>
            </View>

            <Animated.View style={[styles.form, { transform: [{ translateY: formTranslateY }] }]}>
              <OtpInput
                value={otp}
                onChange={handleOtpChange}
                disabled={verify.isPending}
                hasError={verify.isError}
                animateFocus={reduceMotion === false}
              />

              {verify.isError ? (
                <View
                  style={styles.errorBox}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                >
                  <Text variant="bodySmall" color="error">
                    {verify.error.message}
                  </Text>
                </View>
              ) : null}

              <Button
                label="Verify OTP"
                variant="primary"
                size="lg"
                fullWidth
                loading={verify.isPending}
                disabled={!otpComplete || verify.isPending}
                onPress={handleVerify}
                accessibilityLabel="Verify OTP"
                accessibilityHint="Confirms the verification code sent to your email"
              />

              <View style={styles.resendRow}>
                <Text variant="bodySmall" color="textSecondary">
                  {"Didn't receive the code?"}
                </Text>
                <Button
                  label={cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                  variant="ghost"
                  size="sm"
                  disabled={cooldown > 0}
                  onPress={handleResend}
                  accessibilityLabel="Resend OTP"
                  accessibilityHint="Sends a new verification code to your email"
                />
              </View>
            </Animated.View>
          </>
        )}
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
  email: {
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing['2xl'],
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  otpBox: {
    ...typography.headingM,
    width: OTP_BOX_WIDTH,
    height: OTP_BOX_HEIGHT,
    textAlign: 'center',
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  errorBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  resendRow: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  successArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  successBadge: {
    width: SUCCESS_BADGE_SIZE,
    height: SUCCESS_BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  successCta: {
    marginTop: spacing['2xl'],
  },
  successBadgeFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: SUCCESS_BADGE_SIZE / 2,
    backgroundColor: colors.success,
    opacity: 0.15,
  },
});
