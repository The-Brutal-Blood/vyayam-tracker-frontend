import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Button, Loader, Logo, Screen, Text } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, radius, spacing } from '@/theme';

const GREETING_SLIDE_DISTANCE = 16;
const LOGO_SIZE = 48;
/** Compensates the logo PNG's internal transparent padding at 48pt. */
const LOGO_TRIM_LEFT = -6;

export const HomeScreen = React.memo(function HomeScreenBase() {
  const { data: user, isPending, isError, error, refetch } = useCurrentUser();

  // The greeting eases in once per mount — a calm arrival, not a splash.
  const reduceMotion = useReducedMotion();
  const greetingOpacity = useRef(new Animated.Value(0)).current;
  const greetingTranslateY = useRef(new Animated.Value(GREETING_SLIDE_DISTANCE)).current;

  useEffect(() => {
    if (reduceMotion === null) {
      return undefined;
    }
    if (reduceMotion) {
      greetingOpacity.setValue(1);
      greetingTranslateY.setValue(0);
      return undefined;
    }
    const entrance = Animated.parallel([
      Animated.timing(greetingOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(greetingTranslateY, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    entrance.start();
    return () => entrance.stop();
  }, [reduceMotion, greetingOpacity, greetingTranslateY]);

  if (isPending) {
    return (
      <Screen edges={['top']}>
        <Loader fullscreen />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen edges={['top']}>
        <View style={styles.errorState}>
          <View style={styles.errorBox} accessibilityRole="alert" accessibilityLiveRegion="polite">
            <Text variant="bodySmall" color="error">
              {error.message}
            </Text>
          </View>
          <Button
            label="Try Again"
            variant="outline"
            size="md"
            onPress={() => refetch()}
            accessibilityLabel="Try Again"
            accessibilityHint="Reloads your profile"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <View style={styles.root}>
        <View
          style={styles.brandRow}
          accessible
          accessibilityRole="header"
          accessibilityLabel={`Vyayam Tracker. Signed in as ${user.fullName ?? user.email}`}
        >
          <Logo width={LOGO_SIZE} height={LOGO_SIZE} />
          <Text variant="title" style={styles.brandName}>
            {user.fullName ?? user.email}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.greeting,
            { opacity: greetingOpacity, transform: [{ translateY: greetingTranslateY }] },
          ]}
        >
          <Text variant="displayL">Hello,</Text>
          <Text variant="bodyLarge" color="textSecondary" style={styles.subtitle}>
            {"Ready for today's workout?"}
          </Text>
        </Animated.View>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    // The logo PNG carries internal transparent padding; a small negative
    // pull seats it optically in the corner.
    marginLeft: LOGO_TRIM_LEFT,
  },
  brandName: {
    flexShrink: 1,
  },
  greeting: {
    marginTop: spacing['3xl'],
  },
  subtitle: {
    marginTop: spacing.md,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  errorBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
