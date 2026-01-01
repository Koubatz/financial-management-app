import { ManageCardsSection } from '@/components/layout/ManageCardsSection';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { theme } from '@/config/theme';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import * as Recharts from 'recharts';
import { ChevronsUp } from 'lucide-react';

export function Dashboard() {
  const data = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
    { name: 'Jul', revenue: 3490, expenses: 4300 },
  ];

  const chartConfig = {
    revenue: { label: 'Revenue', color: theme.colors.chart.revenue },
    expenses: { label: 'Expenses', color: theme.colors.chart.expenses },
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-4">
        <Card accentColor={theme.colors.accent}>
          <CardHeader className="text-2xl font-light tracking-wider">Renda total</CardHeader>
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
        <div className="border rounded-md p-4">
          <div className="mb-2">
            <span className="text-sm font-bold tracking-wide">Seus ativos</span>
          </div>

          <ChartContainer id="overview" config={chartConfig}>
            <Recharts.AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis dataKey="name" />
              <Recharts.YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Recharts.Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="var(--color-revenue)"
                fillOpacity={0.2}
              />
              <Recharts.Area
                type="monotone"
                dataKey="expenses"
                stroke="var(--color-expenses)"
                fill="var(--color-expenses)"
                fillOpacity={0.2}
              />
            </Recharts.AreaChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
