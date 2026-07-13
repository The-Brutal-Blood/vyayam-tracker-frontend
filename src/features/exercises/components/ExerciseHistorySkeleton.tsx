import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Shimmer } from '@/features/dashboard/components/Shimmer';
import { spacing } from '@/theme';

/** Loading placeholder mirroring the History tab layout: last performance,
 *  chart, stats grid, and a couple of workout cards. */
export const ExerciseHistorySkeleton = React.memo(function ExerciseHistorySkeletonBase() {
  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading exercise history"
    >
      <Shimmer height={148} radius="lg" />

      <Shimmer width="45%" height={14} radius="sm" style={styles.sectionLabel} />
      <Shimmer height={210} radius="lg" style={styles.gap} />

      <Shimmer width="35%" height={14} radius="sm" style={styles.sectionLabel} />
      <View style={[styles.grid, styles.gap]}>
        <Shimmer height={72} radius="lg" style={styles.tile} />
        <Shimmer height={72} radius="lg" style={styles.tile} />
        <Shimmer height={72} radius="lg" style={styles.tile} />
        <Shimmer height={72} radius="lg" style={styles.tile} />
      </View>

      <Shimmer width="45%" height={14} radius="sm" style={styles.sectionLabel} />
      <Shimmer height={132} radius="lg" style={styles.gap} />
      <Shimmer height={132} radius="lg" style={styles.gap} />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    marginTop: spacing['2xl'],
  },
  gap: {
    marginTop: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '47%',
  },
});
