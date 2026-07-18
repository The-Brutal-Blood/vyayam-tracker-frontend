import React from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CheckIcon } from '@/components/icons/ActionIcons';
import { Text } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';

import type { WorkoutPreviousSet, WorkoutSetState } from '../types/workout.types';
import { parseNumericField } from '../utils/workoutSession';

export interface WorkoutSetRowProps {
  index: number;
  set: WorkoutSetState;
  previous?: WorkoutPreviousSet;
  onChangeWeight: (value: string) => void;
  onChangeReps: (value: string) => void;
  onToggleComplete: () => void;
  onRemove: () => void;
}

const CHECK_SIZE = 28;

function formatPrevious(previous?: WorkoutPreviousSet): string {
  if (!previous || previous.actualWeight == null || previous.actualReps == null) {
    return '-';
  }
  return `${previous.actualWeight} × ${previous.actualReps}`;
}

/** Digits plus at most one decimal point — keyboardType alone doesn't block
 *  letters from paste or external keyboards. */
function sanitizeWeight(value: string): string {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) {
    return cleaned;
  }
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
}

/** Whole numbers only. */
function sanitizeReps(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

/** One logged set: number, previous, editable weight/reps, completion toggle. */
export const WorkoutSetRow = React.memo(function WorkoutSetRowBase({
  index,
  set,
  previous,
  onChangeWeight,
  onChangeReps,
  onToggleComplete,
  onRemove,
}: WorkoutSetRowProps) {
  const confirmRemove = () => {
    Alert.alert('Remove set', `Remove set ${index + 1}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onRemove },
    ]);
  };

  // A set may only be ticked once both fields hold a real number;
  // unticking an already-completed set is always allowed.
  const hasValues = parseNumericField(set.weight) != null && parseNumericField(set.reps) != null;
  const checkDisabled = !set.completed && !hasValues;

  return (
    <Pressable
      onLongPress={confirmRemove}
      delayLongPress={350}
      accessibilityRole="button"
      accessibilityLabel={`Set ${index + 1}`}
      accessibilityHint="Long press to remove this set"
      style={[styles.row, set.completed && styles.rowCompleted]}
    >
      <Text variant="subtitle" style={columns.set}>
        {index + 1}
      </Text>
      <Text variant="bodySmall" color="textSecondary" numberOfLines={1} style={columns.previous}>
        {formatPrevious(previous)}
      </Text>
      <View style={columns.value}>
        <TextInput
          value={set.weight}
          onChangeText={value => onChangeWeight(sanitizeWeight(value))}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          keyboardType="numeric"
          maxLength={6}
          style={[styles.input, set.prefilled && styles.inputPrefilled]}
          accessibilityLabel={`Set ${index + 1} weight in kilograms`}
        />
      </View>
      <View style={columns.value}>
        <TextInput
          value={set.reps}
          onChangeText={value => onChangeReps(sanitizeReps(value))}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          keyboardType="numeric"
          maxLength={4}
          style={[styles.input, set.prefilled && styles.inputPrefilled]}
          accessibilityLabel={`Set ${index + 1} repetitions`}
        />
      </View>
      <View style={columns.check}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: set.completed, disabled: checkDisabled }}
          accessibilityLabel={`Set ${index + 1} completed`}
          accessibilityHint={checkDisabled ? 'Enter weight and reps first' : undefined}
          disabled={checkDisabled}
          onPress={onToggleComplete}
          hitSlop={spacing.sm}
          style={[
            styles.checkbox,
            set.completed && styles.checkboxChecked,
            checkDisabled && styles.checkboxDisabled,
          ]}
        >
          {set.completed ? <CheckIcon color={colors.textOnPrimary} size={18} /> : null}
        </Pressable>
      </View>
    </Pressable>
  );
});

/** Shared column widths so the card header and rows stay aligned. */
export const columns = StyleSheet.create({
  set: {
    width: 28,
    textAlign: 'center',
  },
  previous: {
    flex: 1.3,
    textAlign: 'center',
  },
  value: {
    flex: 1,
    alignItems: 'center',
  },
  valueHeader: {
    flex: 1,
    textAlign: 'center',
  },
  check: {
    width: 40,
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  rowCompleted: {
    backgroundColor: colors.primarySoft,
  },
  input: {
    ...typography.subtitle,
    color: colors.textPrimary,
    textAlign: 'center',
    minWidth: 56,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
  },
  // Values carried over from the previous set look like placeholders until
  // the user edits or completes the set.
  inputPrefilled: {
    color: colors.placeholder,
  },
  checkbox: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxDisabled: {
    opacity: 0.4,
  },
});
