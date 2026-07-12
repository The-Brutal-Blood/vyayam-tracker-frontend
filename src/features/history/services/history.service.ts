import { apiClient, resolveAssetUrl, toApiError } from '@/api/client';

import type { WorkoutHistoryPage } from '../types/history.types';

/**
 * Workout-history service — the single gateway for GET /workout-history.
 * Reuses the shared API client (auth + error normalization) and rewrites
 * exercise image URLs onto the platform-correct host, exactly like the
 * routines service does.
 */

const WORKOUT_HISTORY_ENDPOINT = '/workout-history';

/** The user's completed workouts, newest first (paged; first page for now). */
export async function getWorkoutHistory(): Promise<WorkoutHistoryPage> {
  try {
    const { data } = await apiClient.get<WorkoutHistoryPage>(WORKOUT_HISTORY_ENDPOINT);
    return {
      ...data,
      content: data.content.map(item => ({
        ...item,
        exercises: item.exercises.map(exercise => ({
          ...exercise,
          imageUrl: resolveAssetUrl(exercise.imageUrl),
        })),
      })),
    };
  } catch (error) {
    throw toApiError(error);
  }
}
