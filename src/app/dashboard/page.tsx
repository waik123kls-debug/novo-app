'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Dumbbell, LogOut, Loader2, User, Mail } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser(authUser);

      // Buscar perfil do usuário
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AWARDFIT
              </h1>
              <p className="text-xs text-gray-600">Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo, {profile?.display_name || 'Usuário'}! 🎉
          </h2>
          <p className="text-gray-600">
            Você está autenticado e pronto para começar sua jornada fitness.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-lg p-8 text-white">
          <h3 className="text-xl font-bold mb-6">Informações da Conta</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <User className="w-5 h-5" />
              <div>
                <p className="text-sm opacity-75">Nome de Exibição</p>
                <p className="font-semibold">{profile?.display_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <Mail className="w-5 h-5" />
              <div>
                <p className="text-sm opacity-75">Email</p>
                <p className="font-semibold">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Próximos Passos</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Complete seu perfil fitness</p>
                <p className="text-sm text-gray-600">Adicione suas informações e objetivos</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Registre sua primeira refeição</p>
                <p className="text-sm text-gray-600">Comece a acompanhar suas calorias</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Adicione seus exercícios</p>
                <p className="text-sm text-gray-600">Monitore suas atividades físicas</p>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
