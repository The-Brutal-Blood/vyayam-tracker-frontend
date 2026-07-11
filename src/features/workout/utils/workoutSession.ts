import type {
  FinishWorkoutRequest,
  WorkoutSession,
  WorkoutSessionState,
  WorkoutSetState,
} from '../types/workout.types';

/** Parses a free-text numeric field; blank or non-numeric returns null. */
export function parseNumericField(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberToField(value: number | null): string {
  return value != null ? String(value) : '';
}

/** Maps the started session onto locally-editable state, prefilling targets. */
export function toSessionState(session: WorkoutSession): WorkoutSessionState {
  return {
    sessionId: session.sessionId,
    routineId: session.routineId,
    routineName: session.routineName,
    startedAt: session.startedAt,
    exercises: [...session.exercises]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(exercise => ({
        workoutExerciseId: exercise.workoutExerciseId,
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        imageUrl: exercise.imageUrl,
        restTimerSeconds: exercise.restTimerSeconds,
        notes: exercise.notes ?? '',
        previousSets: exercise.previousSets ?? [],
        sets: (exercise.sets ?? []).map(set => ({
          workoutSetId: set.workoutSetId,
          setNumber: set.setNumber,
          targetWeight: set.targetWeight,
          targetReps: set.targetReps,
          weight: numberToField(set.actualWeight ?? set.targetWeight),
          reps: numberToField(set.actualReps ?? set.targetReps),
          completed: set.completed,
        })),
      })),
  };
}

/** A fresh, empty set appended by "Add Set". */
export function createEmptySet(workoutSetId: string, setNumber: number): WorkoutSetState {
  return {
    workoutSetId,
    setNumber,
    targetWeight: null,
    targetReps: null,
    weight: '',
    reps: '',
    completed: false,
  };
}

/** Total completed sets across the session. */
export function countCompletedSets(state: WorkoutSessionState): number {
  return state.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter(set => set.completed).length,
    0,
  );
}

/** Volume = Σ weight × reps over completed sets only. */
export function computeVolume(state: WorkoutSessionState): number {
  return state.exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((sum, set) => {
      if (!set.completed) {
        return sum;
      }
      const weight = parseNumericField(set.weight) ?? 0;
      const reps = parseNumericField(set.reps) ?? 0;
      return sum + weight * reps;
    }, 0);
    return total + exerciseVolume;
  }, 0);
}

/** Builds the finish payload from local state and the elapsed duration. */
export function buildFinishPayload(
  state: WorkoutSessionState,
  durationSeconds: number,
): FinishWorkoutRequest {
  return {
    durationSeconds,
    totalVolume: computeVolume(state),
    completedSets: countCompletedSets(state),
    exercises: state.exercises.map(exercise => ({
      workoutExerciseId: exercise.workoutExerciseId,
      notes: exercise.notes,
      sets: exercise.sets.map(set => ({
        workoutSetId: set.workoutSetId,
        actualWeight: parseNumericField(set.weight),
        actualReps: parseNumericField(set.reps),
        completed: set.completed,
      })),
    })),
  };
}
