import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TransactionModal } from '@/components/ui/transaction-modal';
import { DashboardFilters, type PeriodFilter } from '@/components/dashboard/DashboardFilters';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { WalletsOverview } from '@/components/dashboard/WalletsOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { transactionsApi, type Transaction } from '@/services/transactions';
import { walletsApi, type Wallet } from '@/services/wallets';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('current-month');
  const [selectedWallet, setSelectedWallet] = useState<string>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const { showError } = useToast();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [transactionsData, walletsData] = await Promise.all([
        transactionsApi.getAll(),
        walletsApi.getAll(),
      ]);
      setTransactions(transactionsData);
      setWallets(walletsData);
    } catch {
      showError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Calcular período baseado no filtro
  const getPeriodDates = () => {
    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case 'last-7-days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last-30-days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'current-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getPeriodDates();

  // Filtrar transações por período e carteira
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const inPeriod = transactionDate >= startDate && transactionDate <= endDate;
    const inWallet = selectedWallet === 'all' || t.walletId === selectedWallet;
    return inPeriod && inWallet && t.status !== 'CANCELED';
  });

  // Calcular métricas
  const income = filteredTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = income - expenses;

  // Preparar dados de carteiras com resumo
  const walletsWithSummary = wallets.map((wallet) => {
    const walletTransactions = filteredTransactions.filter((t) => t.walletId === wallet.id);
    const walletIncome = walletTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const walletExpenses = walletTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calcular saldo atual: initialBalance + todas as transações até agora
    const allWalletTransactions = transactions.filter((t) => t.walletId === wallet.id);
    const balance =
      wallet.initialBalance +
      allWalletTransactions.reduce((sum, t) => {
        if (t.type === 'INCOME') return sum + t.amount;
        if (t.type === 'EXPENSE') return sum - t.amount;
        return sum;
      }, 0);

    return {
      id: wallet.id,
      name: wallet.name,
      balance,
      type: wallet.walletType,
      currency: wallet.currency,
      income: walletIncome,
      expenses: walletExpenses,
    };
  });

  const totalBalance = walletsWithSummary
    .filter((w) => selectedWallet === 'all' || w.id === selectedWallet)
    .reduce((sum, w) => sum + w.balance, 0);

  // Últimas 10 transações
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  if (loading) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral das suas finanças</p>
        </div>

        {/* Filtros */}
        <DashboardFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedWallet={selectedWallet}
          onWalletChange={setSelectedWallet}
          wallets={wallets.map((w) => ({ id: w.id, name: w.name }))}
          onNewTransaction={() => setIsTransactionModalOpen(true)}
          onNewTransfer={() => setIsTransactionModalOpen(true)}
          onNewWallet={() => void navigate('/wallets')}
        />

        {/* Cards de Resumo */}
        <SummaryCards
          totalBalance={totalBalance}
          income={income}
          expenses={expenses}
          savings={savings}
        />

        {/* Carteiras */}
        <WalletsOverview
          wallets={walletsWithSummary}
          onAddTransaction={() => setIsTransactionModalOpen(true)}
        />

        {/* Últimas Transações */}
        <RecentTransactions transactions={recentTransactions} />
      </div>

      {/* Modal de Transação */}
      <TransactionModal
        open={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </MainLayout>
  );
}
