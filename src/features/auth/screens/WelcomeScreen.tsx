import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

import { Button, Logo, Screen, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

export interface WelcomeScreenProps {
  /** Fired when the user taps "Create Account". Navigation is owned by the caller. */
  onCreateAccount?: () => void;
  /** Fired when the user taps "Sign In". Navigation is owned by the caller. */
  onSignIn?: () => void;
}

/** Slightly smaller than the splash logo (300) for a settled, post-intro feel. */
const LOGO_SIZE = 240;
const GLOW_SIZE = 176;

/**
 * The logo PNG carries internal transparent padding (see SplashScreen's -30/-34
 * compensation at 300pt). Scaled to 240pt, ~0.8x of those metrics keeps the
 * optical rhythm between logo and tagline identical to the splash.
 */
const LOGO_TRIM_TOP = -24;
const MOTIVATION_TRIM_TOP = -27;

const MOTIVATION_LINES = ['Train with purpose.', 'Track every rep.', 'Build consistency.'];

/** Delay before the first motivation line, and gap between consecutive lines. */
const MOTIVATION_START_MS = 300;
const MOTIVATION_STAGGER_MS = 350;

export const WelcomeScreen = React.memo(function WelcomeScreenBase({
  onCreateAccount,
  onSignIn,
}: WelcomeScreenProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const lineOpacities = useRef(MOTIVATION_LINES.map(() => new Animated.Value(0))).current;
  const lineTranslateYs = useRef(MOTIVATION_LINES.map(() => new Animated.Value(12))).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaTranslateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    let cancelled = false;
    let entrance: Animated.CompositeAnimation | undefined;

    const skipToEnd = () => {
      logoOpacity.setValue(1);
      logoScale.setValue(1);
      glowOpacity.setValue(0.12);
      lineOpacities.forEach(value => value.setValue(1));
      lineTranslateYs.forEach(value => value.setValue(0));
      ctaOpacity.setValue(1);
      ctaTranslateY.setValue(0);
    };

    const play = () => {
      const easeOut = Easing.out(Easing.cubic);
      const fadeIn = (value: Animated.Value, delay: number, duration = 400) =>
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, { toValue: 1, duration, easing: easeOut, useNativeDriver: true }),
        ]);

      // Staggered reveal, top to bottom; everything lands within ~1650ms.
      entrance = Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          easing: easeOut,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 450,
          easing: easeOut,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(glowOpacity, {
            toValue: 0.12,
            duration: 550,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
        ...MOTIVATION_LINES.flatMap((_, index) => {
          const delay = MOTIVATION_START_MS + index * MOTIVATION_STAGGER_MS;
          return [
            fadeIn(lineOpacities[index], delay),
            Animated.sequence([
              Animated.delay(delay),
              Animated.timing(lineTranslateYs[index], {
                toValue: 0,
                duration: 400,
                easing: easeOut,
                useNativeDriver: true,
              }),
            ]),
          ];
        }),
        fadeIn(ctaOpacity, 1200, 450),
        Animated.sequence([
          Animated.delay(1200),
          Animated.timing(ctaTranslateY, {
            toValue: 0,
            duration: 450,
            easing: easeOut,
            useNativeDriver: true,
          }),
        ]),
      ]);
      entrance.start();
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
      entrance?.stop();
    };
    // Animated.Values are stable refs; this entrance must run exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen padded={false} keyboardAvoiding={false}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <View style={styles.logoArea}>
            <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
            <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
              <Logo width={LOGO_SIZE} height={LOGO_SIZE} />
            </Animated.View>
          </View>
          <View style={styles.motivationArea} accessibilityRole="header">
            {MOTIVATION_LINES.map((line, index) => (
              <Animated.View
                key={line}
                style={{
                  opacity: lineOpacities[index],
                  transform: [{ translateY: lineTranslateYs[index] }],
                }}
              >
                <Text align="center" style={styles.motivation}>
                  {line}
                </Text>
              </Animated.View>
            ))}
          </View>
        </View>
        <Animated.View
          style={[styles.ctaArea, { opacity: ctaOpacity, transform: [{ translateY: ctaTranslateY }] }]}
        >
          <Button
            label="Create Account"
            variant="primary"
            size="lg"
            fullWidth
            onPress={onCreateAccount}
            accessibilityLabel="Create Account"
            accessibilityHint="Starts new account registration"
          />
          <Button
            label="Sign In"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={onSignIn}
            accessibilityLabel="Sign In"
            accessibilityHint="Opens sign in for existing accounts"
          />
        </Animated.View>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['6xl'],
    paddingBottom: spacing['3xl'],
  },
  hero: {
    flex: 1,
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: LOGO_TRIM_TOP,
  },
  glow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: colors.primary,
  },
  motivationArea: {
    marginTop: MOTIVATION_TRIM_TOP + spacing['5xl'],
  },
  /** Mirrors the splash tagline treatment (SplashScreen styles.tagline). */
  motivation: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    color: colors.primary,
    textShadowColor: colors.primaryLight,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  ctaArea: {
    gap: spacing.md,
  },
});



