import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { spacing } from '@/theme';

import type { BodyWeightToday } from '../types/bodyWeight.types';
import { formatKg } from '../utils/weightFormat';

export interface TodayWeightCardProps {
  today: BodyWeightToday;
  /** Opens the shared weight-input sheet (log or edit). */
  onOpenSheet: () => void;
}

/** Today's logging status: shows the value + Edit, or a prompt + Log Weight. */
export const TodayWeightCard = React.memo(function TodayWeightCardBase({
  today,
  onOpenSheet,
}: TodayWeightCardProps) {
  if (today.alreadyLogged) {
    return (
      <Card>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text variant="label" color="textSecondary">
              Today's Weight
            </Text>
            <Text variant="headingM" style={styles.value}>
              {formatKg(today.weight)}
            </Text>
            <Text variant="bodySmall" color="textSecondary" style={styles.hint}>
              Last updated today
            </Text>
          </View>
          <Button
            label="Edit"
            variant="secondary"
            size="md"
            onPress={onOpenSheet}
            accessibilityLabel="Edit today's weight"
          />
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Text variant="subtitle" style={styles.prompt}>
        {"You haven't logged today's weight."}
      </Text>
      <Button
        label="Log Weight"
        variant="primary"
        size="lg"
        fullWidth
        onPress={onOpenSheet}
        accessibilityLabel="Log today's weight"
      />
    </Card>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  info: {
    flexShrink: 1,
  },
  value: {
    marginTop: spacing.xxs,
  },
  hint: {
    marginTop: spacing.xxs,
  },
  prompt: {
    marginBottom: spacing.lg,
  },
});
