'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, saveUser } from '@/lib/storage';
import { 
  Target, 
  TrendingUp, 
  Heart, 
  Dumbbell, 
  Calendar,
  Utensils,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Award
} from 'lucide-react';
import { FitnessProfile } from '@/lib/types';

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<FitnessProfile>>({
    challenges: []
  });

  const questions = [
    {
      id: 'goal',
      title: 'Qual é seu principal objetivo?',
      icon: Target,
      options: [
        { value: 'lose-weight', label: 'Perder Peso', emoji: '🔥' },
        { value: 'gain-muscle', label: 'Ganhar Massa Muscular', emoji: '💪' },
        { value: 'maintain', label: 'Manter o Peso', emoji: '⚖️' },
        { value: 'improve-health', label: 'Melhorar Saúde Geral', emoji: '❤️' }
      ]
    },
    {
      id: 'experience',
      title: 'Qual seu nível de experiência com exercícios?',
      icon: TrendingUp,
      options: [
        { value: 'beginner', label: 'Iniciante', description: 'Pouca ou nenhuma experiência' },
        { value: 'intermediate', label: 'Intermediário', description: 'Treino regularmente há alguns meses' },
        { value: 'advanced', label: 'Avançado', description: 'Treino consistentemente há anos' }
      ]
    },
    {
      id: 'workoutFrequency',
      title: 'Quantos dias por semana você pode treinar?',
      icon: Calendar,
      options: [
        { value: '0-1', label: '0-1 dias', description: 'Muito ocupado' },
        { value: '2-3', label: '2-3 dias', description: 'Rotina moderada' },
        { value: '4-5', label: '4-5 dias', description: 'Comprometido' },
        { value: '6-7', label: '6-7 dias', description: 'Totalmente dedicado' }
      ]
    },
    {
      id: 'dietPreference',
      title: 'Qual sua preferência alimentar?',
      icon: Utensils,
      options: [
        { value: 'omnivore', label: 'Onívoro', emoji: '🍖' },
        { value: 'vegetarian', label: 'Vegetariano', emoji: '🥗' },
        { value: 'vegan', label: 'Vegano', emoji: '🌱' },
        { value: 'keto', label: 'Keto/Low-carb', emoji: '🥑' },
        { value: 'paleo', label: 'Paleo', emoji: '🥩' }
      ]
    },
    {
      id: 'challenges',
      title: 'Quais são seus maiores desafios?',
      icon: Heart,
      multiple: true,
      options: [
        { value: 'time', label: 'Falta de tempo', emoji: '⏰' },
        { value: 'motivation', label: 'Falta de motivação', emoji: '😴' },
        { value: 'knowledge', label: 'Falta de conhecimento', emoji: '📚' },
        { value: 'consistency', label: 'Manter consistência', emoji: '🎯' },
        { value: 'diet', label: 'Controlar alimentação', emoji: '🍔' },
        { value: 'energy', label: 'Baixa energia', emoji: '🔋' }
      ]
    }
  ];

  const currentQuestion = questions[step];

  const handleAnswer = (value: string) => {
    if (currentQuestion.multiple) {
      const current = answers.challenges || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers({ ...answers, challenges: updated });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
      
      if (step < questions.length - 1) {
        setTimeout(() => setStep(step + 1), 300);
      }
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      completeQuiz();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const completeQuiz = () => {
    const user = getUser();
    if (user) {
      user.fitnessProfile = answers as FitnessProfile;
      user.quizCompleted = true;
      saveUser(user);
      router.push('/premium');
    }
  };

  const isAnswered = () => {
    if (currentQuestion.multiple) {
      return (answers.challenges || []).length > 0;
    }
    return !!answers[currentQuestion.id as keyof FitnessProfile];
  };

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Descubra seu Perfil Fitness
          </h1>
          <p className="text-gray-600">
            Responda algumas perguntas para personalizarmos sua experiência
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pergunta {step + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <currentQuestion.icon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentQuestion.title}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentQuestion.multiple
                ? (answers.challenges || []).includes(option.value)
                : answers[currentQuestion.id as keyof FitnessProfile] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg scale-[1.02]'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {option.emoji && (
                        <span className="text-3xl">{option.emoji}</span>
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Voltar
            </button>
          )}
          
          {(currentQuestion.multiple || isAnswered()) && (
            <button
              onClick={handleNext}
              disabled={!isAnswered()}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {step === questions.length - 1 ? (
                <>
                  <Award className="w-5 h-5" />
                  Finalizar Quiz
                </>
              ) : (
                <>
                  Próxima
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
