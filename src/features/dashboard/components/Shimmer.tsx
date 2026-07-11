import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius as radiusScale, type RadiusToken } from '@/theme';

export interface ShimmerProps {
  width?: DimensionValue;
  height: DimensionValue;
  radius?: RadiusToken;
  style?: StyleProp<ViewStyle>;
}

/**
 * A single skeleton block that gently pulses. Used to compose loading
 * placeholders; falls back to a static block when Reduce Motion is on.
 */
export const Shimmer = React.memo(function ShimmerBase({
  width = '100%',
  height,
  radius = 'md',
  style,
}: ShimmerProps) {
  const reduceMotion = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion === null || reduceMotion) {
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.85] });

  return (
    <Animated.View
      accessible={false}
      style={[
        styles.block,
        { width, height, borderRadius: radiusScale[radius], opacity },
        style,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surfaceElevated,
  },
});
