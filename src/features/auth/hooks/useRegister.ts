import { useMutation } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import { registerWithEmail } from '../services/auth.service';
import type { RegisterEmailPayload, RegisterEmailResponse } from '../types/auth.types';

/**
 * Registers a new account with email + password. On success the backend has
 * emailed an OTP; the caller should route to the Verify OTP screen.
 */
export function useRegister() {
  return useMutation<RegisterEmailResponse, ApiError, RegisterEmailPayload>({
    mutationKey: ['auth', 'register-email'],
    mutationFn: registerWithEmail,
  });
}
