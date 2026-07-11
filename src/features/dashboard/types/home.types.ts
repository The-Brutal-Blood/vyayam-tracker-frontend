/**
 * Home tab domain models — the GET /home response contract.
 *
 * Sections that a brand-new user has no data for (`weeklyGoal`, `recentWorkout`,
 * `stats`) are nullable so the screen can hide them, and `todayWorkout` is null
 * on a rest day / when nothing is scheduled.
 */

export interface HomeGreeting {
  title: string;
  message: string;
}

export interface HomeTodayWorkout {
  routineId: string;
  routineName: string;
  exerciseCount: number;
  estimatedDurationMinutes: number;
}

export interface HomeWeeklyGoal {
  completed: number;
  target: number;
}

export interface HomeRecentWorkout {
  routineName: string;
  /** ISO timestamp of when the workout finished. */
  completedAt: string;
  durationMinutes: number;
  volume: number;
}

export interface HomeStats {
  totalWorkouts: number;
  totalDurationMinutes: number;
  totalVolume: number;
}

export interface HomePersonalRecord {
  exerciseName: string;
  weight: number;
}

/** GET /home — everything the Home tab renders in one payload. */
export interface HomeSummary {
  greeting: HomeGreeting;
  userName: string;
  streak: number;
  /** Null on a rest day or when no routine is scheduled today. */
  todayWorkout: HomeTodayWorkout | null;
  isRestDay: boolean;
  /** Null until the user has any tracked history. */
  weeklyGoal: HomeWeeklyGoal | null;
  recentWorkout: HomeRecentWorkout | null;
  stats: HomeStats | null;
  /** Most recent personal best; null until the user sets one. */
  latestPersonalRecord: HomePersonalRecord | null;
}
