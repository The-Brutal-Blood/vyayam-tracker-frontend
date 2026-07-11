import { apiClient, toApiError } from '@/api/client';

import type { HomeSummary } from '../types/home.types';

/**
 * Home service — the single gateway for GET /home. Presentation depends only on
 * `getHome()`, so the transport lives entirely here. Errors are normalized into
 * ApiError so the screen renders a safe, friendly message.
 */

const HOME_ENDPOINT = '/home';

/** The Home tab summary (greeting, streak, today's workout, goal, stats, PR). */
export async function getHome(): Promise<HomeSummary> {
  try {
    const { data } = await apiClient.get<HomeSummary>(HOME_ENDPOINT);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}
