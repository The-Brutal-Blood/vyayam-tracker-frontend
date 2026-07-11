import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TimerIcon, TrendingUpCircleIcon } from '@/components/icons/ActionIcons';
import { DumbbellIcon } from '@/components/icons/TabIcons';
import { Card, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

import type { HomeStats } from '../types/home.types';
import { formatHours, formatNumber, formatVolume } from '../utils/homeFormat';

export interface StatsRowProps {
  stats: HomeStats;
}

const ICON_SIZE = 20;

interface StatItem {
  key: string;
  icon: React.ReactNode;
  value: string;
  label: string;
}

/** Three equal-width quick-stat tiles. Values shrink to fit so long numbers
 *  (e.g. total volume) never overflow on small screens. */
export const StatsRow = React.memo(function StatsRowBase({ stats }: StatsRowProps) {
  const items: StatItem[] = [
    {
      key: 'workouts',
      icon: <DumbbellIcon color={colors.primary} size={ICON_SIZE} />,
      value: formatNumber(stats.totalWorkouts),
      label: 'Total Workouts',
    },
    {
      key: 'time',
      icon: <TimerIcon color={colors.primary} size={ICON_SIZE} />,
      value: formatHours(stats.totalDurationMinutes),
      label: 'Training Time',
    },
    {
      key: 'volume',
      icon: <TrendingUpCircleIcon color={colors.primary} size={ICON_SIZE} />,
      value: formatVolume(stats.totalVolume),
      label: 'Total Volume',
    },
  ];

  return (
    <View style={styles.row}>
      {items.map(item => (
        <Card key={item.key} padding="md" style={styles.cell}>
          {item.icon}
          <Text
            variant="title"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
            style={styles.value}
          >
            {item.value}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={2}>
            {item.label}
          </Text>
        </Card>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cell: {
    flex: 1,
    gap: spacing.xs,
  },
  value: {
    marginTop: spacing.xs,
  },
});
