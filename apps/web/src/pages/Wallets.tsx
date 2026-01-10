import { useCallback, useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { WalletCard } from '@/components/ui/wallet-card';
import { WalletModal, type WalletFormData } from '@/components/ui/wallet-modal';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  walletsApi,
  type Wallet,
  type CreateWalletDto,
  type UpdateWalletDto,
} from '@/services/wallets';
import { transactionsApi, type Transaction } from '@/services/transactions';
import { useToast } from '@/hooks/useToast';
import { Plus, Wallet as WalletIcon } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [archiveWallet, setArchiveWallet] = useState<Wallet | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [selectedWalletTransactions, setSelectedWalletTransactions] = useState<Wallet | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const { showSuccess, showError } = useToast();

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await walletsApi.getAll();
      setWallets(data);
    } catch {
      showError('Erro ao carregar carteiras');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void fetchWallets();
  }, [fetchWallets]);

  const handleCreate = async (data: WalletFormData) => {
    try {
      const payload: CreateWalletDto = {
        name: data.name,
        walletType: data.walletType,
        currency: data.currency,
        initialBalance: parseFloat(data.initialBalance),
        description: data.description,
        institution: data.institution,
        isPrimary: data.isPrimary,
        ...(data.walletType === 'CREDIT_CARD' && {
          creditLimit: data.creditLimit ? parseFloat(data.creditLimit) : undefined,
          billingCloseDay: data.billingCloseDay ? parseInt(data.billingCloseDay) : undefined,
          billingDueDay: data.billingDueDay ? parseInt(data.billingDueDay) : undefined,
        }),
        ...(data.walletType === 'BANK' && {
          accountType: data.accountType,
          bankName: data.bankName,
        }),
        digitalWalletProvider: data.digitalWalletProvider,
      };

      await walletsApi.create(payload);
      showSuccess('Carteira criada com sucesso!');
      setIsModalOpen(false);
      await fetchWallets();
    } catch {
      showError('Erro ao criar carteira');
    }
  };

  const handleUpdate = async (data: WalletFormData) => {
    if (!editingWallet) return;

    try {
      const payload: UpdateWalletDto = {
        name: data.name,
        walletType: data.walletType,
        currency: data.currency,
        initialBalance: parseFloat(data.initialBalance),
        description: data.description,
        institution: data.institution,
        isPrimary: data.isPrimary,
        ...(data.walletType === 'CREDIT_CARD' && {
          creditLimit: data.creditLimit ? parseFloat(data.creditLimit) : undefined,
          billingCloseDay: data.billingCloseDay ? parseInt(data.billingCloseDay) : undefined,
          billingDueDay: data.billingDueDay ? parseInt(data.billingDueDay) : undefined,
        }),
        ...(data.walletType === 'BANK' && {
          accountType: data.accountType,
          bankName: data.bankName,
        }),
        digitalWalletProvider: data.digitalWalletProvider,
      };

      await walletsApi.update(editingWallet.id, payload);
      showSuccess('Carteira atualizada com sucesso!');
      setIsModalOpen(false);
      setEditingWallet(null);
      await fetchWallets();
    } catch {
      showError('Erro ao atualizar carteira');
    }
  };

  const handleArchive = async () => {
    if (!archiveWallet) return;

    try {
      await walletsApi.archive(archiveWallet.id);
      showSuccess('Carteira arquivada com sucesso!');
      setArchiveWallet(null);
      await fetchWallets();
    } catch {
      showError('Erro ao arquivar carteira');
    }
  };

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWallet(null);
  };

  const handleViewTransactions = async (wallet: Wallet) => {
    try {
      setSelectedWalletTransactions(wallet);
      setLoadingTransactions(true);
      const data = await transactionsApi.getAll({ walletId: wallet.id });
      setWalletTransactions(data);
      setIsTransactionsModalOpen(true);
    } catch {
      showError('Erro ao carregar transações');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const activeWallets = wallets.filter((w) => w.status === 'ACTIVE');
  const archivedWallets = wallets.filter((w) => w.status === 'ARCHIVED');

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Carteiras</h1>
            <p className="text-gray-600 mt-1">Gerencie suas contas e carteiras</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={20} />
            Nova Carteira
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Empty State */}
        {!loading && wallets.length === 0 && (
          <div className="text-center py-12">
            <WalletIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma carteira</h3>
            <p className="mt-1 text-sm text-gray-500">Comece criando sua primeira carteira.</p>
            <div className="mt-6">
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus size={20} />
                Nova Carteira
              </Button>
            </div>
          </div>
        )}

        {/* Active Wallets */}
        {!loading && activeWallets.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Carteiras Ativas ({activeWallets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeWallets.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  onEdit={handleEdit}
                  onArchive={setArchiveWallet}
                  onViewTransactions={void handleViewTransactions}
                />
              ))}
            </div>
          </div>
        )}

        {/* Archived Wallets */}
        {!loading && archivedWallets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Carteiras Arquivadas ({archivedWallets.length})
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowArchived(!showArchived)}>
                {showArchived ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            {showArchived && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archivedWallets.map((wallet) => (
                  <WalletCard key={wallet.id} wallet={wallet} onEdit={handleEdit} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <WalletModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => void (editingWallet ? handleUpdate(data) : handleCreate(data))}
        title={editingWallet ? 'Editar Carteira' : 'Nova Carteira'}
        confirmLabel={editingWallet ? 'Salvar Alterações' : 'Criar Carteira'}
        defaultValues={
          editingWallet
            ? {
                name: editingWallet.name,
                walletType: editingWallet.walletType,
                currency: editingWallet.currency,
                initialBalance: String(editingWallet.initialBalance),
                description: editingWallet.description || '',
                institution: editingWallet.institution || '',
                isPrimary: editingWallet.isPrimary,
                creditLimit: editingWallet.creditLimit ? String(editingWallet.creditLimit) : '',
                billingCloseDay: editingWallet.billingCloseDay
                  ? String(editingWallet.billingCloseDay)
                  : '',
                billingDueDay: editingWallet.billingDueDay
                  ? String(editingWallet.billingDueDay)
                  : '',
                accountType: editingWallet.accountType || 'CHECKING',
                bankName: editingWallet.bankName || '',
                digitalWalletProvider: editingWallet.digitalWalletProvider || '',
              }
            : undefined
        }
      />

      <ConfirmModal
        open={!!archiveWallet}
        onCancel={() => setArchiveWallet(null)}
        onConfirm={() => void handleArchive()}
        title="Arquivar Carteira"
        description={`Tem certeza que deseja arquivar a carteira "${archiveWallet?.name}"? Você ainda poderá acessá-la na lista de arquivadas.`}
        confirmLabel="Arquivar"
        confirmVariant="destructive"
      />

      {/* Modal de Transações da Carteira */}
      {isTransactionsModalOpen && selectedWalletTransactions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsTransactionsModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Transações - {selectedWalletTransactions.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {walletTransactions.length} transação(ões)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTransactionsModalOpen(false)}
                >
                  ✕
                </Button>
              </div>

              {loadingTransactions ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : walletTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">Nenhuma transação nesta conta</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {walletTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {new Intl.DateTimeFormat('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }).format(new Date(transaction.date))}
                        </p>
                      </div>
                      <div className="text-right">
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
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(transaction.amount)}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${
                            transaction.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-600'
                              : transaction.status === 'PENDING'
                                ? 'bg-amber-500/20 text-amber-600'
                                : 'bg-red-500/20 text-red-600'
                          }`}
                        >
                          {transaction.status === 'COMPLETED'
                            ? 'Completa'
                            : transaction.status === 'PENDING'
                              ? 'Pendente'
                              : 'Cancelada'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
