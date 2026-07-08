import { apiClient, toApiError } from '@/api/client';
import { getCurrentUser, USERS_ME_ENDPOINT } from '@/services/user.service';

import type { CompleteProfilePayload, UserProfile } from '../types/profile.types';
import type { ProfileFormValues } from '../validation/profile.schema';

/**
 * Profile service — owns onboarding's PATCH /users/me: the form-to-API
 * mapping and error normalization. Reads of the current user delegate to
 * the shared user service. Screens never touch axios or raw errors.
 */

/** Formats a Date as the ISO calendar date (YYYY-MM-DD) the API expects. */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Maps validated form values onto the PATCH /users/me contract. */
export function toCompleteProfilePayload(values: ProfileFormValues): CompleteProfilePayload {
  return {
    fullName: values.fullName.trim(),
    dateOfBirth: toIsoDate(values.dateOfBirth),
    gender: values.gender,
    heightCm: Number(values.heightCm),
    weightKg: Number(values.weightKg),
  };
}

export async function completeProfile(payload: CompleteProfilePayload): Promise<UserProfile> {
  try {
    const { data } = await apiClient.patch<UserProfile>(USERS_ME_ENDPOINT, payload);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getProfile(): Promise<UserProfile> {
  return getCurrentUser();
}
