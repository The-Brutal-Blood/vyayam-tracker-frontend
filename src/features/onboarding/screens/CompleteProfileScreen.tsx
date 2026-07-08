import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type TextInput as RNTextInput,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Controller, useForm } from 'react-hook-form';

import { Button, Input, Screen, Text } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing } from '@/theme';

import { useCompleteProfile } from '../hooks/useCompleteProfile';
import { toCompleteProfilePayload } from '../services/profile.service';
import type { Gender, UserProfile } from '../types/profile.types';
import {
  earliestAllowedDateOfBirth,
  latestAllowedDateOfBirth,
  profileSchema,
  type ProfileFormValues,
} from '../validation/profile.schema';

export interface CompleteProfileScreenProps {
  /**
   * Fired when the backend confirms `profileCompleted === true`.
   * Navigation to the Dashboard is owned by the caller.
   */
  onCompleted?: (profile: UserProfile) => void;
}

const FORM_SLIDE_DISTANCE = 24;
const CTA_ENABLE_SCALE = 1.04;
/** Standard UIDatePicker spinner height; the native view cannot self-size. */
const IOS_PICKER_HEIGHT = 216;

const GENDER_OPTIONS: ReadonlyArray<{ label: string; value: Gender }> = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Prefer not to say', value: 'OTHER' },
];

/** Long, friendly date for the field (e.g. "18 May 2001"). */
function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

interface GenderSelectorProps {
  value?: Gender;
  onChange: (gender: Gender) => void;
  disabled?: boolean;
  error?: string;
}

