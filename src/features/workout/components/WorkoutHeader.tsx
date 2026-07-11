import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronDownIcon } from '@/components/icons/ActionIcons';
import { Button, Text } from '@/components/ui';
import { colors, spacing } from '@/theme';

export interface WorkoutHeaderProps {
  title: string;
  finishing: boolean;
  onBack: () => void;
  onFinish: () => void;
}

const BACK_BUTTON_SIZE = 40;

/** Session top bar: minimize/back, title, and the Finish action. */
export const WorkoutHeader = React.memo(function WorkoutHeaderBase({
  title,
  finishing,
  onBack,
  onFinish,
}: WorkoutHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Minimize workout"
        accessibilityHint="Returns to the previous screen; your workout is kept"
        onPress={onBack}
        hitSlop={spacing.sm}
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
      >
        <ChevronDownIcon color={colors.textPrimary} size={24} />
      </Pressable>
      <Text variant="title" accessibilityRole="header" numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <Button
        label="Finish"
        variant="primary"
        size="sm"
        loading={finishing}
        onPress={onFinish}
        accessibilityLabel="Finish workout"
        accessibilityHint="Saves and ends this workout"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BACK_BUTTON_SIZE / 2,
  },
  backButtonPressed: {
    backgroundColor: colors.surface,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
});
