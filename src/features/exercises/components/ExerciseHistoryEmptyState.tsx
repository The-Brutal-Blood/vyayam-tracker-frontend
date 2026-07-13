import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

/**
 * Shown when the exercise has never been performed. A premium, centered state
 * matching the History and Weight Tracker empty screens.
 */
export const ExerciseHistoryEmptyState = React.memo(function ExerciseHistoryEmptyStateBase() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏋️</Text>
      <Text variant="headingM" align="center" style={styles.title}>
        No workout history yet
      </Text>
      <Text variant="body" color="textSecondary" align="center" style={styles.subtitle}>
        Complete this exercise during a workout to start tracking your progress.
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['5xl'],
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    marginTop: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
});
