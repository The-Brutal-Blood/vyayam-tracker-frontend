import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';
import * as authService from '@/features/auth/services/auth.service';
import type { LoginPayload } from '@/features/auth/types/auth.types';
import { userKeys } from '@/hooks/useCurrentUser';
import { getCurrentUser } from '@/services/user.service';
import { clearTokens, hydrateTokens } from '@/storage/token.service';
import type { UserProfile } from '@/types/user.types';

/**
 * Session state machine:
 *  - 'restoring'       — app just launched; checking the Keychain and /users/me
 *  - 'authenticated'   — valid session AND completed profile; App tabs render
 *  - 'unauthenticated' — no usable session; Auth stack renders
 *
 * Tokens themselves never live here — they stay in the TokenService, read by
 * the axios interceptors. This context holds only who is signed in.
 */
export type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  status: AuthStatus;
  user: UserProfile | null;
  /**
   * Authenticates and returns the fresh user. Flips to 'authenticated' only
   * when the profile is complete — otherwise the caller routes the user into
   * onboarding (tokens are stored either way).
   */
  login: (payload: LoginPayload) => Promise<UserProfile>;
  /** Revokes the session (best effort), clears tokens + caches, signs out. */
  logout: () => Promise<void>;
  /** Marks the session live once onboarding confirms a completed profile. */
  completeSession: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Session restore: runs exactly once at launch.
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const hasStoredSession = await hydrateTokens();
      if (!hasStoredSession) {
        if (!cancelled) {
          setStatus('unauthenticated');
        }
        return;
      }
      try {
        const currentUser = await getCurrentUser();
        if (cancelled) {
          return;
        }
        queryClient.setQueryData(userKeys.me, currentUser);
        if (currentUser.profileCompleted) {
          setUser(currentUser);
          setStatus('authenticated');
        } else {
          // Tokens stay: signing in routes this user straight to onboarding.
          setStatus('unauthenticated');
        }
      } catch (error) {
        const apiError = error as ApiError;
        // Only a definitive rejection invalidates the session; a network
        // failure must not sign the user out of a still-valid session.
        if (apiError.status === 401 || apiError.status === 403) {
          await clearTokens();
        }
        if (!cancelled) {
          setStatus('unauthenticated');
        }
      }
    };

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  const login = useCallback(
    async (payload: LoginPayload): Promise<UserProfile> => {
      await authService.login(payload);
      const currentUser = await getCurrentUser();
      queryClient.setQueryData(userKeys.me, currentUser);
      if (currentUser.profileCompleted) {
        setUser(currentUser);
        setStatus('authenticated');
      }
      return currentUser;
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    queryClient.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, [queryClient]);

  const completeSession = useCallback(
    (completedUser: UserProfile) => {
      queryClient.setQueryData(userKeys.me, completedUser);
      setUser(completedUser);
      setStatus('authenticated');
    },
    [queryClient],
  );

  const value = useMemo(
    () => ({ status, user, login, logout, completeSession }),
    [status, user, login, logout, completeSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
