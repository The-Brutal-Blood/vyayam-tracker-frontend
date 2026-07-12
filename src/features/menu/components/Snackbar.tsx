import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, shadows, spacing } from '@/theme';

interface SnackbarState {
  message: string | null;
  /** Bumped on every `show` so repeat/identical messages re-trigger. */
  token: number;
}

export interface UseSnackbar {
  message: string | null;
  token: number;
  show: (message: string) => void;
  hide: () => void;
}

/** Minimal transient-message controller for a single Snackbar. */
export function useSnackbar(): UseSnackbar {
  const [state, setState] = useState<SnackbarState>({ message: null, token: 0 });
  const show = useCallback(
    (message: string) => setState(current => ({ message, token: current.token + 1 })),
    [],
  );
  const hide = useCallback(() => setState(current => ({ message: null, token: current.token })), []);
  return { message: state.message, token: state.token, show, hide };
}

export interface SnackbarProps {
  message: string | null;
  /** Changes on every trigger; drives the show animation + auto-hide. */
  token: number;
  onHide: () => void;
  durationMs?: number;
}

/** A brief, auto-dismissing toast pinned near the bottom of the screen. */
export const Snackbar = React.memo(function SnackbarBase({
  message,
  token,
  onHide,
  durationMs = 2600,
}: SnackbarProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!message || token === 0) {
      return undefined;
    }
    setShown(message);

    const settleIn = () => {
      opacity.setValue(1);
      translateY.setValue(0);
    };
    const dismiss = () => {
      setShown(null);
      onHide();
    };

    if (reduceMotion) {
      settleIn();
      const timer = setTimeout(dismiss, durationMs);
      return () => clearTimeout(timer);
    }

    opacity.setValue(0);
    translateY.setValue(16);
    const inAnim = Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    inAnim.start();

    let outAnim: Animated.CompositeAnimation | undefined;
    const timer = setTimeout(() => {
      outAnim = Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true });
      outAnim.start(({ finished }) => {
        if (finished) {
          dismiss();
        }
      });
    }, durationMs);

    return () => {
      clearTimeout(timer);
      inAnim.stop();
      outAnim?.stop();
    };
    // Re-runs per trigger; `token` changes on every show.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!shown) {
    return null;
  }

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Animated.View style={[styles.snackbar, { opacity, transform: [{ translateY }] }]}>
        <Text variant="bodySmall" color="textPrimary" numberOfLines={2}>
          {shown}
        </Text>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.xl,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  snackbar: {
    maxWidth: 480,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.lg,
  },
});
