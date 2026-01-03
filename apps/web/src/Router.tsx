import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoadingSpinner } from './components/ui/loading-spinner';

// Lazy load das páginas para reduzir bundle inicial
const DashboardPage = lazy(() =>
  import('./pages/Dashboard').then((m) => ({ default: m.DashboardPage })),
);
const LoginPage = lazy(() => import('./pages/Login').then((m) => ({ default: m.LoginPage })));
const ThemeShowcase = lazy(() =>
  import('./pages/ThemeShowcase').then((m) => ({ default: m.ThemeShowcase })),
);

// Loading fallback para rotas lazy
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner />
  </div>
);

function Root() {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? '/dashboard' : '/login'} replace />;
}

export function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/theme" element={<ThemeShowcase />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
