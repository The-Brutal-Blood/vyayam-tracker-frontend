import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

import type { HomeGreeting } from '../types/home.types';

export interface GreetingHeaderProps {
  greeting: HomeGreeting;
  userName: string;
}

/** Premium personalized greeting: a large title with the user's name, and a
 *  supporting motivational line. */
export const GreetingHeader = React.memo(function GreetingHeaderBase({
  greeting,
  userName,
}: GreetingHeaderProps) {
  const title = userName ? `${greeting.title}, ${userName}` : greeting.title;
  return (
    <View accessible accessibilityRole="header">
      <Text variant="displayL">{title}</Text>
      <Text variant="bodyLarge" color="textSecondary" style={styles.message}>
        {greeting.message}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  message: {
    marginTop: spacing.sm,
  },
});
