/**
 * Workout history domain models — the GET /workout-history response contract
 * (a Spring `Page`). Every workout arrives fully expanded (exercises + sets),
 * so the screen needs no follow-up requests.
 */

export interface WorkoutHistorySet {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  volume: number;
}

export interface WorkoutHistoryExercise {
  exerciseId: string;
  exerciseName: string;
  imageUrl: string;
  notes: string;
  restTimerSeconds?: number;
  completedSets: number;
  sets: WorkoutHistorySet[];
}

export interface WorkoutHistoryItem {
  workoutSessionId: string;
  routineName: string;
  /** ISO timestamp of when the workout finished. */
  completedAt: string;
  durationMinutes: number;
  totalVolume: number;
  exerciseCount: number;
  completedSetCount: number;
  personalRecordsBroken: number;
  exercises: WorkoutHistoryExercise[];
}

/** Paged GET /workout-history response (only the fields the UI consumes). */
export interface WorkoutHistoryPage {
  content: WorkoutHistoryItem[];
  totalElements: number;
  totalPages: number;
  /** Zero-based page index. */
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
