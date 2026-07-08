/**
 * Workout domain models. UI-first for now; when the routines API lands these
 * become the response contracts (ids from the backend, exercises expanded to
 * full objects as needed).
 */

export interface Routine {
  id: string;
  name: string;
  /** Display names of the routine's exercises, in order. */
  exercises: string[];
}
