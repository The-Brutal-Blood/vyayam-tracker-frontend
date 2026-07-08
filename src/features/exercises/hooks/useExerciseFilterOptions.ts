import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';

import { getEquipmentOptions, getPrimaryMuscleOptions } from '../services/exercise.service';

/** The library's vocabularies change only on reseed — cache for the session. */
const OPTIONS_STALE_TIME = Infinity;

export function useEquipmentOptions() {
  return useQuery<string[], ApiError>({
    queryKey: ['exercises', 'equipment-options'],
    queryFn: getEquipmentOptions,
    staleTime: OPTIONS_STALE_TIME,
  });
}

export function usePrimaryMuscleOptions() {
  return useQuery<string[], ApiError>({
    queryKey: ['exercises', 'primary-muscle-options'],
    queryFn: getPrimaryMuscleOptions,
    staleTime: OPTIONS_STALE_TIME,
  });
}
