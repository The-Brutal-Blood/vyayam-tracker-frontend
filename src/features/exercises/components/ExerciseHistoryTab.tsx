import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

import { ExerciseHistoryEmptyState } from './ExerciseHistoryEmptyState';
import { ExerciseHistorySkeleton } from './ExerciseHistorySkeleton';
import { ExerciseStatsGrid } from './ExerciseStatsGrid';
import { ExerciseWorkoutHistoryCard } from './ExerciseWorkoutHistoryCard';
import { LastPerformanceCard } from './LastPerformanceCard';
import { StrengthProgressChart, type StrengthProgressPoint } from './StrengthProgressChart';
import { useExerciseHistory } from '../hooks/useExerciseHistory';

export interface ExerciseHistoryTabProps {
  exerciseId: string;
}

/**
 * The Exercise Detail "History" tab — an analytics view sourced entirely from
 * GET /exercises/:id/history: last performance, strength progress, statistics,
 * and the full workout log (newest first). Handles its own loading, error and
 * empty states.
 */
export const ExerciseHistoryTab = React.memo(function ExerciseHistoryTabBase({
  exerciseId,
}: ExerciseHistoryTabProps) {
  const { data, isPending, isError, refetch } = useExerciseHistory(exerciseId);

  // Only points with a recorded max weight are plotted (nulls are dropped).
  const chartPoints = useMemo<StrengthProgressPoint[]>(
    () =>
      (data?.progress ?? [])
        .filter((point): point is { date: string; maxWeight: number } => point.maxWeight != null)
        .map(point => ({ date: point.date, maxWeight: point.maxWeight })),
    [data],
  );

  // Newest first, regardless of the order the API returns.
  const workouts = useMemo(
    () =>
      [...(data?.history ?? [])].sort((a, b) => b.performedAt.localeCompare(a.performedAt)),
    [data],
  );

  if (isPending) {
    return <ExerciseHistorySkeleton />;
  }

  if (isError) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.errorBox} accessibilityRole="alert" accessibilityLiveRegion="polite">
          <Text variant="bodySmall" color="error" align="center">
            Unable to load history.
          </Text>
        </View>
        <Button
          label="Retry"
          variant="outline"
          size="md"
          onPress={() => refetch()}
          accessibilityLabel="Retry"
          accessibilityHint="Reloads this exercise's history"
        />
      </View>
    );
  }

  if (data.history.length === 0) {
    return (
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.emptyContent}
        showsVerticalScrollIndicator={false}
      >
        <ExerciseHistoryEmptyState />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Last Performance */}
      {data.lastPerformance ? <LastPerformanceCard performance={data.lastPerformance} /> : null}

      {/* 2. Strength Progress */}
      <View style={data.lastPerformance ? styles.section : undefined}>
        <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
          Strength Progress
        </Text>
        <Card>
          {chartPoints.length > 0 ? (
            <StrengthProgressChart points={chartPoints} />
          ) : (
            <View style={styles.chartEmpty}>
              <Text style={styles.chartEmptyEmoji}>📈</Text>
              <Text variant="body" color="textSecondary" align="center">
                No strength data yet.
              </Text>
            </View>
          )}
        </Card>
      </View>

      {/* 3. Statistics */}
      <View style={styles.section}>
        <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
          Statistics
        </Text>
        <ExerciseStatsGrid statistics={data.statistics} />
      </View>

      {/* 4. Workout History */}
      <View style={styles.section}>
        <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
          Workout History
        </Text>
        <View style={styles.historyList}>
          {workouts.map(workout => (
            <ExerciseWorkoutHistoryCard key={workout.workoutSessionId} workout={workout} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['7xl'],
  },
  section: {
    marginTop: spacing['2xl'],
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  historyList: {
    gap: spacing.lg,
  },
  chartEmpty: {
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chartEmptyEmoji: {
    fontSize: 32,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: spacing['7xl'],
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  errorBox: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
