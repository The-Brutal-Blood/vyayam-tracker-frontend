import * as Keychain from 'react-native-keychain';

import type { WorkoutSessionState } from '@/features/workout/types/workout.types';

/**
 * Local persistence for an in-progress workout so it survives backgrounding and
 * app restarts (offline safety / resume). Reuses the device Keychain that the
 * app already links — no extra native dependency. Failures degrade silently;
 * losing a persisted draft must never crash the app.
 *
 * This is device-local convenience storage, not a security boundary.
 */

const KEYCHAIN_SERVICE = 'com.vyayamtracker.workout';

export async function saveWorkoutSession(state: WorkoutSessionState): Promise<void> {
  try {
    await Keychain.setGenericPassword('workout', JSON.stringify(state), {
      service: KEYCHAIN_SERVICE,
    });
  } catch {
    // Persistence failed; the workout still works for this app run.
  }
}

export async function loadWorkoutSession(): Promise<WorkoutSessionState | null> {
  try {
    const stored = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored.password) as WorkoutSessionState;
    return parsed?.sessionId ? parsed : null;
  } catch {
    return null;
  }
}

export async function clearWorkoutSession(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
  } catch {
    // Nothing critical remains; ignore.
  }
}
