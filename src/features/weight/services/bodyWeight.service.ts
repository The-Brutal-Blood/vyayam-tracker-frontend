import { apiClient, toApiError } from '@/api/client';

import type { BodyWeightSummary, LogBodyWeightRequest } from '../types/bodyWeight.types';

/**
 * Body-weight service — the single gateway for /body-weight. Reuses the shared
 * API client (auth + error normalization).
 */

const BODY_WEIGHT_ENDPOINT = '/body-weight';

/** Logs a body-weight entry for today. */
export async function logBodyWeight(payload: LogBodyWeightRequest): Promise<void> {
  try {
    await apiClient.post(BODY_WEIGHT_ENDPOINT, payload);
  } catch (error) {
    throw toApiError(error);
  }
}

/** The Weight Tracker summary: today's status, stats, and full history. */
export async function getBodyWeight(): Promise<BodyWeightSummary> {
  try {
    const { data } = await apiClient.get<BodyWeightSummary>(BODY_WEIGHT_ENDPOINT);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}
