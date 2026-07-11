import React from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CheckIcon } from '@/components/icons/ActionIcons';
import { Text } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';

import type { WorkoutPreviousSet, WorkoutSetState } from '../types/workout.types';

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
          onChangeText={onChangeWeight}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          keyboardType="numeric"
          maxLength={6}
          style={styles.input}
          accessibilityLabel={`Set ${index + 1} weight in kilograms`}
        />
      </View>
      <View style={columns.value}>
        <TextInput
          value={set.reps}
          onChangeText={onChangeReps}
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          keyboardType="numeric"
          maxLength={4}
          style={styles.input}
          accessibilityLabel={`Set ${index + 1} repetitions`}
        />
      </View>
      <View style={columns.check}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: set.completed }}
          accessibilityLabel={`Set ${index + 1} completed`}
          onPress={onToggleComplete}
          hitSlop={spacing.sm}
          style={[styles.checkbox, set.completed && styles.checkboxChecked]}
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
});
