import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, Pencil } from 'lucide-react';
import type { Transaction } from '@/services/transactions';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  onEditClick?: (transaction: Transaction) => void;
}

export function RecentTransactions({
  transactions,
  onTransactionClick,
  onEditClick,
}: RecentTransactionsProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INCOME':
        return <ArrowDownCircle size={20} className="text-emerald-500" />;
      case 'EXPENSE':
        return <ArrowUpCircle size={20} className="text-red-500" />;
      case 'TRANSFER':
        return <ArrowRightLeft size={20} className="text-sky-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      COMPLETED: 'bg-emerald-500/20 text-emerald-600',
      PENDING: 'bg-amber-500/20 text-amber-600',
      CANCELED: 'bg-red-500/20 text-red-600',
    };
    const labels = {
      COMPLETED: 'Completa',
      PENDING: 'Pendente',
      CANCELED: 'Cancelada',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || ''}`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <Card accentColor="transparent" className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle>Últimas Transações</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">Nenhuma transação recente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => onTransactionClick?.(transaction)}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-600">{formatDate(transaction.date)}</p>
                      {transaction.tags && transaction.tags.length > 0 && (
                        <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                          {transaction.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  {getStatusBadge(transaction.status)}
                  <p
                    className={`text-sm font-bold ${
                      transaction.type === 'INCOME'
                        ? 'text-emerald-600'
                        : transaction.type === 'EXPENSE'
                          ? 'text-red-600'
                          : 'text-sky-600'
                    }`}
                  >
                    {transaction.type === 'INCOME'
                      ? '+'
                      : transaction.type === 'EXPENSE'
                        ? '-'
                        : ''}
                    {formatCurrency(transaction.amount)}
                  </p>
                  {onEditClick && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(transaction);
                      }}
                      className="flex-shrink-0 h-8 w-8"
                    >
                      <Pencil size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
