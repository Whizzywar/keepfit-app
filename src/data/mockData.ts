import { DailyLog, Workout } from "../types/index";

export const dailyLogs: DailyLog[] = [
  {
    meal: "Breakfast",
    kcal: 420,
    title: "Avocado Toast",
    desc: "Sourdough, Avocado, 2 Poached Eggs, Chili Flakes",
    p: 18,
    c: 34,
    f: 22,
  },
  {
    meal: "Lunch",
    kcal: 580,
    title: "Quinoa Bowl",
    desc: "Grilled Chicken, Quinoa, Kale, Roasted Chickpeas",
    p: 42,
    c: 56,
    f: 14,
  },
];

export const workouts: Workout[] = [
  {
    id: "1",
    name: "Advanced Power Strength",
    duration: 45,
    type: "Strength",
    intensity: "High",
  },
  {
    id: "2",
    name: "15-min Morning HIIT",
    duration: 15,
    type: "HIIT",
    intensity: "High",
  },
  {
    id: "3",
    name: "Full Body Strength",
    duration: 30,
    type: "Strength",
    intensity: "Moderate",
  },
];
