import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ClipboardIcon } from '@/components/icons/ActionIcons';
import { Button, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export interface CreateFirstRoutineCardProps {
  onCreateRoutine: () => void;
}

const ICON_SIZE = 28;

/** Shown when the user has no routine to start — nudges them into the existing
 *  Create Routine flow. Matches the app's dashed empty-state styling. */
export const CreateFirstRoutineCard = React.memo(function CreateFirstRoutineCardBase({
  onCreateRoutine,
}: CreateFirstRoutineCardProps) {
  return (
    <View style={styles.card}>
      <ClipboardIcon color={colors.textSecondary} size={ICON_SIZE} />
      <Text variant="subtitle" color="textSecondary" align="center" style={styles.title}>
        Create your first routine
      </Text>
      <Text variant="bodySmall" color="textDisabled" align="center" style={styles.subtitle}>
        Build a routine and it will be ready to start from here.
      </Text>
      <Button
        label="Create Routine"
        variant="primary"
        size="lg"
        fullWidth
        onPress={onCreateRoutine}
        accessibilityLabel="Create Routine"
        accessibilityHint="Opens the create routine screen"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  title: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
});
