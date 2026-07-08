import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';
import { userKeys } from '@/hooks/useCurrentUser';

import { completeProfile, getProfile } from '../services/profile.service';
import type { CompleteProfilePayload, UserProfile } from '../types/profile.types';

/**
 * Submits the onboarding profile. Per the success contract, a successful
 * PATCH is immediately followed by GET /users/me — the fresh profile (with
 * the authoritative `profileCompleted` flag) is the mutation result and is
 * written into the shared user cache so the Dashboard reads it for free.
 */
export function useCompleteProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, ApiError, CompleteProfilePayload>({
    mutationKey: ['profile', 'complete'],
    mutationFn: async payload => {
      await completeProfile(payload);
      return getProfile();
    },
    onSuccess: profile => {
      queryClient.setQueryData(userKeys.me, profile);
    },
  });
}
