/**
 * Workout domain models. UI-first for now; when the routines API lands these
 * become the response contracts (ids from the backend, exercises expanded to
 * full objects as needed).
 */

/**
 * The exercise identity the routine editor needs. A full library `Exercise`
 * satisfies it structurally; a saved routine supplies just these fields.
 */
export interface RoutineDraftExercise {
  id: string;
  name: string;
  imageUrl: string;
}

/** One planned set within a routine's exercise. Values are free-text while editing. */
export interface RoutineSetDraft {
  id: string;
  /** Target weight as typed by the user; empty until entered. */
  kg: string;
  /** Target repetitions as typed by the user; empty until entered. */
  reps: string;
}

/** An exercise as configured inside a routine draft: notes, rest, and sets. */
export interface RoutineExerciseDraft {
  exercise: RoutineDraftExercise;
  notes: string;
  /** Rest between sets, in seconds; `null` means the timer is off. */
  restSeconds: number | null;
  sets: RoutineSetDraft[];
}

/**
 * A day of the week a routine can be scheduled for. Full names keep the value
 * self-describing for the backend contract (wired to the API later).
 */
export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

/** Payload contracts for POST /routines. */
export interface CreateRoutineSetInput {
  setNumber: number;
  weight: number;
  reps: number;
}

export interface CreateRoutineExerciseInput {
  exerciseId: string;
  displayOrder: number;
  /** Omitted when the rest timer is off. */
  restTimerSeconds?: number;
  /** Omitted when the user left notes blank. */
  notes?: string;
  sets: CreateRoutineSetInput[];
}

export interface CreateRoutineRequest {
  name: string;
  /** Weekdays the routine is scheduled for; pending backend support. */
  scheduledDays?: Weekday[];
  exercises: CreateRoutineExerciseInput[];
}

/** One row from GET /routines/routine-list — id, name, and exercise display names. */
export interface RoutineOverview {
  routineId: string;
  name: string;
  exercises: string[];
  /** Weekdays the routine is scheduled for; may be absent/empty. */
  scheduledDays?: Weekday[];
}

/** Full routine detail from GET /routines/:id (also the PUT response shape). */
export interface RoutineDetailSet {
  setNumber: number;
  weight: number;
  reps: number;
}

export interface RoutineDetailExercise {
  routineExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  imageUrl: string;
  displayOrder: number;
  restTimerSeconds?: number | null;
  notes?: string | null;
  sets: RoutineDetailSet[];
}

export interface RoutineDetail {
  routineId: string;
  name: string;
  createdAt: string;
  /** Weekdays the routine is scheduled for; pending backend support. */
  scheduledDays?: Weekday[];
  exercises: RoutineDetailExercise[];
}

/* ------------------------------------------------------------------ *
 * Workout session (live logging) — POST /workout-sessions            *
 * ------------------------------------------------------------------ */

/** A prior performance for a set, shown read-only in the PREVIOUS column. */
export interface WorkoutPreviousSet {
  setNumber: number;
  actualWeight: number | null;
  actualReps: number | null;
}

export interface WorkoutServerSet {
  workoutSetId: string;
  setNumber: number;
  targetWeight: number | null;
  targetReps: number | null;
  actualWeight: number | null;
  actualReps: number | null;
  completed: boolean;
}

export interface WorkoutServerExercise {
  workoutExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  imageUrl: string;
  displayOrder: number;
  restTimerSeconds: number | null;
  notes: string;
  previousSets: WorkoutPreviousSet[];
  sets: WorkoutServerSet[];
}

/** POST /workout-sessions response — the started session. */
export interface WorkoutSession {
  sessionId: string;
  routineId: string;
  routineName: string;
  status: string;
  startedAt: string;
  durationSeconds: number;
  totalVolume: number;
  completedSets: number;
  exercises: WorkoutServerExercise[];
}

/** Locally-editable set (weight/reps are free text while logging). */
export interface WorkoutSetState {
  workoutSetId: string;
  setNumber: number;
  targetWeight: number | null;
  targetReps: number | null;
  weight: string;
  reps: string;
  completed: boolean;
}

export interface WorkoutExerciseState {
  workoutExerciseId: string;
  exerciseId: string;
  exerciseName: string;
  imageUrl: string;
  restTimerSeconds: number | null;
  notes: string;
  previousSets: WorkoutPreviousSet[];
  sets: WorkoutSetState[];
}

/** The whole in-progress session held in local state and persisted for resume. */
export interface WorkoutSessionState {
  sessionId: string;
  routineId: string;
  routineName: string;
  startedAt: string;
  exercises: WorkoutExerciseState[];
}

/** POST /workout-sessions/:id/finish payload. */
export interface FinishWorkoutSetInput {
  workoutSetId: string;
  actualWeight: number | null;
  actualReps: number | null;
  completed: boolean;
}

export interface FinishWorkoutExerciseInput {
  workoutExerciseId: string;
  notes: string;
  sets: FinishWorkoutSetInput[];
}

export interface FinishWorkoutRequest {
  durationSeconds: number;
  totalVolume: number;
  completedSets: number;
  exercises: FinishWorkoutExerciseInput[];
}
