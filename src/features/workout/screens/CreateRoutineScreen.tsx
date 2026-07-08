import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { CloseIcon, PlusIcon } from '@/components/icons/ActionIcons';
import { DumbbellIcon } from '@/components/icons/TabIcons';
import { Button, Screen, Text } from '@/components/ui';
import type { Exercise } from '@/features/exercises/types/exercise.types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing, typography } from '@/theme';

export interface RoutineDraft {
  name: string;
  exercises: Exercise[];
}

export interface CreateRoutineScreenProps {
  /** Exercises returned by the Add Exercise flow; merged into the draft. */
  addedExercises?: Exercise[];
  /** Opens the exercise picker. Navigation is owned by the caller. */
  onAddExercise?: () => void;
  /** Dismisses the screen without saving. Navigation is owned by the caller. */
  onCancel?: () => void;
  /** Fired with the draft when Save is pressed. Persistence is wired later. */
  onSave?: (draft: RoutineDraft) => void;
}

const EMPTY_STATE_ICON_SIZE = 48;
const EXERCISE_THUMBNAIL_SIZE = 44;

export const CreateRoutineScreen = React.memo(function CreateRoutineScreenBase({
  addedExercises,
  onAddExercise,
  onCancel,
  onSave,
}: CreateRoutineScreenProps) {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Each Add Exercise round trip delivers a fresh batch; merge without
  // duplicating anything already in the draft.
  useEffect(() => {
    if (!addedExercises || addedExercises.length === 0) {
      return;
    }
    setExercises(current => {
      const known = new Set(current.map(exercise => exercise.id));
      const fresh = addedExercises.filter(exercise => !known.has(exercise.id));
      return fresh.length > 0 ? [...current, ...fresh] : current;
    });
  }, [addedExercises]);

  const removeExercise = (id: string) => {
    setExercises(current => current.filter(exercise => exercise.id !== id));
  };

  const canSave = name.trim().length > 0;
  const isDirty = name.trim().length > 0 || exercises.length > 0;

  const handleCancel = () => {
    if (!isDirty) {
      onCancel?.();
      return;
    }
    Alert.alert('Discard routine?', 'Your changes will not be saved.', [
      { text: 'Keep Editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => onCancel?.() },
    ]);
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    onSave?.({ name: name.trim(), exercises });
  };

  // Content eases in under the modal slide.
  const reduceMotion = useReducedMotion();
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion === null) {
      return undefined;
    }
    if (reduceMotion) {
      contentOpacity.setValue(1);
      return undefined;
    }
    const entrance = Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    entrance.start();
    return () => entrance.stop();
  }, [reduceMotion, contentOpacity]);

  return (
    <Screen padded={false}>
      <Animated.View style={[styles.root, { opacity: contentOpacity }]}>
        <View style={styles.header}>
          <Button
            label="Cancel"
            variant="ghost"
            size="sm"
            onPress={handleCancel}
            accessibilityLabel="Cancel"
            accessibilityHint="Closes without saving the routine"
          />
          <Text variant="title" accessibilityRole="header">
            Create Routine
          </Text>
          <Button
            label="Save"
            variant="primary"
            size="sm"
            disabled={!canSave}
            onPress={handleSave}
            accessibilityLabel="Save"
            accessibilityHint="Saves the routine"
          />
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Routine title"
            placeholderTextColor={colors.placeholder}
            selectionColor={colors.primary}
            style={styles.titleInput}
            maxLength={60}
            returnKeyType="done"
            accessibilityLabel="Routine title"
            accessibilityHint="Names your new routine"
          />

          {exercises.length === 0 ? (
            <View style={styles.emptyState}>
              <DumbbellIcon color={colors.textSecondary} size={EMPTY_STATE_ICON_SIZE} />
              <Text
                variant="body"
                color="textSecondary"
                align="center"
                style={styles.emptyText}
              >
                Get started by adding an exercise to your routine.
              </Text>
              <Button
                label="Add exercise"
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<PlusIcon color={colors.textOnPrimary} />}
                onPress={onAddExercise}
                accessibilityLabel="Add exercise"
                accessibilityHint="Opens the exercise picker"
                style={styles.addButton}
              />
            </View>
          ) : (
            <View style={styles.exerciseSection}>
              <Text variant="label" color="textSecondary" style={styles.exerciseCount}>
                {`Exercises (${exercises.length})`}
              </Text>
              <View style={styles.exerciseList}>
                {exercises.map(exercise => (
                  <View key={exercise.id} style={styles.exerciseRow}>
                    <Image
                      source={{ uri: exercise.imageUrl }}
                      style={styles.exerciseThumbnail}
                      resizeMode="cover"
                      accessible={false}
                    />
                    <View style={styles.exerciseInfo}>
                      <Text variant="subtitle" numberOfLines={1} style={styles.exerciseName}>
                        {exercise.name}
                      </Text>
                      <Text
                        variant="bodySmall"
                        color="textSecondary"
                        numberOfLines={1}
                        style={styles.exerciseName}
                      >
                        {exercise.primaryMuscle}
                      </Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${exercise.name}`}
                      onPress={() => removeExercise(exercise.id)}
                      hitSlop={spacing.md}
                    >
                      <CloseIcon color={colors.textSecondary} size={18} />
                    </Pressable>
                  </View>
                ))}
              </View>
              <Button
                label="Add exercise"
                variant="secondary"
                size="lg"
                fullWidth
                leftIcon={<PlusIcon color={colors.primary} />}
                onPress={onAddExercise}
                accessibilityLabel="Add exercise"
                accessibilityHint="Opens the exercise picker"
                style={styles.addMoreButton}
              />
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  titleInput: {
    ...typography.headingL,
    color: colors.textPrimary,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  bodyContent: {
    paddingBottom: spacing['3xl'],
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing['7xl'],
  },
  emptyText: {
    marginTop: spacing.lg,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  addButton: {
    alignSelf: 'stretch',
  },
  exerciseSection: {
    marginTop: spacing['2xl'],
  },
  exerciseCount: {
    marginBottom: spacing.md,
  },
  exerciseList: {
    gap: spacing.sm,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  exerciseThumbnail: {
    width: EXERCISE_THUMBNAIL_SIZE,
    height: EXERCISE_THUMBNAIL_SIZE,
    borderRadius: EXERCISE_THUMBNAIL_SIZE / 2,
    backgroundColor: colors.surfaceElevated,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    textTransform: 'capitalize',
  },
  addMoreButton: {
    marginTop: spacing.xl,
  },
});
