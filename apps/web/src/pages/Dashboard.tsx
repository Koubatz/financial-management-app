import { lazy, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ManageCardsSection } from '@/components/layout/ManageCardsSection';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { theme } from '@/config/theme';
import { ChevronsUp } from 'lucide-react';

// Lazy load chart components to reduce initial bundle
const ChartSection = lazy(() => import('@/components/dashboard/ChartSection'));

export function DashboardPage() {
  // const profile = useAuthStore((state) => state.profile);
  // const loading = useAuthStore((state) => state.loading);
  // const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const fetchProfile = async () => {
  //       setLoading(true);
  //       try {
  //         const userProfile = await getProfile(token);
  //         setProfile(userProfile);
  //       } catch (error) {
  //         console.error('Failed to fetch profile', error);
  //         localStorage.removeItem('token');
  //         await navigate('/login');
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     void fetchProfile();
  //   } else {
  //     // No token, redirect to login
  //     void navigate('/login');
  //   }
  // }, [navigate]);

  // const handleLogout = async () => {
  //   localStorage.removeItem('token');
  //   await navigate('/login');
  // };

  const data = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
    { name: 'Jul', revenue: 3490, expenses: 4300 },
  ];

  // const chartConfig = {
  //   revenue: { label: 'Revenue', color: theme.colors.chart.revenue },
  //   expenses: { label: 'Expenses', color: theme.colors.chart.expenses },
  // };

  // if (true) {
  //   return (
  //     <div className="flex w-full h-full items-center justify-center py-16">
  //       <LoadingSpinner size={100} />
  //     </div>
  //   );
  // }

  // if (!profile) {
  //   return null;
  // }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-4">
        <Card accentColor={theme.colors.accent}>
          <CardHeader className="font-semibold text-lg">Renda total</CardHeader>
          <CardContent className="mt-4">
            <div className="flex gap-4">
              <span className="text-xl font-bold">R$12.345,67</span>
              <div className="flex p-1 gap-1 rounded-md bg-green-500/20">
                <ChevronsUp className="font-medium text-green-800" />
                <span className="font-medium text-green-800">57%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <span className="text-sm text-muted-foreground">
              Aumentou em relação ao mês anterior
            </span>
          </CardFooter>
        </Card>

        <ManageCardsSection />
      </div>

      <div className="grid grid-cols-2 pt-2">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64 border rounded-md">
              <LoadingSpinner />
            </div>
          }
        >
          <ChartSection data={data} />
        </Suspense>
      </div>
    </MainLayout>
  );
}
