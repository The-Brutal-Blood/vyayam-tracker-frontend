import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

import type { HomePersonalRecord } from '../types/home.types';
import { formatWeight } from '../utils/homeFormat';

export interface PersonalRecordCardProps {
  record: HomePersonalRecord;
}

const BADGE_SIZE = 52;

/** Latest personal best: a trophy badge, the exercise, and the weight lifted. */
export const PersonalRecordCard = React.memo(function PersonalRecordCardBase({
  record,
}: PersonalRecordCardProps) {
  return (
    <Card
      accessible
      accessibilityLabel={`Latest personal record: ${record.exerciseName}, ${formatWeight(
        record.weight,
      )}`}
    >
      <View style={styles.row}>
        <View style={styles.badge}>
          <Text style={styles.emoji}>🏆</Text>
        </View>
        <View style={styles.text}>
          <Text variant="subtitle" numberOfLines={2} style={styles.exercise}>
            {record.exerciseName}
          </Text>
          <Text variant="headingM" color="primary" style={styles.weight}>
            {formatWeight(record.weight)}
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
  exercise: {
    textTransform: 'capitalize',
  },
  weight: {
    marginTop: spacing.xxs,
  },
});
