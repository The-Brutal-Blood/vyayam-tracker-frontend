import { useMutation } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import { verifyEmailOtp } from '../services/auth.service';
import type { VerifyEmailOtpPayload, VerifyEmailOtpResponse } from '../types/auth.types';

/** Verifies the emailed OTP and completes email registration. */
export function useVerifyOtp() {
  return useMutation<VerifyEmailOtpResponse, ApiError, VerifyEmailOtpPayload>({
    mutationKey: ['auth', 'verify-email-otp'],
    mutationFn: verifyEmailOtp,
  });
}
