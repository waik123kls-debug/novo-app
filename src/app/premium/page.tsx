'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, saveUser } from '@/lib/storage';
import { 
  Crown, 
  Check, 
  Sparkles, 
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  Users,
  Zap,
  Lock,
  ChevronRight,
  Star,
  Award
} from 'lucide-react';

export default function PremiumPage() {
  const router = useRouter();
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSubscribe = async () => {
    setLoading(true);
    
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (user) {
      user.isPremium = true;
      saveUser(user);
      setUser(user);
      router.push('/');
    }
    
    setLoading(false);
  };

  const premiumFeatures = [
    {
      icon: BarChart3,
      title: 'Análises Avançadas',
      description: 'Gráficos detalhados de progresso e tendências',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Planos Personalizados',
      description: 'Treinos e dietas customizados para seu perfil',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Planejamento Semanal',
      description: 'Organize suas refeições e treinos com antecedência',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Comunidade Premium',
      description: 'Acesso exclusivo a grupos e desafios',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Receitas Premium',
      description: 'Mais de 500 receitas saudáveis e nutritivas',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Award,
      title: 'Suporte Prioritário',
      description: 'Atendimento VIP e respostas rápidas',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const freeFeatures = [
    'Contador de calorias básico',
    'Registro de refeições',
    'Registro de exercícios',
    'Acompanhamento de água',
    'Histórico de 7 dias'
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mb-6 shadow-2xl">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Desbloqueie Todo o Potencial
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Transforme sua jornada fitness com recursos exclusivos e alcance seus objetivos mais rápido
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Premium Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-bl-2xl font-bold flex items-center gap-2">
              <Star className="w-4 h-4" />
              POPULAR
            </div>

            <div className="text-center mb-8 mt-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Premium
              </h2>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  R$ 19,99
                </span>
                <span className="text-gray-600">/mês</span>
              </div>
              <p className="text-gray-600">
                Cancele quando quiser • Sem compromisso
              </p>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Assinar Agora
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              💳 Pagamento seguro • 🔒 Dados protegidos
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {premiumFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-purple-100">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Compare os Planos
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-800">Plano Gratuito</h3>
              </div>
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            {/* Premium Plan */}
            <div className="space-y-4 relative">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                RECOMENDADO
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Plano Premium
                </h3>
              </div>
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-purple-600">+ Recursos Exclusivos:</span>
                </div>
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 mb-2">
                    <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/')}
            className="text-white hover:text-purple-200 transition-colors underline"
          >
            Continuar com plano gratuito
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
