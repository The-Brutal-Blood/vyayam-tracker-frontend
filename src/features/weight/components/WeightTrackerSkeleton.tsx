import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Shimmer } from '@/features/dashboard/components/Shimmer';
import { spacing } from '@/theme';

/** Loading placeholder mirroring the Weight Tracker layout. */
export const WeightTrackerSkeleton = React.memo(function WeightTrackerSkeletonBase() {
  return (
    <View
      style={styles.root}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading weight tracker"
    >
      <Shimmer height={96} radius="lg" />
      <Shimmer height={168} radius="lg" style={styles.gap} />
      <View style={[styles.grid, styles.gap]}>
        <Shimmer height={72} radius="lg" style={styles.tile} />
        <Shimmer height={72} radius="lg" style={styles.tile} />
        <Shimmer height={72} radius="lg" style={styles.tile} />
        <Shimmer height={72} radius="lg" style={styles.tile} />
      </View>
      <Shimmer height={88} radius="lg" style={styles.gap} />
      <Shimmer height={160} radius="lg" style={styles.gap} />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  gap: {
    marginTop: spacing.lg,
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
