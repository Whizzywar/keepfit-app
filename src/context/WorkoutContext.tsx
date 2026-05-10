import React from "react";

export interface UserStats {
  totalCalories: number;
  totalMinutes: number;
  totalWorkouts: number;
  todayCalories: number;
}

export interface WorkoutHistoryItem {
  name: string;
  category: string;
  calories: number;
  duration: number;
  date: Date;
}

interface WorkoutContextType {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  workoutHistory: WorkoutHistoryItem[];
  addCompletedWorkout: (workout: WorkoutHistoryItem) => void;
}

export const WorkoutContext = React.createContext<WorkoutContextType>({
  userStats: {
    totalCalories: 0,
    totalMinutes: 0,
    totalWorkouts: 0,
    todayCalories: 0,
  },
  setUserStats: () => {},
  workoutHistory: [],
  addCompletedWorkout: () => {},
});
