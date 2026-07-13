import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Button, Text } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';

export interface LogWeightSheetProps {
  visible: boolean;
  /** Dismisses without saving (Later / backdrop / hardware back). */
  onClose: () => void;
  /** Saves the entered weight in kilograms. */
  onSave: (weightKg: number) => void;
  /** Disables inputs and shows a spinner on Save while the request is in flight. */
  submitting?: boolean;
  /** Last known weight, used to seed the field. */
  placeholderWeight?: number | null;
}

const MAX_WEIGHT_KG = 500;

function parseWeight(value: string): number | null {
  const parsed = Number.parseFloat(value.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > MAX_WEIGHT_KG) {
    return null;
  }
  return Math.round(parsed * 100) / 100;
}

/**
 * Bottom sheet prompting the user to log today's body weight. Slides up using
 * the Modal's built-in animation; keyboard-aware so the field stays visible.
 */
export const LogWeightSheet = React.memo(function LogWeightSheetBase({
  visible,
  onClose,
  onSave,
  submitting = false,
  placeholderWeight,
}: LogWeightSheetProps) {
  const [value, setValue] = useState('');

  // Seed with the last known weight each time the sheet opens.
  useEffect(() => {
    if (visible) {
      setValue(placeholderWeight != null ? String(placeholderWeight) : '');
    }
  }, [visible, placeholderWeight]);

  const weight = parseWeight(value);
  const canSave = weight != null && !submitting;

  const handleSave = () => {
    if (weight != null) {
      onSave(weight);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdropContainer}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text variant="title" align="center" accessibilityRole="header" style={styles.title}>
            📈  Log Today's Weight
          </Text>
          <Text variant="bodySmall" color="textSecondary" align="center" style={styles.subtitle}>
            Tracking your weight daily helps you measure real progress.
          </Text>

          <View style={styles.inputField}>
            <TextInput
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
              placeholder={placeholderWeight != null ? String(placeholderWeight) : '0.0'}
              placeholderTextColor={colors.placeholder}
              selectionColor={colors.primary}
              selectTextOnFocus
              editable={!submitting}
              maxLength={6}
              style={styles.input}
              accessibilityLabel="Weight in kilograms"
            />
            <Text variant="headingM" color="textSecondary">
              kg
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              label="Later"
              variant="secondary"
              size="lg"
              onPress={onClose}
              disabled={submitting}
              accessibilityLabel="Later"
              accessibilityHint="Dismisses without logging your weight"
              style={styles.action}
            />
            <Button
              label="Save"
              variant="primary"
              size="lg"
              loading={submitting}
              disabled={!canSave}
              onPress={handleSave}
              accessibilityLabel="Save weight"
              accessibilityHint="Logs today's body weight"
              style={styles.action}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.backdrop,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  title: {
    marginTop: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    minWidth: 180,
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  input: {
    ...typography.displayL,
    color: colors.textPrimary,
    textAlign: 'center',
    minWidth: 90,
    paddingVertical: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing['2xl'],
  },
  action: {
    flex: 1,
  },
});
