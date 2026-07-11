import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { CloseIcon, CopyIcon, PencilIcon } from '@/components/icons/ActionIcons';
import { Text } from '@/components/ui';
import { colors, radius, spacing, type ColorToken } from '@/theme';

export interface RoutineMenuSheetProps {
  visible: boolean;
  /** Named in the sheet header. */
  routineName?: string;
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

interface MenuAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: ColorToken;
  onPress: () => void;
}

const ICON_SIZE = 22;

/**
 * Bottom-sheet action menu for a saved routine: duplicate, edit, delete.
 * Mirrors the app's other sheets (backdrop dismiss, rounded top).
 */
export const RoutineMenuSheet = React.memo(function RoutineMenuSheetBase({
  visible,
  routineName,
  onDuplicate,
  onEdit,
  onDelete,
  onClose,
}: RoutineMenuSheetProps) {
  const run = (action: () => void) => () => {
    onClose();
    action();
  };

  const actions: MenuAction[] = [
    {
      key: 'duplicate',
      label: 'Duplicate Routine',
      icon: <CopyIcon color={colors.textPrimary} size={ICON_SIZE} />,
      color: 'textPrimary',
      onPress: run(onDuplicate),
    },
    {
      key: 'edit',
      label: 'Edit Routine',
      icon: <PencilIcon color={colors.textPrimary} size={ICON_SIZE} />,
      color: 'textPrimary',
      onPress: run(onEdit),
    },
    {
      key: 'delete',
      label: 'Delete Routine',
      icon: <CloseIcon color={colors.error} size={ICON_SIZE} />,
      color: 'error',
      onPress: run(onDelete),
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdropContainer}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {routineName ? (
            <Text
              variant="bodySmall"
              color="textSecondary"
              numberOfLines={1}
              style={styles.title}
            >
              {routineName}
            </Text>
          ) : null}
          {actions.map((action, index) => (
            <Pressable
              key={action.key}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.row,
                index > 0 && styles.rowBorder,
                pressed && styles.rowPressed,
              ]}
            >
              <View style={styles.icon}>{action.icon}</View>
              <Text variant="subtitle" color={action.color}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.backdrop,
  },
  backdrop: {
    ...(StyleSheet.absoluteFill as object),
  },
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  rowPressed: {
    backgroundColor: colors.surface,
  },
  icon: {
    width: ICON_SIZE,
    alignItems: 'center',
  },
});
