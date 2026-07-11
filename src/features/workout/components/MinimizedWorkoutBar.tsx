import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ChevronUpIcon, TrashIcon } from '@/components/icons/ActionIcons';
import { Text } from '@/components/ui';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import { clearWorkoutSession } from '@/storage/workoutSession.storage';
import { colors, radius, shadows, spacing } from '@/theme';

import { formatCompactDuration, useElapsedSeconds } from './WorkoutTimer';
import { useWorkoutSessionContext } from '../context/WorkoutSessionContext';
import { useDiscardWorkoutSession } from '../hooks/useWorkoutSession';

const CIRCLE_SIZE = 44;
const DOT_SIZE = 8;

/**
 * Persistent bar shown above the tab bar while a workout is in progress. Tap to
 * reopen the session; the trash button discards it after confirmation.
 */
export const MinimizedWorkoutBar = React.memo(function MinimizedWorkoutBarBase() {
  const { active, endSession } = useWorkoutSessionContext();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const discardMutation = useDiscardWorkoutSession();
  const elapsed = useElapsedSeconds(active?.startedAt ?? '');

  if (!active) {
    return null;
  }

  const handleOpen = () => navigation.navigate('WorkoutSession');

  const handleDiscard = () => {
    Alert.alert('Are you sure you want to discard the workout in progress?', undefined, [
      {
        text: 'Discard Workout',
        style: 'destructive',
        onPress: () =>
          discardMutation.mutate(active.sessionId, {
            onSuccess: () => {
              clearWorkoutSession();
              endSession();
            },
            onError: error => Alert.alert('Could not discard workout', error.message),
          }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Resume workout in progress, ${formatCompactDuration(elapsed)}`}
        accessibilityHint="Reopens the active workout"
        onPress={handleOpen}
        style={({ pressed }) => [styles.bar, pressed && styles.barPressed]}
      >
        <View style={styles.circle}>
          <ChevronUpIcon color={colors.textPrimary} size={22} />
        </View>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <View style={styles.dot} />
            <Text variant="subtitle" numberOfLines={1}>
              Workout
            </Text>
            <Text variant="subtitle" color="textSecondary">
              {formatCompactDuration(elapsed)}
            </Text>
          </View>
          {active.firstExerciseName ? (
            <Text
              variant="bodySmall"
              color="textSecondary"
              numberOfLines={1}
              style={styles.subtitle}
            >
              {active.firstExerciseName}
            </Text>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Discard workout"
          accessibilityHint="Deletes the workout in progress"
          onPress={handleDiscard}
          hitSlop={spacing.sm}
          style={({ pressed }) => [styles.circle, styles.trash, pressed && styles.trashPressed]}
        >
          <TrashIcon color={colors.error} size={22} />
        </Pressable>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.md,
  },
  barPressed: {
    backgroundColor: colors.surface,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.success,
  },
  subtitle: {
    marginTop: spacing.xxs,
  },
  trash: {
    backgroundColor: colors.surface,
  },
  trashPressed: {
    backgroundColor: colors.background,
  },
});
