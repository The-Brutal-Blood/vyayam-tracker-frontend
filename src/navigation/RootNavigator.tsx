import React, { useState } from 'react';

import { SplashScreen } from '@/features/auth/screens/SplashScreen';
import { useAuth } from '@/providers/AuthProvider';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

/**
 * State-driven root switch. The splash plays while the AuthProvider restores
 * the session (whichever finishes last wins), then exactly one stack mounts:
 *
 *  - authenticated   → bottom tabs (Home / Workout / Profile)
 *  - unauthenticated → auth stack (Welcome / Login / Signup / OTP / Profile setup)
 *
 * There is no navigate() between the two worlds — login, logout and profile
 * completion flip the auth state and the stacks swap, so an authenticated
 * user can never back-navigate into auth screens or vice versa.
 */
export function RootNavigator() {
  const { status } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone || status === 'restoring') {
    return <SplashScreen onAnimationComplete={() => setSplashDone(true)} />;
  }

  return status === 'authenticated' ? <AppNavigator /> : <AuthNavigator />;
}
