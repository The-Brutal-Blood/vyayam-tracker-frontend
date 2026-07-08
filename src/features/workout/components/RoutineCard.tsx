import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DotsHorizontalIcon } from '@/components/icons/ActionIcons';
import { Button, Card, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

import type { Routine } from '../types/workout.types';

export interface RoutineCardProps {
  routine: Routine;
  onStart: (routine: Routine) => void;
  /** Opens the routine's options (edit, duplicate, delete — wired later). */
  onOpenMenu: (routine: Routine) => void;
}

/** One saved routine: name, exercise summary, and a start action. */
export const RoutineCard = React.memo(function RoutineCardBase({
  routine,
  onStart,
  onOpenMenu,
}: RoutineCardProps) {
  return (
    <Card padding="lg">
      <View style={styles.header}>
        <Text variant="title" style={styles.name} numberOfLines={1}>
          {routine.name}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Options for ${routine.name}`}
          onPress={() => onOpenMenu(routine)}
          hitSlop={spacing.md}
        >
          <DotsHorizontalIcon color={colors.textSecondary} />
        </Pressable>
      </View>
      <Text variant="bodySmall" color="textSecondary" numberOfLines={2} style={styles.summary}>
        {routine.exercises.join(', ')}
      </Text>
      <Button
        label="Start Routine"
        variant="primary"
        size="md"
        fullWidth
        onPress={() => onStart(routine)}
        accessibilityLabel={`Start ${routine.name} routine`}
        accessibilityHint="Begins a workout session from this routine"
        style={styles.startButton}
      />
    </Card>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flexShrink: 1,
  },
  summary: {
    marginTop: spacing.xs,
  },
  startButton: {
    marginTop: spacing.lg,
  },
});
