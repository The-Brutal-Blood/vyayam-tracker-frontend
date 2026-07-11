import { apiClient, resolveAssetUrl, toApiError } from '@/api/client';

import type { FinishWorkoutRequest, WorkoutSession } from '../types/workout.types';

/**
 * Workout-session service — the single gateway for /workout-sessions requests.
 * Starting returns the full session; finishing/discarding return no body.
 */

const ENDPOINT = '/workout-sessions';

export async function startWorkoutSession(routineId: string): Promise<WorkoutSession> {
  try {
    const { data } = await apiClient.post<WorkoutSession>(ENDPOINT, { routineId });
    return {
      ...data,
      exercises: data.exercises.map(exercise => ({
        ...exercise,
        imageUrl: resolveAssetUrl(exercise.imageUrl),
      })),
    };
  } catch (error) {
    throw toApiError(error);
  }
}

export async function finishWorkoutSession(
  sessionId: string,
  payload: FinishWorkoutRequest,
): Promise<void> {
  try {
    await apiClient.put(`${ENDPOINT}/${sessionId}/finish`, payload);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function discardWorkoutSession(sessionId: string): Promise<void> {
  try {
    await apiClient.delete(`${ENDPOINT}/${sessionId}`);
  } catch (error) {
    throw toApiError(error);
  }
}
