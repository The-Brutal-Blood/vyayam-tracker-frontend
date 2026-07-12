import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import { getWorkoutHistory } from '../services/history.service';
import type { WorkoutHistoryPage } from '../types/history.types';

/** Canonical cache key for the workout history list. */
export const workoutHistoryKeys = {
  all: ['workout-history'] as const,
};

/** The user's completed workouts for the History tab. */
export function useWorkoutHistory() {
  return useQuery<WorkoutHistoryPage, ApiError>({
    queryKey: workoutHistoryKeys.all,
    queryFn: getWorkoutHistory,
    staleTime: 60 * 1000,
  });
}
