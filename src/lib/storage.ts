// Local storage utilities for AWARDFIT

import { User, DailyLog, Meal, Exercise } from './types';

const STORAGE_KEYS = {
  USER: 'awardfit_user',
  DAILY_LOGS: 'awardfit_daily_logs',
  AUTH: 'awardfit_auth',
};

// Auth functions
export const saveAuth = (email: string, password: string) => {
  if (typeof window === 'undefined') return;
  const users = getUsers();
  users[email] = password;
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(users));
};

export const checkAuth = (email: string, password: string): boolean => {
  if (typeof window === 'undefined') return false;
  const users = getUsers();
  return users[email] === password;
};

export const getUsers = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEYS.AUTH);
  return data ? JSON.parse(data) : {};
};

// User functions
export const saveUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const clearUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Daily logs functions
export const saveDailyLog = (log: DailyLog) => {
  if (typeof window === 'undefined') return;
  const logs = getDailyLogs();
  logs[log.date] = log;
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
};

export const getDailyLogs = (): Record<string, DailyLog> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  return data ? JSON.parse(data) : {};
};

export const getDailyLog = (date: string): DailyLog => {
  const logs = getDailyLogs();
  return logs[date] || {
    date,
    meals: [],
    exercises: [],
    totalCaloriesConsumed: 0,
    totalCaloriesBurned: 0,
    netCalories: 0,
    water: 0,
  };
};

export const addMeal = (date: string, meal: Meal) => {
  const log = getDailyLog(date);
  log.meals.push(meal);
  log.totalCaloriesConsumed = log.meals.reduce((sum, m) => sum + m.calories, 0);
  log.netCalories = log.totalCaloriesConsumed - log.totalCaloriesBurned;
  saveDailyLog(log);
};

export const addExercise = (date: string, exercise: Exercise) => {
  const log = getDailyLog(date);
  log.exercises.push(exercise);
  log.totalCaloriesBurned = log.exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
  log.netCalories = log.totalCaloriesConsumed - log.totalCaloriesBurned;
  saveDailyLog(log);
};

export const updateWater = (date: string, amount: number) => {
  const log = getDailyLog(date);
  log.water = amount;
  saveDailyLog(log);
};

export const deleteMeal = (date: string, mealId: string) => {
  const log = getDailyLog(date);
  log.meals = log.meals.filter(m => m.id !== mealId);
  log.totalCaloriesConsumed = log.meals.reduce((sum, m) => sum + m.calories, 0);
  log.netCalories = log.totalCaloriesConsumed - log.totalCaloriesBurned;
  saveDailyLog(log);
};

export const deleteExercise = (date: string, exerciseId: string) => {
  const log = getDailyLog(date);
  log.exercises = log.exercises.filter(e => e.id !== exerciseId);
  log.totalCaloriesBurned = log.exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
  log.netCalories = log.totalCaloriesConsumed - log.totalCaloriesBurned;
  saveDailyLog(log);
};

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
export const calculateBMR = (weight: number, height: number, age: number, gender: string): number => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Calculate TDEE (Total Daily Energy Expenditure)
export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  };
  return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2);
};
