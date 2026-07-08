import React from 'react';
import { DarkTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/api/queryClient';
import { RootNavigator } from '@/navigation/RootNavigator';
import { AuthProvider } from '@/providers/AuthProvider';
import { colors } from '@/theme';

// Maps the Vyayam design tokens onto React Navigation's theme so navigator
// backgrounds and transitions never flash a default color.
const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.backgroundSecondary,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.primary,
  },
};

function App() {
  // Session restore lives inside AuthProvider; the splash plays while it runs.
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={navigationTheme}>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
