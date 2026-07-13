import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import { bodyWeightKeys } from './useLogBodyWeight';
import { getBodyWeight } from '../services/bodyWeight.service';
import type { BodyWeightSummary } from '../types/bodyWeight.types';

/** The Weight Tracker summary (GET /body-weight). Shares the `body-weight`
 *  cache key, so logging a weight (which invalidates it) auto-refreshes here. */
export function useBodyWeight() {
  return useQuery<BodyWeightSummary, ApiError>({
    queryKey: bodyWeightKeys.all,
    queryFn: getBodyWeight,
    staleTime: 60 * 1000,
  });
}
