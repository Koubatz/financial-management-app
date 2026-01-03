import { useAuthStore } from '@/data/authStore';
import { authOrchestrator } from '@/services/authOrchestrator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { JSX, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((state) => state.token);
  const initialized = useAuthStore((state) => state.initialized);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    void authOrchestrator.bootstrap();
  }, []);

  if (!initialized || loading) {
    return (
      <div className="flex w-full h-full items-center justify-center mt-40">
        <LoadingSpinner size={120} />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
