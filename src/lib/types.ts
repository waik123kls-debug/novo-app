// Types for AWARDFIT Calorie Tracker

export interface User {
  id: string;
  name: string;
  email: string;
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dailyCalorieGoal: number;
  isPremium?: boolean;
  fitnessProfile?: FitnessProfile;
  quizCompleted?: boolean;
}

export interface FitnessProfile {
  goal: 'lose-weight' | 'gain-muscle' | 'maintain' | 'improve-health';
  experience: 'beginner' | 'intermediate' | 'advanced';
  workoutFrequency: '0-1' | '2-3' | '4-5' | '6-7';
  dietPreference: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  motivation: string;
  challenges: string[];
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface Exercise {
  id: string;
  name: string;
  caloriesBurned: number;
  duration: number; // in minutes
  time: string;
  date: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports';
}

export interface DailyLog {
  date: string;
  meals: Meal[];
  exercises: Exercise[];
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number;
  netCalories: number;
  water: number; // in ml
  weight?: number;
}

export interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface QuizAnswer {
  question: string;
  answer: string;
}
