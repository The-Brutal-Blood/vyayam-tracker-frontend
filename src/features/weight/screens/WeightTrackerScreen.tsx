import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { ChevronLeftIcon } from '@/components/icons/ActionIcons';
import { Button, Card, Screen, Text } from '@/components/ui';
import { homeKeys } from '@/features/dashboard/hooks/useHome';
import { colors, radius, spacing } from '@/theme';

import { CurrentWeightCard } from '../components/CurrentWeightCard';
import { LogWeightSheet } from '../components/LogWeightSheet';
import { TodayWeightCard } from '../components/TodayWeightCard';
import { WeightChart } from '../components/WeightChart';
import { WeightHistoryList } from '../components/WeightHistoryList';
import { WeightStatsGrid } from '../components/WeightStatsGrid';
import { WeightTrackerSkeleton } from '../components/WeightTrackerSkeleton';
import { useBodyWeight } from '../hooks/useBodyWeight';
import { bodyWeightKeys, useLogBodyWeight } from '../hooks/useLogBodyWeight';

export interface WeightTrackerScreenProps {
  /** Returns to the caller. Navigation is owned by the route wrapper. */
  onBack: () => void;
}

export const WeightTrackerScreen = React.memo(function WeightTrackerScreenBase({
  onBack,
}: WeightTrackerScreenProps) {
  const { data, isPending, isError, error, refetch, isRefetching } = useBodyWeight();
  const queryClient = useQueryClient();
  const logWeightMutation = useLogBodyWeight();
  const [sheetVisible, setSheetVisible] = useState(false);

  const openSheet = useCallback(() => setSheetVisible(true), []);
  const closeSheet = useCallback(() => setSheetVisible(false), []);

  const handleSave = useCallback(
    (weight: number) => {
      if (logWeightMutation.isPending) {
        return;
      }
      logWeightMutation.mutate(
        { weight },
        {
          onSuccess: () => {
            setSheetVisible(false);
            // Refresh this screen and Home (its shouldLogWeight flag).
            queryClient.invalidateQueries({ queryKey: bodyWeightKeys.all });
            queryClient.invalidateQueries({ queryKey: homeKeys.summary });
          },
          onError: err => Alert.alert('Could not save weight', err.message),
        },
      );
    },
    [logWeightMutation, queryClient],
  );

  // Oldest → newest for the chart; newest → oldest for the history list.
  const chartEntries = useMemo(
    () => (data ? [...data.entries].sort((a, b) => a.date.localeCompare(b.date)) : []),
    [data],
  );
  const historyEntries = useMemo(() => [...chartEntries].reverse(), [chartEntries]);

  const placeholderWeight = data
    ? data.today.alreadyLogged
      ? data.today.weight
      : data.currentWeight
    : null;

  const refreshControl = (
    <RefreshControl
      refreshing={isRefetching}
      onRefresh={refetch}
      tintColor={colors.primary}
      colors={[colors.primary]}
      progressBackgroundColor={colors.card}
    />
  );

  return (
    <Screen padded={false} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={spacing.sm}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <ChevronLeftIcon color={colors.textPrimary} size={24} />
          </Pressable>
          <Text variant="title" accessibilityRole="header">
            Weight Tracker
          </Text>
        </View>
        <Text variant="bodySmall" color="textSecondary" style={styles.subtitle}>
          Track your body weight over time.
        </Text>
      </View>

      {isPending ? (
        <WeightTrackerSkeleton />
      ) : isError ? (
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
            accessibilityHint="Reloads your weight tracker"
            style={styles.retryButton}
          />
        </View>
      ) : data && data.entries.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContent}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.emptyEmoji}>⚖️</Text>
          <Text variant="headingM" align="center">
            No weight logged yet
          </Text>
          <Text variant="body" color="textSecondary" align="center" style={styles.emptySubtitle}>
            Start tracking your body weight to see your progress here.
          </Text>
          <Button
            label="Log Weight"
            variant="primary"
            size="lg"
            onPress={openSheet}
            accessibilityLabel="Log today's weight"
          />
        </ScrollView>
      ) : data ? (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <CurrentWeightCard currentWeight={data.currentWeight} weightChange={data.weightChange} />

          <View style={styles.section}>
            <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
              Weight Progress
            </Text>
            <Card>
              <WeightChart entries={chartEntries} />
            </Card>
          </View>

          <View style={styles.section}>
            <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
              Statistics
            </Text>
            <WeightStatsGrid summary={data} />
          </View>

          <View style={styles.section}>
            <TodayWeightCard today={data.today} onOpenSheet={openSheet} />
          </View>

          <View style={styles.section}>
            <Text variant="label" color="textSecondary" style={styles.sectionLabel}>
              Weight History
            </Text>
            <WeightHistoryList entries={historyEntries} />
          </View>
        </ScrollView>
      ) : null}

      <LogWeightSheet
        visible={sheetVisible}
        onClose={closeSheet}
        onSave={handleSave}
        submitting={logWeightMutation.isPending}
        placeholderWeight={placeholderWeight}
      />
    </Screen>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: -spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: colors.surface,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing['7xl'],
  },
  section: {
    marginTop: spacing['2xl'],
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['7xl'],
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptySubtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
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
