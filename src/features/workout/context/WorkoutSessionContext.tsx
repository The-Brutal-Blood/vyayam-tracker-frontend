import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { loadWorkoutSession } from '@/storage/workoutSession.storage';

import type { WorkoutSessionState } from '../types/workout.types';

/** Lightweight snapshot shown by the minimized bar (not the editable state). */
export interface WorkoutSessionSummary {
  sessionId: string;
  routineName: string;
  startedAt: string;
  firstExerciseName: string | null;
}

interface WorkoutSessionContextValue {
  /** The in-progress session, or null when none is active. */
  active: WorkoutSessionSummary | null;
  /** Marks a freshly-started session active. */
  startSession: (state: WorkoutSessionState) => void;
  /** Clears the active session (after finish/discard). */
  endSession: () => void;
  /** Reloads the active session from local storage. */
  refresh: () => void;
}

function summarize(state: WorkoutSessionState): WorkoutSessionSummary {
  return {
    sessionId: state.sessionId,
    routineName: state.routineName,
    startedAt: state.startedAt,
    firstExerciseName: state.exercises[0]?.exerciseName ?? null,
  };
}

const WorkoutSessionContext = createContext<WorkoutSessionContextValue | undefined>(undefined);

/**
 * Tracks whether a workout is in progress so the minimized bar can surface it
 * on every screen. Backed by the persisted session so it survives restarts.
 */
export function WorkoutSessionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<WorkoutSessionSummary | null>(null);

  const refresh = useCallback(() => {
    loadWorkoutSession().then(state => setActive(state ? summarize(state) : null));
  }, []);

  // Restore any session persisted from a previous run on startup.
  useEffect(() => {
    refresh();
  }, [refresh]);

  const startSession = useCallback((state: WorkoutSessionState) => {
    setActive(summarize(state));
  }, []);

  const endSession = useCallback(() => {
    setActive(null);
  }, []);

  const value = useMemo(
    () => ({ active, startSession, endSession, refresh }),
    [active, startSession, endSession, refresh],
  );

  return (
    <WorkoutSessionContext.Provider value={value}>{children}</WorkoutSessionContext.Provider>
  );
}

export function useWorkoutSessionContext(): WorkoutSessionContextValue {
  const context = useContext(WorkoutSessionContext);
  if (!context) {
    throw new Error('useWorkoutSessionContext must be used within a WorkoutSessionProvider');
  }
  return context;
}
