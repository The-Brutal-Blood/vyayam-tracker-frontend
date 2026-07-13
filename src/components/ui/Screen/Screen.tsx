import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

export interface ScreenProps {
  children: React.ReactNode;
  /** Wraps content in a ScrollView. Use for forms and long content. */
  scrollable?: boolean;
  /** Applies the default horizontal/vertical screen padding. */
  padded?: boolean;
  /** Enables keyboard avoidance. Disable for screens without inputs. */
  keyboardAvoiding?: boolean;
  /** Safe-area edges to inset. Defaults to top and bottom. */
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Pull-to-refresh control; only applies when `scrollable`. */
  refreshControl?: ScrollViewProps['refreshControl'];
  /** Ref to the inner ScrollView (only when `scrollable`), e.g. to scroll to top. */
  scrollViewRef?: React.Ref<ScrollView>;
}

export function Screen({
  children,
  scrollable = false,
  padded = true,
  keyboardAvoiding = true,
  edges = ['top', 'bottom'],
  style,
  contentContainerStyle,
  refreshControl,
  scrollViewRef,
}: ScreenProps) {
  const content = scrollable ? (
    <ScrollView
      ref={scrollViewRef}
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, padded && styles.padded, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded && styles.padded, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
});
