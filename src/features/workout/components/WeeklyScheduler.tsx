import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CheckIcon } from '@/components/icons/ActionIcons';
import { Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

import type { Weekday } from '../types/workout.types';
import { WEEKDAYS } from '../utils/weekdays';

export interface WeeklySchedulerProps {
  /** Currently selected days. */
  value: Weekday[];
  /** Toggles a day's membership in the selection. */
  onToggle: (day: Weekday) => void;
  style?: StyleProp<ViewStyle>;
}

const INDICATOR_SIZE = 30;

/**
 * Weekly scheduler: seven toggleable day cells letting the user pick which days
 * a routine is planned for. Purely controlled — selection lives with the caller.
 */
export const WeeklyScheduler = React.memo(function WeeklySchedulerBase({
  value,
  onToggle,
  style,
}: WeeklySchedulerProps) {
  return (
    <View style={[styles.container, style]}>
      <Text variant="label" color="textSecondary" style={styles.heading}>
        Schedule
      </Text>
      <View style={styles.row}>
        {WEEKDAYS.map(day => {
          const selected = value.includes(day.key);
          return (
            <Pressable
              key={day.key}
              onPress={() => onToggle(day.key)}
              hitSlop={spacing.xs}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={day.fullName}
              accessibilityHint="Toggles this day in the routine schedule"
              style={styles.dayColumn}
            >
              <Text
                variant="caption"
                color={selected ? 'primary' : 'textSecondary'}
                style={styles.dayLabel}
              >
                {day.label}
              </Text>
              <View style={[styles.indicator, selected && styles.indicatorSelected]}>
                {selected ? <CheckIcon color={colors.textOnPrimary} size={16} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  heading: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  dayLabel: {
    textAlign: 'center',
  },
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
