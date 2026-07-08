import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';
import { getCurrentUser } from '@/services/user.service';
import type { UserProfile } from '@/types/user.types';

/** Canonical cache keys for the authenticated user. */
export const userKeys = {
  me: ['user', 'me'] as const,
};

/**
 * The authenticated user. The cache is seeded by the AuthProvider during
 * session restore/login and by profile completion, so tab screens usually
 * render instantly from cache.
 */
export function useCurrentUser() {
  return useQuery<UserProfile, ApiError>({
    queryKey: userKeys.me,
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
}
