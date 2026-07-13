import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DotsHorizontalIcon } from '@/components/icons/ActionIcons';
import { Button, Card, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

import type { RoutineOverview } from '../types/workout.types';
import { formatWeekdayLabels } from '../utils/weekdays';

export interface RoutineCardProps {
  routine: RoutineOverview;
  onStart: (routine: RoutineOverview) => void;
  /** Opens the routine editor. Tapping the card body triggers this. */
  onPress: (routine: RoutineOverview) => void;
  /** Opens the routine's options (duplicate, edit, delete). */
  onOpenMenu: (routine: RoutineOverview) => void;
  /** Shows a spinner on Start while its session is being created. */
  starting?: boolean;
}

/** One saved routine: tap the card to edit; Start begins a session. */
export const RoutineCard = React.memo(function RoutineCardBase({
  routine,
  onStart,
  onPress,
  onOpenMenu,
  starting = false,
}: RoutineCardProps) {
  const scheduleLabel = formatWeekdayLabels(routine.scheduledDays ?? []);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Edit ${routine.name} routine`}
      accessibilityHint="Opens the routine editor"
      onPress={() => onPress(routine)}
      style={({ pressed }) => pressed && styles.pressed}
    >
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
        {scheduleLabel ? (
          <View style={styles.scheduleBadge}>
            <Text variant="caption" color="textSecondary" numberOfLines={1}>
              {scheduleLabel}
            </Text>
          </View>
        ) : null}
        <Text variant="bodySmall" color="textSecondary" numberOfLines={2} style={styles.summary}>
          {routine.exercises.join(', ')}
        </Text>
        <Button
          label="Start Routine"
          variant="primary"
          size="md"
          fullWidth
          loading={starting}
          onPress={() => onStart(routine)}
          accessibilityLabel={`Start ${routine.name} routine`}
          accessibilityHint="Begins a workout session from this routine"
          style={styles.startButton}
        />
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flexShrink: 1,
  },
  scheduleBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  summary: {
    marginTop: spacing.sm,
  },
  startButton: {
    marginTop: spacing.lg,
  },
});
