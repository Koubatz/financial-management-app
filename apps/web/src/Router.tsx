import { LoginPage } from '@/pages/Login';
import { ThemeShowcase } from '@/pages/ThemeShowcase';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function Root() {
  const token = localStorage.getItem('token');
  return <Navigate to={token ? '/dashboard' : '/login'} replace />;
}

export function Router() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
