/**
 * The authenticated user, as returned by GET /users/me. App-wide: the
 * AuthProvider, Dashboard, Profile and onboarding all share this shape.
 */

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  /** ISO date (YYYY-MM-DD). */
  dateOfBirth: string | null;
  gender: Gender | null;
  heightCm: number | null;
  weightKg: number | null;
  profileCompleted: boolean;
}
