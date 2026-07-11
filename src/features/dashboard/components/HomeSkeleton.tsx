import React from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme';

import { Shimmer } from './Shimmer';

/** Loading placeholder mirroring the Home layout — greeting, streak, today's
 *  workout, weekly goal, recent workout, and the three stat tiles. */
export const HomeSkeleton = React.memo(function HomeSkeletonBase() {
  return (
    <View style={styles.root} accessibilityRole="progressbar" accessibilityLabel="Loading home">
      {/* Greeting */}
      <Shimmer width="70%" height={34} radius="sm" />
      <Shimmer width="55%" height={18} radius="sm" style={styles.tightTop} />

      {/* Streak card */}
      <Shimmer height={92} radius="lg" style={styles.section} />

      {/* Today's workout card */}
      <Shimmer width="40%" height={16} radius="sm" style={styles.section} />
      <Shimmer height={168} radius="lg" style={styles.tightTop} />

      {/* Weekly goal card */}
      <Shimmer width="40%" height={16} radius="sm" style={styles.section} />
      <Shimmer height={96} radius="lg" style={styles.tightTop} />

      {/* Recent workout card */}
      <Shimmer width="40%" height={16} radius="sm" style={styles.section} />
      <Shimmer height={104} radius="lg" style={styles.tightTop} />

      {/* Stats row */}
      <Shimmer width="40%" height={16} radius="sm" style={styles.section} />
      <View style={[styles.statsRow, styles.tightTop]}>
        <Shimmer height={96} radius="lg" style={styles.statCell} />
        <Shimmer height={96} radius="lg" style={styles.statCell} />
        <Shimmer height={96} radius="lg" style={styles.statCell} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tightTop: {
    marginTop: spacing.sm,
  },
  section: {
    marginTop: spacing['2xl'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCell: {
    flex: 1,
    borderRadius: radius.lg,
  },
});
