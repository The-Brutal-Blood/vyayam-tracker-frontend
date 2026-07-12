import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider, Text } from '@/components/ui';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { AppStackParamList } from '@/navigation/AppNavigator';
import { colors, radius, shadows, spacing } from '@/theme';

export interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  /** Called for not-yet-built items; the host surfaces a "Coming soon" toast. */
  onComingSoon: (label: string) => void;
}

/** Width fraction of the screen the drawer occupies (~80%). */
const PANEL_FRACTION = 0.8;
const OPEN_MS = 260;
const CLOSE_MS = 220;

type DrawerAction = 'weight' | 'comingSoon';

interface DrawerMenuItem {
  key: string;
  emoji: string;
  label: string;
  badge?: string;
  action: DrawerAction;
}

interface DrawerSection {
  title: string;
  items: DrawerMenuItem[];
}

// Settings-section items route through the "coming soon" toast as placeholders
// until their real destinations exist.
const SECTIONS: DrawerSection[] = [
  {
    title: 'Fitness Tools',
    items: [
      { key: 'weight', emoji: '⚖️', label: 'Weight Tracker', action: 'weight' },
      { key: 'calorie', emoji: '🔥', label: 'Calorie Counter', badge: 'Coming Soon', action: 'comingSoon' },
      { key: 'water', emoji: '💧', label: 'Water Tracker', badge: 'Coming Soon', action: 'comingSoon' },
      { key: 'nutrition', emoji: '🥗', label: 'Nutrition', badge: 'Coming Soon', action: 'comingSoon' },
    ],
  },
  {
    title: 'Settings',
    items: [
      // TODO: navigate to the Settings screen once it exists.
      { key: 'settings', emoji: '⚙️', label: 'Settings', action: 'comingSoon' },
      // TODO: open the platform store review flow.
      { key: 'rate', emoji: '⭐', label: 'Rate App', action: 'comingSoon' },
      // TODO: open the feedback form / mailto.
      { key: 'feedback', emoji: '📩', label: 'Feedback', action: 'comingSoon' },
      // TODO: navigate to the About screen.
      { key: 'about', emoji: 'ℹ️', label: 'About', action: 'comingSoon' },
    ],
  },
];

/** "Hemant Kashyap" → "HK"; falls back to the first letter of the email. */
function initialsOf(fullName: string | null, email: string): string {
  const source = fullName?.trim();
  if (!source) {
    return email.charAt(0).toUpperCase();
  }
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

interface DrawerRowProps {
  item: DrawerMenuItem;
  onPress: () => void;
}

const DrawerRow = React.memo(function DrawerRowBase({ item, onPress }: DrawerRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={styles.rowEmoji}>{item.emoji}</Text>
      <Text variant="body" style={styles.rowLabel} numberOfLines={1}>
        {item.label}
      </Text>
      {item.badge ? (
        <View style={styles.badge}>
          <Text variant="caption" color="textSecondary">
            {item.badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
});

/**
 * Left-side navigation drawer for the Home screen. Built on RN core (Modal +
 * Animated) so it needs no extra native dependencies; slides in over the whole
 * screen with a scrim, rounded right edge, and elevation.
 */
export const SideDrawer = React.memo(function SideDrawerBase({
  visible,
  onClose,
  onComingSoon,
}: SideDrawerProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { data: user } = useCurrentUser();
  const reduceMotion = useReducedMotion();

  const panelWidth = width * PANEL_FRACTION;
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }
    if (reduceMotion) {
      progress.setValue(visible ? 1 : 0);
      if (!visible) {
        setMounted(false);
      }
      return undefined;
    }
    const anim = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: visible ? OPEN_MS : CLOSE_MS,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start(({ finished }) => {
      if (finished && !visible) {
        setMounted(false);
      }
    });
    return () => anim.stop();
  }, [visible, mounted, reduceMotion, progress]);

  if (!mounted) {
    return null;
  }

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-panelWidth, 0],
  });
  const backdropOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const name = user?.fullName ?? user?.email ?? 'Athlete';
  const email = user?.fullName ? user.email : null;
  const initials = user ? initialsOf(user.fullName, user.email) : '🙂';

  const handleItem = (item: DrawerMenuItem) => {
    onClose();
    if (item.action === 'weight') {
      // Let the drawer finish closing before pushing the screen.
      setTimeout(() => navigation.navigate('WeightTracker'), CLOSE_MS);
    } else {
      onComingSoon(item.label);
    }
  };

  return (
    <Modal visible transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close menu"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.panel,
            { width: panelWidth, paddingTop: insets.top, transform: [{ translateX }] },
          ]}
        >
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.avatar} accessibilityRole="image" accessibilityLabel="Your avatar">
                <Text variant="headingM" color="primary">
                  {initials}
                </Text>
              </View>
              <Text variant="title" numberOfLines={1}>
                {name}
              </Text>
              {email ? (
                <Text variant="bodySmall" color="textSecondary" numberOfLines={1} style={styles.email}>
                  {email}
                </Text>
              ) : null}
            </View>

            <Divider style={styles.divider} />

            {SECTIONS.map(section => (
              <View key={section.title} style={styles.section}>
                <Text variant="label" color="textSecondary" style={styles.sectionTitle}>
                  {section.title}
                </Text>
                {section.items.map(item => (
                  <DrawerRow key={item.key} item={item} onPress={() => handleItem(item)} />
                ))}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.backgroundSecondary,
    borderTopRightRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  email: {
    marginTop: spacing.xxs,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  rowPressed: {
    backgroundColor: colors.surface,
  },
  rowEmoji: {
    fontSize: 20,
    width: 26,
    textAlign: 'center',
  },
  rowLabel: {
    flex: 1,
  },
  badge: {
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
});
