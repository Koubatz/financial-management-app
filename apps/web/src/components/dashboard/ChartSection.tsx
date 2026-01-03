import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { theme } from '@/config/theme';
import * as Recharts from 'recharts';

interface ChartSectionProps {
  data: Array<{ name: string; revenue: number; expenses: number }>;
}

export default function ChartSection({ data }: ChartSectionProps) {
  const chartConfig = {
    revenue: { label: 'Revenue', color: theme.colors.chart.revenue },
    expenses: { label: 'Expenses', color: theme.colors.chart.expenses },
  };

  return (
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
  );
}
