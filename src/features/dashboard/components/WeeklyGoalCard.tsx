import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing } from '@/theme';

import type { HomeWeeklyGoal } from '../types/home.types';

export interface WeeklyGoalCardProps {
  goal: HomeWeeklyGoal;
}

const BAR_HEIGHT = 10;

/** Weekly training goal with a modern rounded progress bar that fills on mount. */
export const WeeklyGoalCard = React.memo(function WeeklyGoalCardBase({ goal }: WeeklyGoalCardProps) {
  const ratio =
    goal.target > 0 ? Math.min(1, Math.max(0, goal.completed / goal.target)) : 0;
  const remaining = Math.max(0, goal.target - goal.completed);
  const reached = goal.completed >= goal.target && goal.target > 0;

  const reduceMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion === null) {
      return undefined;
    }
    if (reduceMotion) {
      progress.setValue(ratio);
      return undefined;
    }
    const anim = Animated.timing(progress, {
      toValue: ratio,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      // Animating width (a layout prop) can't use the native driver.
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [reduceMotion, ratio, progress]);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={styles.card}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Weekly goal: ${goal.completed} of ${goal.target} workouts completed`}
    >
      <View style={styles.header}>
        <Text variant="subtitle">Weekly Goal</Text>
        <Text variant="subtitle" color="primary">
          {`${goal.completed} / ${goal.target}`}
        </Text>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
      </View>

      <Text variant="caption" color="textSecondary" style={styles.caption}>
        {reached
          ? 'Goal reached — great work!'
          : `${remaining} ${remaining === 1 ? 'workout' : 'workouts'} to go`}
      </Text>
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
    justifyContent: 'space-between',
  },
  track: {
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  fill: {
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  caption: {
    marginTop: spacing.sm,
  },
});
