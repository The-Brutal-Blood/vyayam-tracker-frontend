import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { ClipboardIcon, PlusIcon } from '@/components/icons/ActionIcons';
import { Button, Screen, Text } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing } from '@/theme';

import { RoutineCard } from '../components/RoutineCard';
import type { Routine } from '../types/workout.types';

const CONTENT_SLIDE_DISTANCE = 24;
const EMPTY_STATE_ICON_SIZE = 28;

export interface WorkoutScreenProps {
  /** Opens the Create Routine flow. Navigation is owned by the caller. */
  onNewRoutine?: () => void;
}

export const WorkoutScreen = React.memo(function WorkoutScreenBase({
  onNewRoutine,
}: WorkoutScreenProps) {
  // UI-first: replaced by the routines query hook once the API lands.
  const routines: Routine[] = [];

  // Session/routine flows arrive with the workout API; the UI contract is
  // final, these handlers are the integration points.
  const handleStartEmptyWorkout = () => {};
  const handleStartRoutine = (_routine: Routine) => {};
  const handleOpenRoutineMenu = (_routine: Routine) => {};

  // Entrance: screen fades in while the content slides up.
  const reduceMotion = useReducedMotion();
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(CONTENT_SLIDE_DISTANCE)).current;

  useEffect(() => {
    if (reduceMotion === null) {
      return undefined;
    }
    if (reduceMotion) {
      screenOpacity.setValue(1);
      contentTranslateY.setValue(0);
      return undefined;
    }
    const easeOut = Easing.out(Easing.cubic);
    const entrance = Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 450,
        easing: easeOut,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 500,
        easing: easeOut,
        useNativeDriver: true,
      }),
    ]);
    entrance.start();
    return () => entrance.stop();
  }, [reduceMotion, screenOpacity, contentTranslateY]);

  return (
    <Screen scrollable edges={['top']}>
      <Animated.View
        style={[
          styles.root,
          { opacity: screenOpacity, transform: [{ translateY: contentTranslateY }] },
        ]}
      >
        <Text variant="headingXL" accessibilityRole="header">
          Workout
        </Text>

        <View style={styles.section}>
          <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
            Quick Start
          </Text>
          <Button
            label="Start Empty Workout"
            variant="secondary"
            size="lg"
            fullWidth
            leftIcon={<PlusIcon color={colors.primary} />}
            onPress={handleStartEmptyWorkout}
            accessibilityLabel="Start Empty Workout"
            accessibilityHint="Begins a blank workout session"
          />
        </View>

        <View style={styles.section}>
          <Text variant="headingM" accessibilityRole="header" style={styles.sectionLabel}>
            Routines
          </Text>
          <Button
            label="New Routine"
            variant="secondary"
            size="lg"
            fullWidth
            leftIcon={<ClipboardIcon color={colors.primary} />}
            onPress={onNewRoutine}
            accessibilityLabel="New Routine"
            accessibilityHint="Creates a new workout routine"
          />
        </View>

        <View style={styles.section}>
          <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
            {`My Routines (${routines.length})`}
          </Text>
          {routines.length > 0 ? (
            <View style={styles.routineList}>
              {routines.map(routine => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onStart={handleStartRoutine}
                  onOpenMenu={handleOpenRoutineMenu}
                />
              ))}
            </View>
          ) : (
            <View
              style={styles.emptyState}
              accessible
              accessibilityLabel="No routines yet. Create a routine and it will show up here."
            >
              <ClipboardIcon color={colors.textSecondary} size={EMPTY_STATE_ICON_SIZE} />
              <Text variant="subtitle" color="textSecondary" align="center" style={styles.emptyTitle}>
                No routines yet
              </Text>
              <Text variant="bodySmall" color="textDisabled" align="center">
                Create a routine and it will show up here.
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: spacing.md,
  },
  section: {
    marginTop: spacing['3xl'],
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  routineList: {
    gap: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
});
