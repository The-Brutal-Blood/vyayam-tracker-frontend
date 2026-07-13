import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

import { formatSetValue } from '../utils/exerciseHistoryFormat';

export interface ExerciseSetRowProps {
  setNumber: number;
  weight: number;
  reps: number;
}

/**
 * One completed set, read-only. Echoes the live workout row — a set label on
 * the left and the load × reps in an elevated pill on the right — but is never
 * editable.
 */
export const ExerciseSetRow = React.memo(function ExerciseSetRowBase({
  setNumber,
  weight,
  reps,
}: ExerciseSetRowProps) {
  return (
    <View style={styles.row}>
      <Text variant="subtitle" color="textSecondary">
        {`Set ${setNumber}`}
      </Text>
      <View style={styles.valuePill}>
        <Text variant="subtitle" color="textPrimary">
          {formatSetValue(weight, reps)}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  valuePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
  },
});
