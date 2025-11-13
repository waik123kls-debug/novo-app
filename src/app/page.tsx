'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/storage';
import { useCalories } from '@/hooks/useCalories';
import { 
  Flame, 
  TrendingDown, 
  Activity, 
  Droplet, 
  Plus, 
  Camera, 
  Barcode,
  Coffee,
  UtensilsCrossed,
  Moon,
  Apple,
  Dumbbell,
  Target,
  Calendar,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  Lock,
  TrendingUp,
  Award
} from 'lucide-react';
import { Meal, Exercise } from '@/lib/types';
import { clearUser } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const { user, dailyLog, loading, addMeal, addExercise, updateWater, deleteMeal, deleteExercise } = useCalories(currentDate);
  
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && !user.quizCompleted) {
      router.push('/quiz');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (dailyLog) {
      setWaterGlasses(Math.floor(dailyLog.water / 250));
    }
  }, [dailyLog]);

  if (loading || !user || !dailyLog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const caloriesRemaining = user.dailyCalorieGoal - dailyLog.netCalories;
  const progressPercentage = Math.min((dailyLog.totalCaloriesConsumed / user.dailyCalorieGoal) * 100, 100);

  const handleAddMeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const meal: Meal = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      calories: parseInt(formData.get('calories') as string),
      protein: parseInt(formData.get('protein') as string),
      carbs: parseInt(formData.get('carbs') as string),
      fat: parseInt(formData.get('fat') as string),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: mealType,
      date: currentDate,
    };

    addMeal(meal);
    setShowAddMeal(false);
    form.reset();
  };

  const handleAddExercise = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const exercise: Exercise = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      caloriesBurned: parseInt(formData.get('calories') as string),
      duration: parseInt(formData.get('duration') as string),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: currentDate,
      type: formData.get('type') as any,
    };

    addExercise(exercise);
    setShowAddExercise(false);
    form.reset();
  };

  const handleWaterClick = () => {
    const newGlasses = waterGlasses + 1;
    setWaterGlasses(newGlasses);
    updateWater(newGlasses * 250);
  };

  const handleLogout = () => {
    clearUser();
    router.push('/login');
  };

  const changeDate = (days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  const handlePremiumFeature = () => {
    if (!user.isPremium) {
      setShowPremiumModal(true);
    }
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return <Coffee className="w-5 h-5" />;
      case 'lunch': return <UtensilsCrossed className="w-5 h-5" />;
      case 'dinner': return <Moon className="w-5 h-5" />;
      case 'snack': return <Apple className="w-5 h-5" />;
      default: return <UtensilsCrossed className="w-5 h-5" />;
    }
  };

  const getMealLabel = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Café da Manhã';
      case 'lunch': return 'Almoço';
      case 'dinner': return 'Jantar';
      case 'snack': return 'Lanche';
      default: return 'Refeição';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCompare = new Date(date);
    dateToCompare.setHours(0, 0, 0, 0);

    if (dateToCompare.getTime() === today.getTime()) return 'Hoje';
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateToCompare.getTime() === yesterday.getTime()) return 'Ontem';

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getMotivationalMessage = () => {
    if (!user.fitnessProfile) return '';
    
    const { goal } = user.fitnessProfile;
    const messages = {
      'lose-weight': '🔥 Foco na queima de calorias!',
      'gain-muscle': '💪 Construindo músculos!',
      'maintain': '⚖️ Mantendo o equilíbrio!',
      'improve-health': '❤️ Saúde em primeiro lugar!'
    };
    
    return messages[goal] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AWARDFIT
              </h1>
              <p className="text-xs text-gray-600">Olá, {user.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!user.isPremium && (
              <button
                onClick={() => router.push('/premium')}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Premium
              </button>
            )}
            {user.isPremium && (
              <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Motivational Banner */}
        {user.fitnessProfile && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 mb-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg">{getMotivationalMessage()}</div>
                <div className="text-sm opacity-90">Continue assim, você está no caminho certo!</div>
              </div>
            </div>
            <Sparkles className="w-6 h-6" />
          </div>
        )}

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-4 shadow-sm">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-gray-800">{formatDate(currentDate)}</span>
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={currentDate === new Date().toISOString().split('T')[0]}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calorie Summary Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 mb-6 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6" />
              <span className="text-sm opacity-90">Calorias Restantes</span>
            </div>
            <Target className="w-5 h-5 opacity-75" />
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">
              {caloriesRemaining > 0 ? caloriesRemaining : 0}
            </div>
            <div className="text-sm opacity-90">
              Meta: {user.dailyCalorieGoal} cal/dia
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{dailyLog.totalCaloriesConsumed}</div>
              <div className="text-xs opacity-75">Consumidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{dailyLog.totalCaloriesBurned}</div>
              <div className="text-xs opacity-75">Queimadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{dailyLog.netCalories}</div>
              <div className="text-xs opacity-75">Líquidas</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Premium Features Preview */}
        {!user.isPremium && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handlePremiumFeature}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-2 right-2">
                <Crown className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-bold text-lg">Análises Avançadas</div>
                  <div className="text-sm opacity-90">Gráficos e tendências detalhadas</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm">
                <Lock className="w-4 h-4" />
                <span>Desbloqueie com Premium</span>
              </div>
            </button>

            <button
              onClick={handlePremiumFeature}
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="absolute top-2 right-2">
                <Crown className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-bold text-lg">Planos Personalizados</div>
                  <div className="text-sm opacity-90">Treinos e dietas customizados</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm">
                <Lock className="w-4 h-4" />
                <span>Desbloqueie com Premium</span>
              </div>
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowAddMeal(true)}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-3 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Adicionar Refeição</span>
          </button>

          <button
            onClick={() => setShowAddExercise(true)}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col items-center gap-3 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Adicionar Exercício</span>
          </button>
        </div>

        {/* Water Tracker */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-800">Hidratação</span>
            </div>
            <span className="text-sm text-gray-600">{waterGlasses * 250}ml / 2000ml</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[...Array(8)].map((_, i) => (
              <button
                key={i}
                onClick={handleWaterClick}
                className={`w-12 h-12 rounded-xl transition-all ${
                  i < waterGlasses
                    ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Droplet className={`w-6 h-6 mx-auto ${i < waterGlasses ? 'text-white' : 'text-gray-400'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Meals List */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
            Refeições de Hoje
          </h2>
          
          {dailyLog.meals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma refeição registrada ainda</p>
          ) : (
            <div className="space-y-3">
              {dailyLog.meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                      {getMealIcon(meal.type)}
                      <span className="text-white text-xs"></span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{meal.name}</div>
                      <div className="text-xs text-gray-500">
                        {getMealLabel(meal.type)} • {meal.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{meal.calories} cal</div>
                      <div className="text-xs text-gray-500">
                        P: {meal.protein}g • C: {meal.carbs}g • G: {meal.fat}g
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exercises List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Exercícios de Hoje
          </h2>
          
          {dailyLog.exercises.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum exercício registrado ainda</p>
          ) : (
            <div className="space-y-3">
              {dailyLog.exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{exercise.name}</div>
                      <div className="text-xs text-gray-500">
                        {exercise.duration} min • {exercise.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-blue-600">-{exercise.caloriesBurned} cal</div>
                    </div>
                    <button
                      onClick={() => deleteExercise(exercise.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}\n            </div>
          )}
        </div>
      </main>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Adicionar Refeição</h2>
              <button
                onClick={() => setShowAddMeal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Refeição</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMealType(type)}
                      className={`p-3 rounded-xl font-medium transition-all ${
                        mealType === type
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {getMealLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Alimento</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Ex: Arroz com frango"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calorias</label>
                  <input
                    type="number"
                    name="calories"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="350"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proteína (g)</label>
                  <input
                    type="number"
                    name="protein"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carboidratos (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gordura (g)</label>
                  <input
                    type="number"
                    name="fat"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Foto
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Barcode className="w-5 h-5" />
                  Código
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Adicionar Refeição
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Adicionar Exercício</h2>
              <button
                onClick={() => setShowAddExercise(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Exercício</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: Corrida"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  name="type"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Força</option>
                  <option value="flexibility">Flexibilidade</option>
                  <option value="sports">Esportes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duração (min)</label>
                  <input
                    type="number"
                    name="duration"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calorias</label>
                  <input
                    type="number"
                    name="calories"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                Adicionar Exercício
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recurso Premium
            </h2>
            <p className="text-gray-600 mb-6">
              Este recurso está disponível apenas para assinantes Premium. Desbloqueie análises avançadas, planos personalizados e muito mais!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => router.push('/premium')}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Ver Planos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
