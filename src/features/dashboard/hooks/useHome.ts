import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import { getHome } from '../services/home.service';
import type { HomeSummary } from '../types/home.types';

/** Canonical cache key for the Home tab summary. */
export const homeKeys = {
  summary: ['home', 'summary'] as const,
};

/** The Home tab summary (greeting, streak, today's workout, goal, stats). */
export function useHome() {
  return useQuery<HomeSummary, ApiError>({
    queryKey: homeKeys.summary,
    queryFn: getHome,
    staleTime: 60 * 1000,
  });
}
