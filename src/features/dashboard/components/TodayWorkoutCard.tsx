import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TimerIcon } from '@/components/icons/ActionIcons';
import { DumbbellIcon } from '@/components/icons/TabIcons';
import { Button, Card, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

import type { HomeTodayWorkout } from '../types/home.types';
import { formatExerciseCount, formatMinutes } from '../utils/homeFormat';

export interface TodayWorkoutCardProps {
  workout: HomeTodayWorkout;
  onStart: (routineId: string) => void;
  /** Shows a spinner on the Start button while the session is being created. */
  starting?: boolean;
}

const META_ICON_SIZE = 16;

/** The primary action of the Home tab: today's planned routine plus a large
 *  Start Workout button that enters the existing workout session flow. */
export const TodayWorkoutCard = React.memo(function TodayWorkoutCardBase({
  workout,
  onStart,
  starting = false,
}: TodayWorkoutCardProps) {
  return (
    <Card shadow="md">
      <Text variant="title" numberOfLines={1}>
        {workout.routineName}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <DumbbellIcon color={colors.textSecondary} size={META_ICON_SIZE} />
          <Text variant="bodySmall" color="textSecondary">
            {formatExerciseCount(workout.exerciseCount)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <TimerIcon color={colors.textSecondary} size={META_ICON_SIZE} />
          <Text variant="bodySmall" color="textSecondary">
            {formatMinutes(workout.estimatedDurationMinutes)}
          </Text>
        </View>
      </View>

      <Button
        label="Start Workout"
        variant="primary"
        size="lg"
        fullWidth
        loading={starting}
        onPress={() => onStart(workout.routineId)}
        accessibilityLabel={`Start ${workout.routineName} workout`}
        accessibilityHint="Begins a workout session from today's routine"
        style={styles.startButton}
      />
    </Card>
  );
});

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  startButton: {
    marginTop: spacing.xl,
  },
});
