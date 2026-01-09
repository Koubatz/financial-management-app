import { useEffect, useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { transactionsApi, type Transaction } from '@/services/transactions';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { theme } from '@/config/theme';

type FilterType = 'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER';
type FilterStatus = 'ALL' | 'COMPLETED' | 'PENDING' | 'CANCELED';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const { showError } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transactionsApi.getAllPaginated({
        page,
        limit,
        type: filterType === 'ALL' ? undefined : filterType,
        status: filterStatus === 'ALL' ? undefined : filterStatus,
      });
      setTransactions(response.data);
      setTotal(response.total);
      setPages(response.pages);
    } catch {
      showError('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterType, filterStatus, showError]);

  useEffect(() => {
    setPage(1);
  }, [filterType, filterStatus]);

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const allTransactionsForSummary = transactions;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INCOME':
        return <ArrowDownCircle size={24} className="text-emerald-500" />;
      case 'EXPENSE':
        return <ArrowUpCircle size={24} className="text-red-500" />;
      case 'TRANSFER':
        return <ArrowRightLeft size={24} className="text-sky-500" />;
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
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || ''}`}
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
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      INCOME: 'Receita',
      EXPENSE: 'Despesa',
      TRANSFER: 'Transferência',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const totalIncome = allTransactionsForSummary
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = allTransactionsForSummary
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  if (loading && page === 1) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
            <p className="text-gray-600 mt-1">Acompanhe todas as suas movimentações financeiras</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card accentColor={theme.colors.status.success}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-emerald-600" />
                  Receitas
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
              <p className="text-sm text-slate-600 mt-2">
                {allTransactionsForSummary.filter((t) => t.type === 'INCOME').length} transações
              </p>
            </CardContent>
          </Card>

          <Card accentColor="#EF4444">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown size={20} className="text-red-600" />
                  Despesas
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
              <p className="text-sm text-slate-600 mt-2">
                {allTransactionsForSummary.filter((t) => t.type === 'EXPENSE').length} transações
              </p>
            </CardContent>
          </Card>

          <Card accentColor={theme.colors.primary}>
            <CardHeader>
              <CardTitle className="text-blue-600">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {formatCurrency(balance)}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                {balance >= 0 ? 'Superávit' : 'Déficit'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card accentColor="transparent" className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Tipo de Transação</p>
              <div className="flex gap-2 flex-wrap">
                {(['ALL', 'INCOME', 'EXPENSE', 'TRANSFER'] as FilterType[]).map((type) => (
                  <Button
                    key={type}
                    onClick={() => setFilterType(type)}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                  >
                    {type === 'ALL' ? 'Todas' : getTypeLabel(type)}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Status</p>
              <div className="flex gap-2 flex-wrap">
                {(['ALL', 'COMPLETED', 'PENDING', 'CANCELED'] as FilterStatus[]).map((status) => (
                  <Button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                  >
                    {status === 'ALL' ? 'Todos' : status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card accentColor="transparent" className="border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>
                Listagem de Transações
                <span className="text-sm font-normal text-slate-600 ml-2">({total})</span>
              </CardTitle>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">Nenhuma transação encontrada</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                      {/* Left Section - Icon and Description */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg">
                          {getTypeIcon(transaction.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-slate-900 font-semibold truncate">
                              {transaction.description}
                            </h3>
                            {transaction.installmentNumber && transaction.totalInstallments && (
                              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded whitespace-nowrap">
                                {transaction.installmentNumber}/{transaction.totalInstallments}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-600">{formatDate(transaction.date)}</p>
                            {transaction.tags && transaction.tags.length > 0 && (
                              <div className="flex gap-1">
                                {transaction.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Amount and Status */}
                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-lg font-bold ${
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
                          <div className="mt-2">{getStatusBadge(transaction.status)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      Página <span className="font-semibold text-slate-900">{page}</span> de{' '}
                      <span className="font-semibold text-slate-900">{pages}</span>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1 || loading}
                      >
                        <ChevronLeft size={16} className="mr-1" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(pages, page + 1))}
                        disabled={page === pages || loading}
                      >
                        Próxima
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
