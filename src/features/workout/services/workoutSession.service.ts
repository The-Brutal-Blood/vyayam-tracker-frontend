import { apiClient, resolveAssetUrl, toApiError } from '@/api/client';

import type { FinishWorkoutRequest, WorkoutSession } from '../types/workout.types';

/**
 * Workout-session service — the single gateway for /workout-sessions requests.
 * Starting returns the full session; finishing/discarding return no body.
 */

const ENDPOINT = '/workout-sessions';

/**
 * Starts a session via POST /workout-sessions and normalizes the response.
 * The request body is the only thing that varies between starting from a
 * routine and starting empty; everything downstream (the session screen,
 * add-exercise flow, and finish payload) is shared.
 */
async function startSession(body: Record<string, unknown>): Promise<WorkoutSession> {
  try {
    const { data } = await apiClient.post<WorkoutSession>(ENDPOINT, body);
    return {
      ...data,
      exercises: (data.exercises ?? []).map(exercise => ({
        ...exercise,
        imageUrl: resolveAssetUrl(exercise.imageUrl),
      })),
    };
  } catch (error) {
    throw toApiError(error);
  }
}

/** Starts a session from a routine (exercises come back prefilled). */
export function startWorkoutSession(routineId: string): Promise<WorkoutSession> {
  return startSession({ routineId });
}

/**
 * Starts a blank session with no routine (empty body). The backend mints the
 * session with an empty exercises array; exercises are added client-side and
 * the session finishes through the exact same code path as a routine session.
 */
export function startEmptyWorkoutSession(): Promise<WorkoutSession> {
  return startSession({});
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
