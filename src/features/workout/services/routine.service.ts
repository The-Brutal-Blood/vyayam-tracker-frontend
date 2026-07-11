import { apiClient, resolveAssetUrl, toApiError } from '@/api/client';

import type {
  CreateRoutineRequest,
  RoutineDetail,
  RoutineOverview,
} from '../types/workout.types';

/**
 * Routines service — the single gateway for /routines requests. Normalizes
 * transport errors into ApiError so hooks/screens render safe messages.
 */

const ROUTINES_ENDPOINT = '/routines';

export async function createRoutine(payload: CreateRoutineRequest): Promise<void> {
  try {
    await apiClient.post(ROUTINES_ENDPOINT, payload);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getRoutinesOverview(): Promise<RoutineOverview[]> {
  try {
    const { data } = await apiClient.get<RoutineOverview[]>(`${ROUTINES_ENDPOINT}/routine-list`);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getRoutineDetail(id: string): Promise<RoutineDetail> {
  try {
    const { data } = await apiClient.get<RoutineDetail>(`${ROUTINES_ENDPOINT}/${id}`);
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

export async function updateRoutine(id: string, payload: CreateRoutineRequest): Promise<void> {
  try {
    await apiClient.put(`${ROUTINES_ENDPOINT}/${id}`, payload);
  } catch (error) {
    throw toApiError(error);
  }
}

export async function deleteRoutine(id: string): Promise<void> {
  try {
    await apiClient.delete(`${ROUTINES_ENDPOINT}/${id}`);
  } catch (error) {
    throw toApiError(error);
  }
}
