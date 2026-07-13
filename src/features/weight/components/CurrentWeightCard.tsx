import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

import { formatKg, formatWeightChange } from '../utils/weightFormat';

export interface CurrentWeightCardProps {
  currentWeight: number | null;
  weightChange: number;
}

/** Hero card: the current weight plus the change since the user started. */
export const CurrentWeightCard = React.memo(function CurrentWeightCardBase({
  currentWeight,
  weightChange,
}: CurrentWeightCardProps) {
  const isDown = weightChange < 0;
  const isUp = weightChange > 0;
  const changeColor = isDown ? colors.success : colors.primary;

  return (
    <Card shadow="md">
      <Text variant="label" color="textSecondary">
        Current Weight
      </Text>
      <Text variant="displayL" style={styles.value}>
        {formatKg(currentWeight)}
      </Text>

      {isUp || isDown ? (
        <View style={styles.changeRow}>
          <Text variant="subtitle" style={{ color: changeColor }}>
            {`${isDown ? '▼' : '▲'} ${formatWeightChange(weightChange)}`}
          </Text>
          <Text variant="bodySmall" color="textSecondary">
            Since you started
          </Text>
        </View>
      ) : (
        <Text variant="bodySmall" color="textSecondary" style={styles.noChange}>
          No change yet
        </Text>
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  value: {
    marginTop: spacing.xs,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  noChange: {
    marginTop: spacing.sm,
  },
});
