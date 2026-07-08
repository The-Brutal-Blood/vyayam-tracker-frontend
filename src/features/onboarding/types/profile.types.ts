/** Contracts for onboarding profile completion (PATCH /users/me). */

import type { Gender } from '@/types/user.types';

// The user shape and gender enum are app-wide; re-exported here so
// onboarding modules keep a single local import path.
export type { Gender, UserProfile } from '@/types/user.types';

export interface CompleteProfilePayload {
  fullName: string;
  /** ISO date (YYYY-MM-DD). */
  dateOfBirth: string;
  gender: Gender;
  heightCm: number;
  weightKg: number;
}
