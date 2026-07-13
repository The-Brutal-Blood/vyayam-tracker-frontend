import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Divider, Text } from '@/components/ui';
import { spacing } from '@/theme';

import type { BodyWeightEntry } from '../types/bodyWeight.types';
import { formatEntryDate, formatKg } from '../utils/weightFormat';

export interface WeightHistoryListProps {
  /** Entries in display order (newest first). */
  entries: BodyWeightEntry[];
}

/** The full weight history as date → weight rows inside a single card. */
export const WeightHistoryList = React.memo(function WeightHistoryListBase({
  entries,
}: WeightHistoryListProps) {
  return (
    <Card padding="none" style={styles.card}>
      {entries.map((entry, index) => (
        <View key={`${entry.date}-${index}`}>
          {index > 0 ? <Divider /> : null}
          <View style={styles.row}>
            <Text variant="body" color="textSecondary">
              {formatEntryDate(entry.date)}
            </Text>
            <Text variant="subtitle">{formatKg(entry.weight)}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
});
