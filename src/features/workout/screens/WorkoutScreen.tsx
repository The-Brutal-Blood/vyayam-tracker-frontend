import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, StyleSheet, View } from 'react-native';

import { ClipboardIcon, PlusIcon } from '@/components/icons/ActionIcons';
import { Button, Loader, Screen, Text } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing } from '@/theme';

import { RoutineCard } from '../components/RoutineCard';
import { RoutineMenuSheet } from '../components/RoutineMenuSheet';
import { useDeleteRoutine, useRoutinesOverview } from '../hooks/useRoutines';
import { useStartWorkoutSession } from '../hooks/useWorkoutSession';
import type { RoutineOverview, WorkoutSessionState } from '../types/workout.types';
import { toSessionState } from '../utils/workoutSession';

const CONTENT_SLIDE_DISTANCE = 24;
const EMPTY_STATE_ICON_SIZE = 28;
/** Rough duration of the menu's slide-out, before opening the editor. */
const MENU_DISMISS_MS = 300;

export interface WorkoutScreenProps {
  /** Opens the Create Routine flow. Navigation is owned by the caller. */
  onNewRoutine?: () => void;
  /** Opens the editor to modify the given routine. Navigation is owned by the caller. */
  onEditRoutine?: (routineId: string) => void;
  /** Opens the editor pre-filled as a copy of the given routine. */
  onDuplicateRoutine?: (routineId: string) => void;
  /** Opens the live session for a freshly-started routine. */
  onStartSession?: (state: WorkoutSessionState) => void;
}

export const WorkoutScreen = React.memo(function WorkoutScreenBase({
  onNewRoutine,
  onEditRoutine,
  onDuplicateRoutine,
  onStartSession,
}: WorkoutScreenProps) {
  const { data: routines, isPending, isError, error, refetch } = useRoutinesOverview();
  const routineCount = routines?.length ?? 0;

  const deleteRoutineMutation = useDeleteRoutine();
  const startMutation = useStartWorkoutSession();
  const [menuRoutine, setMenuRoutine] = useState<RoutineOverview | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);

  const handleStartEmptyWorkout = () => {};

  const handleStartRoutine = useCallback(
    (routine: RoutineOverview) => {
      if (startMutation.isPending) {
        return;
      }
      setStartingId(routine.routineId);
      startMutation.mutate(routine.routineId, {
        onSuccess: session => {
          setStartingId(null);
          onStartSession?.(toSessionState(session));
        },
        onError: err => {
          setStartingId(null);
          Alert.alert('Could not start workout', err.message, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: () => handleStartRoutine(routine) },
          ]);
        },
      });
    },
    [startMutation, onStartSession],
  );

  const handleOpenRoutineMenu = (routine: RoutineOverview) => setMenuRoutine(routine);

  const handleDeleteRoutine = (routine: RoutineOverview) => {
    Alert.alert('Delete routine?', `"${routine.name}" will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          deleteRoutineMutation.mutate(routine.routineId, {
            onError: err => Alert.alert('Could not delete routine', err.message),
          }),
      },
    ]);
  };

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
            {`My Routines (${routineCount})`}
          </Text>
          {isPending ? (
            <Loader style={styles.loader} />
          ) : isError ? (
            <View
              style={styles.errorBox}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              <Text variant="bodySmall" color="error" align="center">
                {error.message}
              </Text>
              <Button
                label="Try Again"
                variant="outline"
                size="md"
                onPress={() => refetch()}
                accessibilityLabel="Try Again"
                accessibilityHint="Reloads your routines"
                style={styles.retryButton}
              />
            </View>
          ) : routines && routines.length > 0 ? (
            <View style={styles.routineList}>
              {routines.map(routine => (
                <RoutineCard
                  key={routine.routineId}
                  routine={routine}
                  onStart={handleStartRoutine}
                  onPress={r => onEditRoutine?.(r.routineId)}
                  onOpenMenu={handleOpenRoutineMenu}
                  starting={startingId === routine.routineId}
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

      <RoutineMenuSheet
        visible={menuRoutine != null}
        routineName={menuRoutine?.name}
        // Editor opens as a modal; wait for this sheet to dismiss first so iOS
        // doesn't drop the second presentation.
        onDuplicate={() => {
          const id = menuRoutine?.routineId;
          if (id) {
            setTimeout(() => onDuplicateRoutine?.(id), MENU_DISMISS_MS);
          }
        }}
        onEdit={() => {
          const id = menuRoutine?.routineId;
          if (id) {
            setTimeout(() => onEditRoutine?.(id), MENU_DISMISS_MS);
          }
        }}
        onDelete={() => {
          if (menuRoutine) {
            handleDeleteRoutine(menuRoutine);
          }
        }}
        onClose={() => setMenuRoutine(null)}
      />
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
  loader: {
    paddingVertical: spacing['3xl'],
  },
  errorBox: {
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  retryButton: {
    alignSelf: 'center',
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
