import type { Transaction } from '@/services/transactions';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../ui/card';

interface TransactionHistoryChartProps {
  transactions: Transaction[];
}

export function TransactionHistoryChart({ transactions }: TransactionHistoryChartProps) {
  // Agrupar transações por data e calcular acumulado
  const chartData = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce(
      (acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString('pt-BR');
        const existing = acc.find((item) => item.date === date);

        if (existing) {
          if (transaction.type === 'INCOME') {
            existing.income += transaction.amount;
          } else if (transaction.type === 'EXPENSE') {
            existing.expenses += transaction.amount;
          }
        } else {
          acc.push({
            date,
            income: transaction.type === 'INCOME' ? transaction.amount : 0,
            expenses: transaction.type === 'EXPENSE' ? transaction.amount : 0,
          });
        }

        return acc;
      },
      [] as Array<{ date: string; income: number; expenses: number }>,
    );

  return (
    <Card className="w-full h-100">
      <h2 className="text-xl font-bold text-gray-900 px-4">Histórico de Transações</h2>
      <ResponsiveContainer width="100%" height="100%" className="min-h-[300px] p-8">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
            contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            name="Receita"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            name="Despesa"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
