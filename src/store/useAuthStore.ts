import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SessaoUsuario } from '@/types';

interface AuthStore {
  sessao: SessaoUsuario | null;
  estaAutenticado: boolean;
  definirSessao: (sessao: SessaoUsuario) => void;
  limparSessao: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      sessao: null,
      estaAutenticado: false,
      definirSessao: (sessao) => set({ sessao, estaAutenticado: true }),
      limparSessao: () => set({ sessao: null, estaAutenticado: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
