import { useMutation } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import {
  discardWorkoutSession,
  finishWorkoutSession,
  startWorkoutSession,
} from '../services/workoutSession.service';
import type { FinishWorkoutRequest, WorkoutSession } from '../types/workout.types';

/** Starts a session from a routine (POST /workout-sessions). */
export function useStartWorkoutSession() {
  return useMutation<WorkoutSession, ApiError, string>({
    mutationFn: startWorkoutSession,
  });
}

/** Finishes a session with the locally-logged results. */
export function useFinishWorkoutSession() {
  return useMutation<void, ApiError, { sessionId: string; payload: FinishWorkoutRequest }>({
    mutationFn: ({ sessionId, payload }) => finishWorkoutSession(sessionId, payload),
  });
}

/** Discards an in-progress session. */
export function useDiscardWorkoutSession() {
  return useMutation<void, ApiError, string>({
    mutationFn: discardWorkoutSession,
  });
}
