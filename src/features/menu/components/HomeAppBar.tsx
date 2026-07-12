import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, radius, spacing } from '@/theme';

import { useHomeDrawer } from '../context/HomeDrawerContext';

const ICON_SIZE = 24;
const BUTTON_SIZE = 40;

/** Three-line hamburger glyph, matching the app's stroke icon language. */
function MenuGlyph({ color, size = ICON_SIZE }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 7h16M4 12h16M4 17h16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Home app-bar row: a left-aligned hamburger that opens the navigation drawer. */
export const HomeAppBar = React.memo(function HomeAppBarBase() {
  const { openDrawer } = useHomeDrawer();
  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        accessibilityHint="Opens the navigation drawer"
        onPress={openDrawer}
        hitSlop={spacing.sm}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <MenuGlyph color={colors.textPrimary} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    marginLeft: -spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: colors.surface,
  },
});
