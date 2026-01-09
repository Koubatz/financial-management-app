import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WalletSummary {
  id: string;
  name: string;
  balance: number;
  type: string;
  currency: string;
  income: number;
  expenses: number;
}

interface WalletsOverviewProps {
  wallets: WalletSummary[];
  onAddTransaction?: (walletId: string) => void;
}

export function WalletsOverview({ wallets, onAddTransaction }: WalletsOverviewProps) {
  const navigate = useNavigate();

  const formatCurrency = (value: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(value);
  };

  const getWalletIcon = (type: string) => {
    if (type === 'CREDIT_CARD') {
      return <CreditCard size={20} />;
    }
    return <Wallet size={20} />;
  };

  return (
    <Card accentColor="transparent" className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Minhas Carteiras</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void navigate('/wallets')}
            className="gap-2"
          >
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="p-4 border border-slate-200 rounded-lg bg-gradient-to-br from-slate-50 to-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {getWalletIcon(wallet.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{wallet.name}</h4>
                    <p className="text-xs text-slate-600 uppercase">
                      {wallet.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-slate-600 mb-1">Saldo Atual</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 pt-3 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Receitas</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(wallet.income, wallet.currency)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Despesas</p>
                  <div className="flex items-center gap-1">
                    <TrendingDown size={14} className="text-red-600" />
                    <p className="text-sm font-semibold text-red-600">
                      {formatCurrency(wallet.expenses, wallet.currency)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onAddTransaction?.(wallet.id)}
                >
                  <Plus size={14} className="mr-1" />
                  Adicionar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => void navigate(`/wallets?id=${wallet.id}`)}
                >
                  Detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
