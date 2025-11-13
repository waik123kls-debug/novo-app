'use client';

import { useState, useEffect } from 'react';
import { User, DailyLog, Meal, Exercise } from '@/lib/types';
import { 
  getUser, 
  getDailyLog, 
  addMeal as addMealToStorage,
  addExercise as addExerciseToStorage,
  updateWater as updateWaterInStorage,
  deleteMeal as deleteMealFromStorage,
  deleteExercise as deleteExerciseFromStorage,
} from '@/lib/storage';

export const useCalories = (date: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const userData = getUser();
      const logData = getDailyLog(date);
      setUser(userData);
      setDailyLog(logData);
      setLoading(false);
    };

    loadData();
  }, [date]);

  const addMeal = (meal: Meal) => {
    addMealToStorage(date, meal);
    setDailyLog(getDailyLog(date));
  };

  const addExercise = (exercise: Exercise) => {
    addExerciseToStorage(date, exercise);
    setDailyLog(getDailyLog(date));
  };

  const updateWater = (amount: number) => {
    updateWaterInStorage(date, amount);
    setDailyLog(getDailyLog(date));
  };

  const deleteMeal = (mealId: string) => {
    deleteMealFromStorage(date, mealId);
    setDailyLog(getDailyLog(date));
  };

  const deleteExercise = (exerciseId: string) => {
    deleteExerciseFromStorage(date, exerciseId);
    setDailyLog(getDailyLog(date));
  };

  const refresh = () => {
    setDailyLog(getDailyLog(date));
  };

  return {
    user,
    dailyLog,
    loading,
    addMeal,
    addExercise,
    updateWater,
    deleteMeal,
    deleteExercise,
    refresh,
  };
};
