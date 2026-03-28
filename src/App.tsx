import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Transferencia } from '@/pages/Transferencia';
import { RotaProtegida } from '@/components/RotaProtegida';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store/useAuthStore';

function App() {
  const { estaAutenticado } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              estaAutenticado ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route
            path="/dashboard"
            element={
              <RotaProtegida>
                <Dashboard />
              </RotaProtegida>
            }
          />
          <Route
            path="/transferencia"
            element={
              <RotaProtegida>
                <Transferencia />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
