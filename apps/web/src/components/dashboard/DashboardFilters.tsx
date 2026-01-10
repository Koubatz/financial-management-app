import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Option } from '@/components/ui/option';
import { Plus, Calendar, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';

export type PeriodFilter = 'current-month' | 'last-7-days' | 'last-30-days' | 'custom';

interface DashboardFiltersProps {
  selectedPeriod: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
  selectedWallet?: string;
  onWalletChange: (walletId: string) => void;
  wallets: Array<{ id: string; name: string }>;
  onNewTransaction?: () => void;
  onNewTransfer?: () => void;
  onNewWallet?: () => void;
}

export function DashboardFilters({
  selectedPeriod,
  onPeriodChange,
  selectedWallet,
  onWalletChange,
  wallets,
  onNewTransaction,
  onNewTransfer,
  onNewWallet,
}: DashboardFiltersProps) {
  const periods: { value: PeriodFilter; label: string }[] = [
    { value: 'current-month', label: 'Mês atual' },
    { value: 'last-7-days', label: 'Últimos 7 dias' },
    { value: 'last-30-days', label: 'Últimos 30 dias' },
  ];

  return (
    <Card className="p-4 border-slate-200" accentColor="transparent">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Período */}
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-600" />
            <Select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value as PeriodFilter)}
            >
              {periods.map((period) => (
                <Option key={period.value} value={period.value}>
                  {period.label}
                </Option>
              ))}
            </Select>
          </div>

          {/* Carteira */}
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-slate-600" />
            <Select
              value={selectedWallet || 'all'}
              onChange={(e) => onWalletChange(e.target.value)}
            >
              <Option value="all">Todas as carteiras</Option>
              {wallets.map((wallet) => (
                <Option key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="flex gap-2">
          <Button size="sm" onClick={onNewTransaction} className="gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Nova Transação</span>
          </Button>
          <Button size="sm" variant="outline" onClick={onNewTransfer} className="gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Transferência</span>
          </Button>
          <Button size="sm" variant="outline" onClick={onNewWallet} className="gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">Carteira</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
