import { toApiError } from '@/api/client';
import { getCurrentUser } from '@/services/user.service';
import { clearTokens, getRefreshToken, saveTokens } from '@/storage/token.service';

import { postLogin, postLogout, postRegisterEmail, postVerifyEmailOtp } from '../api/auth.api';
import type {
  AuthSessionResponse,
  LoginPayload,
  RegisterEmailPayload,
  RegisterEmailResponse,
  VerifyEmailOtpPayload,
  VerifyEmailOtpResponse,
} from '../types/auth.types';

/**
 * Auth service — the single gateway for auth requests. Applies business
 * rules (email normalization, token persistence) and guarantees every
 * failure surfaces as a normalized, user-presentable ApiError.
 */

/** Canonical email form sent to the backend and carried through the flow. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function registerWithEmail(
  payload: RegisterEmailPayload,
): Promise<RegisterEmailResponse> {
  try {
    return await postRegisterEmail({
      email: normalizeEmail(payload.email),
      password: payload.password,
    });
  } catch (error) {
    throw toApiError(error);
  }
}

export async function verifyEmailOtp(
  payload: VerifyEmailOtpPayload,
): Promise<VerifyEmailOtpResponse> {
  try {
    const response = await postVerifyEmailOtp({
      email: normalizeEmail(payload.email),
      otp: payload.otp,
    });
    // Verification issues the session; persist it so every subsequent
    // request (starting with profile setup) is authenticated.
    await saveTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function login(payload: LoginPayload): Promise<AuthSessionResponse> {
  try {
    const response = await postLogin({
      email: normalizeEmail(payload.email),
      password: payload.password,
    });
    await saveTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response;
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * Revokes the session server-side (best effort) and always clears local
 * tokens — a user who taps Logout must end up signed out even offline.
 */
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await postLogout({ refreshToken });
    }
  } catch {
    // Server revocation failed (offline, expired, already revoked) —
    // local sign-out proceeds regardless.
  } finally {
    await clearTokens();
  }
}

/** The authenticated user, via the shared user service. */
export { getCurrentUser };
