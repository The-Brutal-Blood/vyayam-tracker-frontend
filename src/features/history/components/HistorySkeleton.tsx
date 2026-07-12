import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Shimmer } from '@/features/dashboard/components/Shimmer';
import { colors, radius, spacing } from '@/theme';

const CARD_COUNT = 4;

/** One placeholder card mirroring a collapsed workout card. */
function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Shimmer width="45%" height={20} radius="sm" />
        <Shimmer width={64} height={14} radius="sm" />
      </View>
      <Shimmer width="70%" height={14} radius="sm" style={styles.meta} />
      <View style={styles.divider} />
      <Shimmer width="55%" height={14} radius="sm" style={styles.line} />
      <Shimmer width="50%" height={14} radius="sm" style={styles.line} />
      <Shimmer width="40%" height={14} radius="sm" style={styles.line} />
    </View>
  );
}

/** Loading placeholder for the History list — a stack of shimmering cards. */
export const HistorySkeleton = React.memo(function HistorySkeletonBase() {
  return (
    <View
      style={styles.list}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading workout history"
    >
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    marginTop: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  line: {
    marginTop: spacing.sm,
  },
});
