import { useMutation } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import { logBodyWeight } from '../services/bodyWeight.service';
import type { LogBodyWeightRequest } from '../types/bodyWeight.types';

/** Cache namespace for body-weight data (Weight Tracker queries, added later). */
export const bodyWeightKeys = {
  all: ['body-weight'] as const,
};

/** Logs today's body weight (POST /body-weight). */
export function useLogBodyWeight() {
  return useMutation<void, ApiError, LogBodyWeightRequest>({
    mutationFn: logBodyWeight,
  });
}
