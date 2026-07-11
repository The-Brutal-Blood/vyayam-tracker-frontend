import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

const BADGE_SIZE = 64;

/** Shown in place of the workout card on a rest day — a calm, encouraging note. */
export const RestDayCard = React.memo(function RestDayCardBase() {
  return (
    <Card accessible accessibilityLabel="Today is your rest day. Recovery is part of progress.">
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.emoji}>🌙</Text>
        </View>
        <Text variant="title" align="center" style={styles.title}>
          Today is your Rest Day
        </Text>
        <Text variant="bodySmall" color="textSecondary" align="center">
          Recovery is part of progress.
        </Text>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 30,
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
});
