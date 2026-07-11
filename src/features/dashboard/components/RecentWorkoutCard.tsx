import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { TimerIcon, TrendingUpCircleIcon } from '@/components/icons/ActionIcons';
import { Card, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

import type { HomeRecentWorkout } from '../types/home.types';
import { formatMinutes, formatRelativeDay, formatVolume } from '../utils/homeFormat';

export interface RecentWorkoutCardProps {
  workout: HomeRecentWorkout;
  /** Opens the workout details (wired later). */
  onPress: () => void;
}

const META_ICON_SIZE = 16;

/** Last completed workout — the whole card is tappable and will open details. */
export const RecentWorkoutCard = React.memo(function RecentWorkoutCardBase({
  workout,
  onPress,
}: RecentWorkoutCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${workout.routineName}, ${formatRelativeDay(workout.completedAt)}`}
      accessibilityHint="Opens workout details"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card>
        <View style={styles.header}>
          <Text variant="title" numberOfLines={1} style={styles.name}>
            {workout.routineName}
          </Text>
          <Text variant="caption" color="textSecondary">
            {formatRelativeDay(workout.completedAt)}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <TimerIcon color={colors.textSecondary} size={META_ICON_SIZE} />
            <Text variant="bodySmall" color="textSecondary">
              {formatMinutes(workout.durationMinutes)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <TrendingUpCircleIcon color={colors.textSecondary} size={META_ICON_SIZE} />
            <Text variant="bodySmall" color="textSecondary">
              {formatVolume(workout.volume)}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flexShrink: 1,
  },
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
});
