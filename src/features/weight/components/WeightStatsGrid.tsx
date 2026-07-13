import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { spacing } from '@/theme';

import type { BodyWeightSummary } from '../types/bodyWeight.types';
import { formatKg } from '../utils/weightFormat';

export interface WeightStatsGridProps {
  summary: Pick<
    BodyWeightSummary,
    'startingWeight' | 'lowestWeight' | 'highestWeight' | 'totalEntries'
  >;
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

/** Four summary tiles: starting, lowest, highest weight, and total entries. */
export const WeightStatsGrid = React.memo(function WeightStatsGridBase({
  summary,
}: WeightStatsGridProps) {
  return (
    <View style={styles.grid}>
      <StatTile label="Starting" value={formatKg(summary.startingWeight)} />
      <StatTile label="Lowest" value={formatKg(summary.lowestWeight)} />
      <StatTile label="Highest" value={formatKg(summary.highestWeight)} />
      <StatTile label="Total Entries" value={String(summary.totalEntries)} />
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