/** Pill-style single-select, presented to assistive tech as a radio group. */
const GenderSelector = React.memo(function GenderSelectorBase({
  value,
  onChange,
  disabled = false,
  error,
}: GenderSelectorProps) {
  return (
    <View>
      <Text variant="label" color="textSecondary" style={styles.fieldLabel}>
        Gender
      </Text>
      <View style={styles.genderRow} accessibilityRole="radiogroup" accessibilityLabel="Gender">
        {GENDER_OPTIONS.map(option => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: selected, disabled }}
              disabled={disabled}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.genderPill,
                selected && styles.genderPillSelected,
                pressed && !selected && styles.genderPillPressed,
                disabled && styles.disabled,
              ]}
            >
              <Text variant="label" color={selected ? 'textOnPrimary' : 'textSecondary'}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text variant="caption" color="error" style={styles.fieldHelper}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

interface DateOfBirthFieldProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * Native date picker behind an Input-styled trigger. Android opens the system
 * dialog; iOS reveals an inline dark spinner with a Done affordance.
 */
const DateOfBirthField = React.memo(function DateOfBirthFieldBase({
  value,
  onChange,
  disabled = false,
  error,
}: DateOfBirthFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handlePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setPickerOpen(false);
    }
    if (event.type !== 'dismissed' && date) {
      onChange(date);
    }
  };

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Date of birth"
        accessibilityValue={{ text: value ? formatDisplayDate(value) : 'Not set' }}
        accessibilityHint="Opens a date picker"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setPickerOpen(open => !open)}
      >
        <View pointerEvents="none">
          <Input
            label="Date of Birth"
            value={value ? formatDisplayDate(value) : ''}
            placeholder="Select your date of birth"
            error={error}
            disabled={disabled}
            editable={false}
            accessible={false}
          />
        </View>
      </Pressable>
      {pickerOpen ? (
        <View style={Platform.OS === 'ios' ? styles.iosPickerSheet : null}>
          <DateTimePicker
            value={value ?? latestAllowedDateOfBirth()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            themeVariant="dark"
            accentColor={colors.primary}
            maximumDate={latestAllowedDateOfBirth()}
            minimumDate={earliestAllowedDateOfBirth()}
            onChange={handlePickerChange}
            // UIDatePicker does not self-size under the New Architecture
            // (renders at zero height) — it needs explicit dimensions.
            style={Platform.OS === 'ios' ? styles.iosPicker : null}
          />
          {Platform.OS === 'ios' ? (
            <Button
              label="Done"
              variant="ghost"
              size="sm"
              onPress={() => setPickerOpen(false)}
              accessibilityLabel="Done choosing date"
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
});

export const CompleteProfileScreen = React.memo(function CompleteProfileScreenBase({
  onCompleted,
}: CompleteProfileScreenProps) {
  const weightRef = useRef<RNTextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: { fullName: '', heightCm: '', weightKg: '' },
  });

  const complete = useCompleteProfile();
  const [incompleteNotice, setIncompleteNotice] = useState(false);

  const onSubmit = handleSubmit(values => {
    if (complete.isPending) {
      return;
    }
    setIncompleteNotice(false);
    complete.mutate(toCompleteProfilePayload(values), {
      onSuccess: profile => {
        if (profile.profileCompleted) {
          onCompleted?.(profile);
        } else {
          setIncompleteNotice(true);
        }
      },
    });
  });

  const submitting = complete.isPending;

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

  // A brief scale pulse draws the eye to the CTA the moment it unlocks.
  const ctaScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isValid || reduceMotion !== false) {
      return;
    }
    Animated.sequence([
      Animated.timing(ctaScale, {
        toValue: CTA_ENABLE_SCALE,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(ctaScale, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isValid, reduceMotion, ctaScale]);

  return (
    <Screen scrollable>
      <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
        <View style={styles.header}>
          <Text variant="headingXL" accessibilityRole="header">
            Complete Your Profile
          </Text>
          <Text variant="body" color="textSecondary" style={styles.subtitle}>
            Help us personalize your fitness journey.
          </Text>
        </View>

        <Animated.View style={[styles.form, { transform: [{ translateY: formTranslateY }] }]}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <Input
                label="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
                placeholder="Your full name"
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                disabled={submitting}
                accessibilityHint="Enter your full name"
              />
            )}
          />

          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <DateOfBirthField
                value={value}
                onChange={onChange}
                disabled={submitting}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <GenderSelector
                value={value}
                onChange={onChange}
                disabled={submitting}
                error={error?.message}
              />
            )}
          />

          <View style={styles.measurementsRow}>
            <View style={styles.measurementField}>
              <Controller
                control={control}
                name="heightCm"
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <Input
                    label="Height (cm)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    placeholder="180"
                    keyboardType="numeric"
                    maxLength={3}
                    returnKeyType="next"
                    onSubmitEditing={() => weightRef.current?.focus()}
                    disabled={submitting}
                    accessibilityHint="Enter your height in centimeters"
                  />
                )}
              />
            </View>
            <View style={styles.measurementField}>
              <Controller
                control={control}
                name="weightKg"
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <Input
                    ref={weightRef}
                    label="Weight (kg)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    placeholder="82.5"
                    keyboardType="decimal-pad"
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={onSubmit}
                    disabled={submitting}
                    accessibilityHint="Enter your weight in kilograms"
                  />
                )}
              />
            </View>
          </View>

          {complete.isError ? (
            <View
              style={styles.errorBox}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              <Text variant="bodySmall" color="error">
                {complete.error.message}
              </Text>
            </View>
          ) : null}

          {incompleteNotice ? (
            <View
              style={styles.errorBox}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              <Text variant="bodySmall" color="warning">
                Your profile was saved but is not complete yet. Please review your details and try
                again.
              </Text>
            </View>
          ) : null}

          <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
            <Button
              label="Continue"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              disabled={!isValid || submitting}
              onPress={onSubmit}
              accessibilityLabel="Continue"
              accessibilityHint="Saves your profile and continues to the app"
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: spacing['4xl'],
    paddingBottom: spacing['2xl'],
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
  fieldLabel: {
    marginBottom: spacing.sm,
  },
  fieldHelper: {
    marginTop: spacing.xs,
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  genderPill: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  genderPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderPillPressed: {
    backgroundColor: colors.surfaceElevated,
  },
  disabled: {
    opacity: 0.45,
  },
  iosPickerSheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    paddingBottom: spacing.sm,
    overflow: 'hidden',
  },
  iosPicker: {
    alignSelf: 'stretch',
    height: IOS_PICKER_HEIGHT,
  },
  measurementsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  measurementField: {
    flex: 1,
  },
  errorBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
