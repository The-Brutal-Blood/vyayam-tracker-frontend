import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/components/icons/ActionIcons';
import { Loader, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export interface FilterSheetProps {
  visible: boolean;
  title: string;
  /** Label for the clear-filter row, e.g. "All Equipment". */
  allLabel: string;
  options: string[];
  /** Currently applied value; null means no filter. */
  selected: string | null;
  loading?: boolean;
  onSelect: (value: string | null) => void;
  onClose: () => void;
}

const SHEET_MAX_HEIGHT_RATIO = 0.72;
const HANDLE_WIDTH = 44;
const HANDLE_HEIGHT = 4;

/**
 * Bottom-sheet single-select for exercise filters. Selecting a row applies
 * it and dismisses; the "All" row clears the filter.
 */
export const FilterSheet = React.memo(function FilterSheetBase({
  visible,
  title,
  allLabel,
  options,
  selected,
  loading = false,
  onSelect,
  onClose,
}: FilterSheetProps) {
  const rows: Array<string | null> = [null, ...options];

  const handlePick = (value: string | null) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdropContainer}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={`Close ${title} filter`}
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text variant="title" align="center" accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {loading ? (
            <Loader style={styles.loader} />
          ) : (
            <FlatList
              data={rows}
              keyExtractor={item => item ?? 'all'}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item === selected;
                const label = item ?? allLabel;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    accessibilityLabel={label}
                    onPress={() => handlePick(item)}
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                  >
                    <Text
                      variant="subtitle"
                      color={isSelected ? 'primary' : 'textPrimary'}
                      style={item ? styles.optionLabel : undefined}
                    >
                      {label}
                    </Text>
                    {isSelected ? <CheckIcon color={colors.primary} /> : null}
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={Separator}
            />
          )}
        </View>
      </View>
    </Modal>
  );
});

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.backdrop,
  },
  backdrop: {
    ...StyleSheet.absoluteFill as object,
  },
  sheet: {
    maxHeight: `${SHEET_MAX_HEIGHT_RATIO * 100}%`,
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  handle: {
    alignSelf: 'center',
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: HANDLE_HEIGHT / 2,
    backgroundColor: colors.border,
    marginTop: spacing.md,
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  loader: {
    paddingVertical: spacing['3xl'],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  optionPressed: {
    backgroundColor: colors.surface,
  },
  optionLabel: {
    textTransform: 'capitalize',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
  },
});
