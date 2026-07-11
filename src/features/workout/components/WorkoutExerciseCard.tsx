import React from 'react';
import { Alert, Image, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { DotsVerticalIcon, PlusIcon, TimerIcon } from '@/components/icons/ActionIcons';
import { Text } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';

import { columns, WorkoutSetRow } from './WorkoutSetRow';
import type { WorkoutExerciseState } from '../types/workout.types';
import { formatRestTimer } from '../utils/restTimer';

export interface WorkoutExerciseCardProps {
  exercise: WorkoutExerciseState;
  onChangeNotes: (notes: string) => void;
  onChangeSet: (setId: string, field: 'weight' | 'reps', value: string) => void;
  onToggleSet: (setId: string) => void;
  onAddSet: () => void;
  onRemoveSet: (setId: string) => void;
  onRemoveExercise: () => void;
}

const THUMBNAIL_SIZE = 40;
const MENU_HIT_SIZE = 32;

/** One exercise in the live session: header, notes, rest, and the sets table. */
export const WorkoutExerciseCard = React.memo(function WorkoutExerciseCardBase({
  exercise,
  onChangeNotes,
  onChangeSet,
  onToggleSet,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
}: WorkoutExerciseCardProps) {
  const confirmRemoveExercise = () => {
    Alert.alert(exercise.exerciseName, undefined, [
      { text: 'Remove exercise', style: 'destructive', onPress: onRemoveExercise },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const previousBySetNumber = new Map(
    exercise.previousSets.map(previous => [previous.setNumber, previous]),
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: exercise.imageUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
          accessible={false}
        />
        <Text variant="title" color="primary" numberOfLines={2} style={styles.title}>
          {exercise.exerciseName}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Options for ${exercise.exerciseName}`}
          onPress={confirmRemoveExercise}
          hitSlop={spacing.sm}
          style={({ pressed }) => [styles.menuButton, pressed && styles.menuButtonPressed]}
        >
          <DotsVerticalIcon color={colors.textSecondary} size={20} />
        </Pressable>
      </View>

      <TextInput
        value={exercise.notes}
        onChangeText={onChangeNotes}
        placeholder="Add notes here..."
        placeholderTextColor={colors.placeholder}
        selectionColor={colors.primary}
        style={styles.notes}
        multiline
        accessibilityLabel={`Notes for ${exercise.exerciseName}`}
      />

      <View style={styles.restRow}>
        <TimerIcon color={colors.primary} size={18} />
        <Text variant="subtitle" color="primary">
          {`Rest Timer: ${formatRestTimer(exercise.restTimerSeconds)}`}
        </Text>
      </View>

      <View style={styles.tableHeader}>
        <Text variant="label" color="textSecondary" style={columns.set}>
          SET
        </Text>
        <Text variant="label" color="textSecondary" style={columns.previous}>
          PREVIOUS
        </Text>
        <Text variant="label" color="textSecondary" style={columns.valueHeader}>
          KG
        </Text>
        <Text variant="label" color="textSecondary" style={columns.valueHeader}>
          REPS
        </Text>
        <View style={columns.check} />
      </View>

      {exercise.sets.map((set, index) => (
        <WorkoutSetRow
          key={set.workoutSetId}
          index={index}
          set={set}
          previous={previousBySetNumber.get(set.setNumber)}
          onChangeWeight={value => onChangeSet(set.workoutSetId, 'weight', value)}
          onChangeReps={value => onChangeSet(set.workoutSetId, 'reps', value)}
          onToggleComplete={() => onToggleSet(set.workoutSetId)}
          onRemove={() => onRemoveSet(set.workoutSetId)}
        />
      ))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add set"
        accessibilityHint={`Adds a set to ${exercise.exerciseName}`}
        onPress={onAddSet}
        style={({ pressed }) => [styles.addSet, pressed && styles.addSetPressed]}
      >
        <PlusIcon color={colors.textPrimary} size={18} />
        <Text variant="button" color="textPrimary">
          Add Set
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: THUMBNAIL_SIZE / 2,
    backgroundColor: colors.surfaceElevated,
  },
  title: {
    flex: 1,
    textTransform: 'capitalize',
  },
  menuButton: {
    width: MENU_HIT_SIZE,
    height: MENU_HIT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: MENU_HIT_SIZE / 2,
  },
  menuButtonPressed: {
    backgroundColor: colors.surface,
  },
  notes: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  addSet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
  },
  addSetPressed: {
    backgroundColor: colors.surface,
  },
});
