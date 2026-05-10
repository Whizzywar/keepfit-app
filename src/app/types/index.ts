export interface MacroData {
  current: number;
  target: number;
  unit: string;
  color: string;
}

export interface DailyLog {
  meal: string;
  kcal: number;
  title: string;
  desc: string;
  p: number;
  c: number;
  f: number;
}

export interface Workout {
  id: string;
  name: string;
  duration: number; // minutes
  type: "HIIT" | "Strength" | "Yoga" | "Cardio";
  intensity: "Low" | "Moderate" | "High";
  completed?: boolean;
}

export interface UserProgress {
  streak: number;
  weeklySessions: number;
  totalCalories: number;
  activeMinutes: number;
}
