import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/Dashboard';
import { getProfile } from './services/auth';

type User = {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      const fetchProfile = async () => {
        try {
          const userProfile = await getProfile(token);
          setProfile(userProfile);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          setToken(null);
          localStorage.removeItem('token');
          void navigate('/login');
        }
      };
      void fetchProfile();
    } else {
      setProfile(null);
    }
  }, [token, navigate]);

  // Redirect to login page when not authenticated
  useEffect(() => {
    if (!loading && !profile) {
      void navigate('/login');
    }
  }, [loading, profile, navigate]);

  return (
    <MainLayout>
      <DashboardPage />
    </MainLayout>
  );
}
