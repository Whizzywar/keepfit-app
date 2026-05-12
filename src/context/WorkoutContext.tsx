import React, { createContext, useContext, useState, ReactNode } from "react";
import { Workout } from "@/app/types";

interface WorkoutContextType {
  activeWorkout: Workout | null;
  startWorkout: (workout: Workout) => void;
  finishWorkout: () => void;
  currentStreak: number;
  incrementStreak: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [currentStreak, setCurrentStreak] = useState(12);

  const startWorkout = (workout: Workout) => setActiveWorkout(workout);
  const finishWorkout = () => setActiveWorkout(null);
  const incrementStreak = () => setCurrentStreak((prev) => prev + 1);

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        startWorkout,
        finishWorkout,
        currentStreak,
        incrementStreak,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context)
    throw new Error("useWorkout must be used within WorkoutProvider");
  return context;
};
