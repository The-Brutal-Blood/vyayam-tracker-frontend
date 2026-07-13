import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { InfoIcon } from '@/components/icons/ActionIcons';
import { Card, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

import type { BodyWeightSummary } from '../types/bodyWeight.types';
import { formatKg } from '../utils/weightFormat';

export interface WeightStatsGridProps {
  summary: Pick<
    BodyWeightSummary,
    'startingWeight' | 'lowestWeight' | 'highestWeight' | 'totalEntries' | 'averageWeight'
  >;
}

/** Title + body shown in the True Weight info callout. */
const AVERAGE_INFO_TITLE = 'How is True Weight Calculated?';
const AVERAGE_INFO_BODY =
  'True Weight is the average of your last 7 morning weigh-ins. Since your weight ' +
  'naturally fluctuates due to water, food, and other factors, a 7-day average provides ' +
  'a more accurate picture of your actual body weight and progress. For the most accurate ' +
  'results, record your weight every morning after using the bathroom and before eating or drinking.';

const INFO_ICON_SIZE = 16;

interface StatTileProps {
  label: string;
  value: string;
}

const StatTile = React.memo(function StatTileBase({ label, value }: StatTileProps) {
  return (
    <Card padding="md" style={styles.tile}>
      <Text variant="label" color="textSecondary" numberOfLines={1}>
        {label}
      </Text>
      <Text variant="title" numberOfLines={1} adjustsFontSizeToFit style={styles.value}>
        {value}
      </Text>
    </Card>
  );
});

/** Full-width average tile with a tappable info affordance and inline callout. */
const AverageTile = React.memo(function AverageTileBase({ value }: { value: string }) {
  const [infoOpen, setInfoOpen] = useState(false);
  return (
    <Card padding="md" style={styles.averageTile}>
      <View style={styles.averageHeader}>
        <Text variant="label" color="textSecondary" numberOfLines={1} style={styles.averageLabel}>
          True Weight
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: infoOpen }}
          accessibilityLabel="How is True Weight calculated?"
          accessibilityHint="Shows how True Weight is calculated"
          onPress={() => setInfoOpen(open => !open)}
          hitSlop={spacing.sm}
          style={({ pressed }) => [styles.infoButton, pressed && styles.infoButtonPressed]}
        >
          <InfoIcon color={infoOpen ? colors.primary : colors.textSecondary} size={INFO_ICON_SIZE} />
        </Pressable>
      </View>
      <Text variant="title" numberOfLines={1} adjustsFontSizeToFit style={styles.value}>
        {value}
      </Text>

      {infoOpen ? (
        <>
          {/* Invisible full-screen catcher: a tap anywhere dismisses the note. */}
          <Modal
            transparent
            visible
            animationType="none"
            onRequestClose={() => setInfoOpen(false)}
          >
            <Pressable
              style={styles.backdrop}
              onPress={() => setInfoOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Close info"
            />
          </Modal>
          <View style={styles.callout} accessibilityLiveRegion="polite">
            <Text variant="subtitle" color="textPrimary" style={styles.calloutTitle}>
              {AVERAGE_INFO_TITLE}
            </Text>
            <Text variant="bodySmall" color="textSecondary">
              {AVERAGE_INFO_BODY}
            </Text>
          </View>
        </>
      ) : null}
    </Card>
  );
});

/**
 * Summary tiles: starting, lowest, highest weight, total entries, and a
 * full-width 7-day average with an inline "why?" info callout.
 */
export const WeightStatsGrid = React.memo(function WeightStatsGridBase({
  summary,
}: WeightStatsGridProps) {
  return (
    <View style={styles.grid}>
      <StatTile label="Starting" value={formatKg(summary.startingWeight)} />
      <StatTile label="Lowest" value={formatKg(summary.lowestWeight)} />
      <StatTile label="Highest" value={formatKg(summary.highestWeight)} />
      <StatTile label="Total Entries" value={String(summary.totalEntries)} />
      <AverageTile value={formatKg(summary.averageWeight)} />
    </View>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '47%',
    gap: spacing.xs,
  },
  averageTile: {
    flexBasis: '100%',
    gap: spacing.xs,
  },
  averageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  averageLabel: {
    flexShrink: 1,
  },
  infoButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  infoButtonPressed: {
    backgroundColor: colors.surface,
  },
  value: {
    marginTop: spacing.xxs,
  },
  backdrop: {
    ...(StyleSheet.absoluteFill as object),
  },
  callout: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    gap: spacing.xs,
  },
  calloutTitle: {
    marginBottom: spacing.xxs,
  },
});
