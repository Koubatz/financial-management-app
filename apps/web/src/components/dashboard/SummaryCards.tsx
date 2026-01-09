import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard } from 'lucide-react';
import { theme } from '@/config/theme';

interface SummaryCardsProps {
  totalBalance: number;
  income: number;
  expenses: number;
  savings: number;
  creditCardTotal?: number;
  previousIncome?: number;
  previousExpenses?: number;
}

export function SummaryCards({
  totalBalance,
  income,
  expenses,
  savings,
  creditCardTotal,
  previousIncome,
  previousExpenses,
}: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPercentageChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const incomeChange = getPercentageChange(income, previousIncome);
  const expensesChange = getPercentageChange(expenses, previousExpenses);
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Saldo Total */}
      <Card accentColor={theme.colors.primary}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Wallet size={20} />
            Saldo Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalBalance)}</p>
          <p className="text-sm text-slate-600 mt-2">Todas as carteiras</p>
        </CardContent>
      </Card>

      {/* Receitas */}
      <Card accentColor={theme.colors.status.success}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <TrendingUp size={20} />
            Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(income)}</p>
          {incomeChange !== null && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-sm font-medium ${incomeChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {incomeChange >= 0 ? '+' : ''}
                {incomeChange.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-600">vs período anterior</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Despesas */}
      <Card accentColor="#EF4444">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <TrendingDown size={20} />
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">{formatCurrency(expenses)}</p>
          {expensesChange !== null && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-sm font-medium ${expensesChange >= 0 ? 'text-red-600' : 'text-emerald-600'}`}
              >
                {expensesChange >= 0 ? '+' : ''}
                {expensesChange.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-600">vs período anterior</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Economia */}
      <Card accentColor={savings >= 0 ? theme.colors.status.success : '#EF4444'}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <PiggyBank size={20} />
            Economia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-3xl font-bold ${savings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(savings)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-slate-700">
              {savingsRate.toFixed(1)}% das receitas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Gastos no Cartão (opcional) */}
      {creditCardTotal !== undefined && (
        <Card accentColor="#8B5CF6" className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <CreditCard size={20} />
              Cartão de Crédito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(creditCardTotal)}</p>
            <p className="text-sm text-slate-600 mt-2">Fatura do mês</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
