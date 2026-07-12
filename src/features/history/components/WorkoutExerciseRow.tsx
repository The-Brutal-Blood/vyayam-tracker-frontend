import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

import { WorkoutSetChip } from './WorkoutSetChip';
import type { WorkoutHistoryExercise } from '../types/history.types';

export interface WorkoutExerciseRowProps {
  exercise: WorkoutHistoryExercise;
}

const IMAGE_SIZE = 44;

/** One exercise in an expanded workout card: circular thumbnail, name, and
 *  chips for each completed set (incomplete sets are ignored). */
export const WorkoutExerciseRow = React.memo(function WorkoutExerciseRowBase({
  exercise,
}: WorkoutExerciseRowProps) {
  const completedSets = useMemo(
    () => exercise.sets.filter(set => set.completed),
    [exercise.sets],
  );

  return (
    <View style={styles.row}>
      <Image
        source={{ uri: exercise.imageUrl }}
        style={styles.image}
        resizeMode="cover"
        accessible={false}
      />
      <View style={styles.body}>
        <Text variant="subtitle" numberOfLines={2} style={styles.name}>
          {exercise.exerciseName}
        </Text>
        {completedSets.length > 0 ? (
          <View style={styles.chips}>
            {completedSets.map(set => (
              <WorkoutSetChip key={set.setNumber} weight={set.weight} reps={set.reps} />
            ))}
          </View>
        ) : (
          <Text variant="caption" color="textDisabled" style={styles.emptyNote}>
            No completed sets
          </Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    backgroundColor: colors.surfaceElevated,
  },
  body: {
    flex: 1,
    paddingTop: spacing.xxs,
  },
  name: {
    textTransform: 'capitalize',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  emptyNote: {
    marginTop: spacing.xs,
  },
});
