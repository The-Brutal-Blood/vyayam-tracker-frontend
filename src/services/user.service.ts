import { apiClient, toApiError } from '@/api/client';
import type { UserProfile } from '@/types/user.types';

/**
 * The single owner of GET /users/me. Auth (session restore), onboarding
 * (post-completion refetch) and the Dashboard all call this — never axios.
 */

export const USERS_ME_ENDPOINT = '/users/me';

export async function getCurrentUser(): Promise<UserProfile> {
  try {
    const { data } = await apiClient.get<UserProfile>(USERS_ME_ENDPOINT);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}
