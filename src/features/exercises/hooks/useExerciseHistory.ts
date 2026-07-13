import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import { exerciseKeys } from './useExercises';
import { getExerciseHistory } from '../services/exercise.service';
import type { ExerciseHistory } from '../types/exerciseHistory.types';

/**
 * Per-exercise history (GET /exercises/:id/history) for the Detail screen's
 * History tab. Fetched only once that tab is opened; kept fresh briefly so
 * re-opening the tab is instant without going stale after a new workout.
 */
export function useExerciseHistory(id: string) {
  return useQuery<ExerciseHistory, ApiError>({
    queryKey: exerciseKeys.history(id),
    queryFn: () => getExerciseHistory(id),
    staleTime: 60 * 1000,
    enabled: id.length > 0,
  });
}
