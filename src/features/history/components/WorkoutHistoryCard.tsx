import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons/ActionIcons';
import { Card, Divider, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

import { WorkoutExerciseRow } from './WorkoutExerciseRow';
import type { WorkoutHistoryItem } from '../types/history.types';
import {
  formatDuration,
  formatHistoryDate,
  formatSetCount,
  formatVolume,
} from '../utils/historyFormat';

export interface WorkoutHistoryCardProps {
  workout: WorkoutHistoryItem;
}

/** How many exercise names to preview while collapsed. */
const COLLAPSED_PREVIEW = 3;

/**
 * One completed workout as a collapsible card. Collapsed (default) shows the
 * summary plus a short exercise preview; expanding reveals every exercise with
 * its completed sets. Keeping it collapsed by default keeps the list light even
 * for workouts with many exercises.
 */
export const WorkoutHistoryCard = React.memo(function WorkoutHistoryCardBase({
  workout,
}: WorkoutHistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const meta = [
    formatDuration(workout.durationMinutes),
    formatVolume(workout.totalVolume),
    formatSetCount(workout.completedSetCount),
  ].join('  •  ');

  const previewNames = workout.exercises.slice(0, COLLAPSED_PREVIEW);
  const remaining = workout.exercises.length - previewNames.length;

  return (
    <Card>
      <View style={styles.header}>
        <Text variant="title" numberOfLines={1} style={styles.routine}>
          {workout.routineName}
        </Text>
        <Text variant="caption" color="textSecondary">
          {formatHistoryDate(workout.completedAt)}
        </Text>
      </View>

      <Text variant="bodySmall" color="textSecondary" style={styles.meta}>
        {meta}
      </Text>

      <Divider style={styles.divider} />

      {expanded ? (
        <View style={styles.exercises}>
          {workout.exercises.map(exercise => (
            <WorkoutExerciseRow key={exercise.exerciseId} exercise={exercise} />
          ))}
        </View>
      ) : (
        <View style={styles.preview}>
          {previewNames.map(exercise => (
            <Text
              key={exercise.exerciseId}
              variant="body"
              numberOfLines={1}
              style={styles.previewName}
            >
              {exercise.exerciseName}
            </Text>
          ))}
          {remaining > 0 ? (
            <Text variant="bodySmall" color="textSecondary" style={styles.previewMore}>
              {`+${remaining} more ${remaining === 1 ? 'exercise' : 'exercises'}`}
            </Text>
          ) : null}
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Hide details' : 'View details'}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(current => !current)}
        style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
      >
        <Text variant="button" color="primary">
          {expanded ? 'Hide Details' : 'View Details'}
        </Text>
        {expanded ? (
          <ChevronUpIcon color={colors.primary} size={18} />
        ) : (
          <ChevronDownIcon color={colors.primary} size={18} />
        )}
      </Pressable>
    </Card>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  routine: {
    flexShrink: 1,
  },
  meta: {
    marginTop: spacing.xs,
  },
  divider: {
    marginVertical: spacing.md,
  },
  preview: {
    gap: spacing.xs,
  },
  previewName: {
    textTransform: 'capitalize',
  },
  previewMore: {
    marginTop: spacing.xxs,
  },
  exercises: {
    gap: spacing.lg,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
  },
  togglePressed: {
    backgroundColor: colors.surface,
  },
});
