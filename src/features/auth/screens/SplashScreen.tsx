import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

import { Loader, Logo, Screen, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

export interface SplashScreenProps {
  /**
   * Fired once the intro animation finishes (or, with Reduce Motion enabled,
   * after a short static hold). The Root Navigator will use this to decide
   * where to route next.
   */
  onAnimationComplete?: () => void;
}

const LOGO_SIZE = 300;
const GLOW_SIZE = 220;

/** Static hold before completing when the intro is skipped for Reduce Motion. */
const REDUCED_MOTION_HOLD_MS = 900;

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(14)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(10)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  // Keep the latest callback without retriggering the animation effect.
  const onCompleteRef = useRef(onAnimationComplete);
  onCompleteRef.current = onAnimationComplete;

  useEffect(() => {
    let cancelled = false;
    let holdTimeout: ReturnType<typeof setTimeout> | undefined;
    const running: Animated.CompositeAnimation[] = [];

    const skipToEnd = () => {
      screenOpacity.setValue(1);
      logoOpacity.setValue(1);
      logoScale.setValue(1);
      titleOpacity.setValue(1);
      titleTranslateY.setValue(0);
      taglineOpacity.setValue(1);
      taglineTranslateY.setValue(0);
      glowOpacity.setValue(0.14);
      loaderOpacity.setValue(1);
      holdTimeout = setTimeout(() => onCompleteRef.current?.(), REDUCED_MOTION_HOLD_MS);
    };

    const play = () => {
      const easeOut = Easing.out(Easing.cubic);

      // Endless soft pulse behind the logo; starts once the halo has faded in.
      const glowPulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(glowOpacity, {
              toValue: 0.18,
              duration: 1100,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowScale, {
              toValue: 1.06,
              duration: 1100,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(glowOpacity, {
              toValue: 0.1,
              duration: 1100,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(glowScale, {
              toValue: 1,
              duration: 1100,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

      const glowIntro = Animated.sequence([
        Animated.delay(300),
        Animated.timing(glowOpacity, {
          toValue: 0.14,
          duration: 600,
          easing: easeOut,
          useNativeDriver: true,
        }),
      ]);

      const glow = Animated.sequence([glowIntro, glowPulse]);

      const master = Animated.parallel([
        Animated.timing(screenOpacity, {
          toValue: 1,
          duration: 350,
          easing: easeOut,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(150),
          Animated.parallel([
            Animated.timing(logoOpacity, {
              toValue: 1,
              duration: 500,
              easing: easeOut,
              useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
              toValue: 1,
              duration: 500,
              easing: easeOut,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.sequence([
          Animated.delay(650),
          Animated.parallel([
            Animated.timing(titleOpacity, {
              toValue: 1,
              duration: 450,
              easing: easeOut,
              useNativeDriver: true,
            }),
            Animated.timing(titleTranslateY, {
              toValue: 0,
              duration: 450,
              easing: easeOut,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.sequence([
          Animated.delay(850),
          Animated.parallel([
            Animated.timing(taglineOpacity, {
              toValue: 1,
              duration: 450,
              easing: easeOut,
              useNativeDriver: true,
            }),
            Animated.timing(taglineTranslateY, {
              toValue: 0,
              duration: 450,
              easing: easeOut,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.sequence([
          Animated.delay(1400),
          Animated.timing(loaderOpacity, {
            toValue: 1,
            duration: 400,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
        // Brief hold after the last element lands, keeping total ~2000ms.
        Animated.delay(2000),
      ]);

      running.push(glow, master);
      glow.start();
      master.start(({ finished }) => {
        if (finished) {
          onCompleteRef.current?.();
        }
      });
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then(reduceMotion => {
        if (cancelled) {
          return;
        }
        if (reduceMotion) {
          skipToEnd();
        } else {
          play();
        }
      })
      .catch(() => {
        if (!cancelled) {
          play();
        }
      });

    return () => {
      cancelled = true;
      if (holdTimeout) {
        clearTimeout(holdTimeout);
      }
      running.forEach(animation => animation.stop());
    };
    // Animated.Values are stable refs; this intro must run exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen padded={false} keyboardAvoiding={false}>
      <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
        <View style={styles.center}>
          <View style={styles.logoArea}>
            <Animated.View
              style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
            />
            <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale },{ translateY: 8 },],  }}>
              <Logo width={LOGO_SIZE} height={LOGO_SIZE} />
            </Animated.View>
          </View>
          <Animated.View
            style={[
              styles.titleArea,
              { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
            ]}
          >
            <Text variant="displayL" align="center" accessibilityRole="header">
              Vyayam Tracker
            </Text>
          </Animated.View>
          <Animated.View
            style={{ opacity: taglineOpacity, transform: [{ translateY: taglineTranslateY }] }}
          >
            <Text variant="subtitle" color="textSecondary" align="center">
              Strength through Abhyasa
            </Text>
          </Animated.View>
        </View>
        <Animated.View style={[styles.footer, { opacity: loaderOpacity }]}>
          <Loader size="small" />
        </Animated.View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: -30,
  },
  glow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: colors.primary,
  },
  titleArea: {
    marginTop: -34,
    marginBottom: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing['5xl'],
  },
});
