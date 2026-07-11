import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export interface RestTimerBarProps {
  /** Seconds left in the current rest (>= 0). */
  remaining: number;
  /** Seconds the countdown started from — drives the progress bar. */
  total: number;
  /** Adds the given seconds to the rest (e.g. +15 / -15). */
  onAdjust: (deltaSeconds: number) => void;
  /** Ends the rest early. */
  onSkip: () => void;
}

const STEP_SECONDS = 15;

/** Seconds → "MM:SS" for the rest countdown readout. */
function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Between-sets rest countdown pinned to the bottom of the workout session.
 * Shown after a set is completed; lets the user nudge the timer or skip it.
 */
export const RestTimerBar = React.memo(function RestTimerBarBase({
  remaining,
  total,
  onAdjust,
  onSkip,
}: RestTimerBarProps) {
  const progress = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reduce rest by 15 seconds"
          onPress={() => onAdjust(-STEP_SECONDS)}
          style={({ pressed }) => [styles.stepButton, pressed && styles.stepButtonPressed]}
        >
          <Text variant="button" color="textPrimary">
            -15
          </Text>
        </Pressable>

        <Text variant="headingL" color="textPrimary" style={styles.time}>
          {formatCountdown(remaining)}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add 15 seconds to rest"
          onPress={() => onAdjust(STEP_SECONDS)}
          style={({ pressed }) => [styles.stepButton, pressed && styles.stepButtonPressed]}
        >
          <Text variant="button" color="textPrimary">
            +15
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip rest"
          onPress={onSkip}
          style={({ pressed }) => [styles.skipButton, pressed && styles.skipButtonPressed]}
        >
          <Text variant="button" color="textOnPrimary">
            Skip
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  track: {
    height: 3,
    backgroundColor: colors.divider,
  },
  fill: {
    height: 3,
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  stepButton: {
    minWidth: 56,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
  },
  stepButtonPressed: {
    backgroundColor: colors.surface,
  },
  time: {
    flex: 1,
    textAlign: 'center',
  },
  skipButton: {
    minWidth: 72,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  skipButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
});
