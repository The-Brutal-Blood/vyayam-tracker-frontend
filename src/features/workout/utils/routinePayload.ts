import { sortWeekdays } from './weekdays';
import type {
  CreateRoutineExerciseInput,
  CreateRoutineRequest,
  RoutineExerciseDraft,
  Weekday,
} from '../types/workout.types';

/** Parses a free-text numeric field; blank or non-numeric returns null. */
function parseNumericField(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Maps the routine editor's draft onto the POST /routines request. Sets with
 * neither weight nor reps entered are dropped, and the survivors are renumbered
 * sequentially. Rest timer and notes are omitted when unset/blank. Scheduled
 * days are always sent (an empty array when none are selected), in week order.
 */
export function buildCreateRoutinePayload(
  name: string,
  entries: RoutineExerciseDraft[],
  scheduledDays: readonly Weekday[] = [],
): CreateRoutineRequest {
  return {
    name: name.trim(),
    scheduledDays: sortWeekdays(scheduledDays),
    exercises: entries.map((entry, index) => {
      const sets = entry.sets
        .map(set => ({ weight: parseNumericField(set.kg), reps: parseNumericField(set.reps) }))
        .filter(set => set.weight !== null || set.reps !== null)
        .map((set, setIndex) => ({
          setNumber: setIndex + 1,
          weight: set.weight ?? 0,
          reps: set.reps ?? 0,
        }));

      const exercise: CreateRoutineExerciseInput = {
        exerciseId: entry.exercise.id,
        displayOrder: index + 1,
        sets,
      };

      if (entry.restSeconds != null) {
        exercise.restTimerSeconds = entry.restSeconds;
      }
      const notes = entry.notes.trim();
      if (notes) {
        exercise.notes = notes;
      }
      return exercise;
    }),
  };
}
