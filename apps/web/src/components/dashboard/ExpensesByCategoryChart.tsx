import type { Transaction } from '@/services/transactions';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/card';

interface ExpensesByCategoryChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#f97316',
  '#d946ef',
  '#0d9488',
];

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  index: number;
  name: string;
  totalExpenses: number;
}

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
  index,
  name,
  totalExpenses,
}: CustomLabelProps) => {
  if (index >= 3) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="500"
    >
      {`${name}: ${((value / totalExpenses) * 100).toFixed(0)}%`}
    </text>
  );
};

export function ExpensesByCategoryChart({ transactions }: ExpensesByCategoryChartProps) {
  // Filtrar apenas despesas e agrupar por categoria
  const expensesByCategory = transactions
    .filter((t) => t.type === 'EXPENSE' && t.status !== 'CANCELED')
    .reduce(
      (acc, transaction) => {
        const categoryId = transaction.categoryId || 'Sem Categoria';
        const description = transaction.description || categoryId;
        const existing = acc.find((item) => item.name === description);

        if (existing) {
          existing.value += transaction.amount;
        } else {
          acc.push({
            name: description,
            value: transaction.amount,
          });
        }

        return acc;
      },
      [] as Array<{ name: string; value: number }>,
    )
    .sort((a, b) => b.value - a.value);

  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + item.value, 0);

  if (expensesByCategory.length === 0) {
    return (
      <div className="w-full h-80 bg-white rounded-lg shadow p-6 flex items-center justify-center">
        <p className="text-gray-500">Nenhuma despesa registrada no período</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4 px-6">Despesas por Categoria</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expensesByCategory}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props) => <CustomLabel {...props} totalExpenses={totalExpenses} />}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {expensesByCategory.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
            contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
          />
          {/* <Legend /> */}
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
