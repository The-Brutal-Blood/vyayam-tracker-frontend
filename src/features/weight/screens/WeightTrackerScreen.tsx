import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronLeftIcon } from '@/components/icons/ActionIcons';
import { Screen, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export interface WeightTrackerScreenProps {
  /** Returns to the caller. Navigation is owned by the route wrapper. */
  onBack: () => void;
}

/**
 * Placeholder for the upcoming Weight Tracker. Intentionally has no
 * functionality yet — implemented in a later task.
 */
export const WeightTrackerScreen = React.memo(function WeightTrackerScreenBase({
  onBack,
}: WeightTrackerScreenProps) {
  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          hitSlop={spacing.sm}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <ChevronLeftIcon color={colors.textPrimary} size={24} />
        </Pressable>
        <Text variant="title" accessibilityRole="header">
          Weight Tracker
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.emoji}>⚖️</Text>
        <Text variant="headingM" color="textSecondary" align="center">
          Coming Soon
        </Text>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: -spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: colors.surface,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emoji: {
    fontSize: 48,
  },
});
