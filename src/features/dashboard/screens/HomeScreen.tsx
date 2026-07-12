import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button, Screen, Text } from '@/components/ui';
import { HomeAppBar } from '@/features/menu/components/HomeAppBar';
import { useWorkoutSessionContext } from '@/features/workout/context/WorkoutSessionContext';
import { useStartWorkoutSession } from '@/features/workout/hooks/useWorkoutSession';
import { toSessionState } from '@/features/workout/utils/workoutSession';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import { colors, radius, spacing } from '@/theme';


import { CreateFirstRoutineCard } from '../components/CreateFirstRoutineCard';
import { GreetingHeader } from '../components/GreetingHeader';
import { HomeSkeleton } from '../components/HomeSkeleton';
import { PersonalRecordCard } from '../components/PersonalRecordCard';
import { RecentWorkoutCard } from '../components/RecentWorkoutCard';
import { RestDayCard } from '../components/RestDayCard';
import { StatsRow } from '../components/StatsRow';
import { StreakCard } from '../components/StreakCard';
import { TodayWorkoutCard } from '../components/TodayWorkoutCard';
import { WeeklyGoalCard } from '../components/WeeklyGoalCard';
import { useHome } from '../hooks/useHome';

const CONTENT_SLIDE_DISTANCE = 24;

export const HomeScreen = React.memo(function HomeScreenBase() {
  const { data, isPending, isError, error, refetch, isRefetching } = useHome();

  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { startSession } = useWorkoutSessionContext();
  const startMutation = useStartWorkoutSession();
  const [starting, setStarting] = useState(false);

  // Reuse the existing workout flow: create a session, then open the live
  // session screen (same path as the Workout tab's "Start Routine").
  const handleStartWorkout = useCallback(
    (routineId: string) => {
      if (startMutation.isPending) {
        return;
      }
      setStarting(true);
      startMutation.mutate(routineId, {
        onSuccess: session => {
          setStarting(false);
          const state = toSessionState(session);
          startSession(state);
          navigation.navigate('WorkoutSession', { initialState: state });
        },
        onError: err => {
          setStarting(false);
          Alert.alert('Could not start workout', err.message, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: () => handleStartWorkout(routineId) },
          ]);
        },
      });
    },
    [startMutation, startSession, navigation],
  );

  const handleCreateRoutine = useCallback(() => navigation.navigate('CreateRoutine'), [navigation]);

  const handleOpenRecentWorkout = useCallback(() => {
    // TODO: navigate to Workout Details once that screen exists.
  }, []);

  // Entrance: content fades in while sliding up (matches the Workout tab).
  const reduceMotion = useReducedMotion();
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(CONTENT_SLIDE_DISTANCE)).current;

  useEffect(() => {
    if (reduceMotion === null || !data) {
      return undefined;
    }
    if (reduceMotion) {
      contentOpacity.setValue(1);
      contentTranslateY.setValue(0);
      return undefined;
    }
    const easeOut = Easing.out(Easing.cubic);
    const entrance = Animated.parallel([
      Animated.timing(contentOpacity, {
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
  }, [reduceMotion, data, contentOpacity, contentTranslateY]);

  if (isPending) {
    return (
      <Screen scrollable edges={['top']} contentContainerStyle={styles.scrollContent}>
        <HomeAppBar />
        <HomeSkeleton />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen edges={['top']}>
        <HomeAppBar />
        <View style={styles.errorState}>
          <View style={styles.errorBox} accessibilityRole="alert" accessibilityLiveRegion="polite">
            <Text variant="bodySmall" color="error" align="center">
              {error.message}
            </Text>
          </View>
          <Button
            label="Try Again"
            variant="outline"
            size="md"
            onPress={() => refetch()}
            accessibilityLabel="Try Again"
            accessibilityHint="Reloads your home screen"
            style={styles.retryButton}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      scrollable
      edges={['top']}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.card}
        />
      }
    >
      <HomeAppBar />
      <Animated.View
        style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}
      >
        <GreetingHeader greeting={data.greeting} userName={data.userName} />

        {data.streak > 0 ? (
          <View style={styles.section}>
            <StreakCard streak={data.streak} />
          </View>
        ) : null}

        <View style={styles.section}>
          {data.isRestDay ? (
            <RestDayCard />
          ) : data.todayWorkout ? (
            <>
              <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
                {"Today's Workout"}
              </Text>
              <TodayWorkoutCard
                workout={data.todayWorkout}
                onStart={handleStartWorkout}
                starting={starting}
              />
            </>
          ) : (
            <CreateFirstRoutineCard onCreateRoutine={handleCreateRoutine} />
          )}
        </View>

        {data.weeklyGoal && data.weeklyGoal.target > 0 ? (
          <View style={styles.section}>
            <WeeklyGoalCard goal={data.weeklyGoal} />
          </View>
        ) : null}

        {data.recentWorkout ? (
          <View style={styles.section}>
            <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
              Recent Workout
            </Text>
            <RecentWorkoutCard workout={data.recentWorkout} onPress={handleOpenRecentWorkout} />
          </View>
        ) : null}

        {data.latestPersonalRecord ? (
          <View style={styles.section}>
            <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
              Latest Personal Record
            </Text>
            <PersonalRecordCard record={data.latestPersonalRecord} />
          </View>
        ) : null}

        {data.stats ? (
          <View style={styles.section}>
            <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
              Statistics
            </Text>
            <StatsRow stats={data.stats} />
          </View>
        ) : null}
      </Animated.View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    // Clearance for the bottom tab bar (and the in-progress workout bar).
    paddingBottom: spacing['7xl'],
  },
  section: {
    marginTop: spacing['2xl'],
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  errorBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  retryButton: {
    alignSelf: 'center',
  },
});
