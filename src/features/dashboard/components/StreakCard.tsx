import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export interface StreakCardProps {
  streak: number;
}

const BADGE_SIZE = 52;

/** Current streak hero stat: a flame badge, a large count, and a subtitle. */
export const StreakCard = React.memo(function StreakCardBase({ streak }: StreakCardProps) {
  return (
    <Card
      accessible
      accessibilityLabel={`Current streak: ${streak} ${streak === 1 ? 'day' : 'days'}`}
    >
      <View style={styles.row}>
        <View style={styles.badge}>
          <Text style={styles.emoji}>🔥</Text>
        </View>
        <View style={styles.text}>
          <Text variant="displayL">{streak}</Text>
          <Text variant="label" color="textSecondary" style={styles.subtitle}>
            Day Streak
          </Text>
        </View>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
  },
  text: {
    flexShrink: 1,
  },
  subtitle: {
    marginTop: spacing.xxs,
  },
});
