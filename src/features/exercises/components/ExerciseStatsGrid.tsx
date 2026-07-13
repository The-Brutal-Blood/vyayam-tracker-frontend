import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { spacing } from '@/theme';

import type { ExerciseHistoryStatistics } from '../types/exerciseHistory.types';
import {
  formatAverageReps,
  formatHistoryDate,
  formatVolume,
  formatWeight,
} from '../utils/exerciseHistoryFormat';

export interface ExerciseStatsGridProps {
  statistics: ExerciseHistoryStatistics;
}

interface StatTileProps {
  label: string;
  value: string;
}

const StatTile = React.memo(function StatTileBase({ label, value }: StatTileProps) {
  return (
    <Card padding="md" style={styles.tile}>
      <Text variant="label" color="textSecondary" numberOfLines={1}>
        {label}
      </Text>
      <Text variant="title" numberOfLines={1} adjustsFontSizeToFit style={styles.value}>
        {value}
      </Text>
    </Card>
  );
});

/**
 * Eight aggregate tiles in a two-column grid, in the fixed order: performed,
 * total sets, average weight, best volume, average reps, total volume, first
 * performed, last performed.
 */
export const ExerciseStatsGrid = React.memo(function ExerciseStatsGridBase({
  statistics,
}: ExerciseStatsGridProps) {
  return (
    <View style={styles.grid}>
      <StatTile label="Performed" value={String(statistics.timesPerformed)} />
      <StatTile label="Total Sets" value={String(statistics.totalSets)} />
      <StatTile label="Average Weight" value={formatWeight(statistics.averageWeight)} />
      <StatTile label="Best Volume" value={formatVolume(statistics.bestVolume)} />
      <StatTile label="Average Reps" value={formatAverageReps(statistics.averageReps)} />
      <StatTile label="Total Volume" value={formatVolume(statistics.totalVolume)} />
      <StatTile label="First Performed" value={formatHistoryDate(statistics.firstPerformedAt)} />
      <StatTile label="Last Performed" value={formatHistoryDate(statistics.lastPerformedAt)} />
    </View>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '47%',
    gap: spacing.xs,
  },
  value: {
    marginTop: spacing.xxs,
  },
});
