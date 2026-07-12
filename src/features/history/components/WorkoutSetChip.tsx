import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

import { formatSetValue } from '../utils/historyFormat';

export interface WorkoutSetChipProps {
  weight: number;
  reps: number;
}

/** A single completed set as a rounded chip, e.g. "45 × 10" or "10 Reps". */
export const WorkoutSetChip = React.memo(function WorkoutSetChipBase({
  weight,
  reps,
}: WorkoutSetChipProps) {
  return (
    <View style={styles.chip}>
      <Text variant="caption" color="textSecondary">
        {formatSetValue(weight, reps)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
