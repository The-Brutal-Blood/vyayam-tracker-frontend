import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import {
  createRoutine,
  deleteRoutine,
  getRoutineDetail,
  getRoutinesOverview,
  updateRoutine,
} from '../services/routine.service';
import type {
  CreateRoutineRequest,
  RoutineDetail,
  RoutineOverview,
} from '../types/workout.types';

export const routineKeys = {
  all: ['routines'] as const,
  overview: ['routines', 'overview'] as const,
  detail: (id: string) => ['routines', 'detail', id] as const,
};

/** The user's saved routines, summarized for the Workout tab. */
export function useRoutinesOverview() {
  return useQuery<RoutineOverview[], ApiError>({
    queryKey: routineKeys.overview,
    queryFn: getRoutinesOverview,
    staleTime: 60 * 1000,
  });
}

/** Full detail for one routine — used to seed the editor for edit/duplicate. */
export function useRoutineDetail(id: string, enabled: boolean) {
  return useQuery<RoutineDetail, ApiError>({
    queryKey: routineKeys.detail(id),
    queryFn: () => getRoutineDetail(id),
    enabled: enabled && id.length > 0,
    staleTime: 60 * 1000,
  });
}

/** Creates a routine, then refreshes the overview list. */
export function useCreateRoutine() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, CreateRoutineRequest>({
    mutationFn: createRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.overview });
    },
  });
}

/** Updates an existing routine, then refreshes the list and that routine's detail. */
export function useUpdateRoutine() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, { id: string; payload: CreateRoutineRequest }>({
    mutationFn: ({ id, payload }) => updateRoutine(id, payload),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.overview });
      queryClient.invalidateQueries({ queryKey: routineKeys.detail(id) });
    },
  });
}

/** Deletes a routine, then refreshes the overview list. */
export function useDeleteRoutine() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: deleteRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routineKeys.overview });
    },
  });
}
