import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface RotaProtegidaProps {
  children: React.ReactNode;
}

export function RotaProtegida({ children }: RotaProtegidaProps) {
  const { estaAutenticado } = useAuthStore();

  if (!estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
