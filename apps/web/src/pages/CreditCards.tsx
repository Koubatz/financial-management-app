import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CreditCardComponent } from '@/components/credit-cards/CreditCardComponent';
import { CardInstallmentsList } from '@/components/credit-cards/CardInstallmentsList';
import { CreditCardModal, type CreditCardFormData } from '@/components/ui/credit-card-modal';
import { Button } from '@/components/ui/button';
import { creditCardsApi, type CreditCard, type CardInstallment } from '@/services/creditCards';
import { walletsApi, type Wallet } from '@/services/wallets';
import { useToast } from '@/hooks/useToast';
import { Plus, Calendar, Building2 } from 'lucide-react';

export function CreditCardsPage() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [installments, setInstallments] = useState<CardInstallment[]>([]);
  const [loadingInstallments, setLoadingInstallments] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    void fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const [cardsData, walletsData] = await Promise.all([
        creditCardsApi.getAll(),
        walletsApi.getAll(),
      ]);
      setCards(cardsData);
      const creditCardWallets = walletsData.filter(
        (w) => w.walletType === 'CREDIT_CARD' && w.status === 'ACTIVE',
      );
      setWallets(creditCardWallets);
      if (cardsData.length > 0) {
        setSelectedCard(cardsData[0]);
        await fetchInstallments(cardsData[0].id);
      }
    } catch {
      showError('Erro ao carregar cartões');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstallments = async (cardId: string) => {
    try {
      setLoadingInstallments(true);
      const data = await creditCardsApi.getInstallments(cardId);
      setInstallments(data);
    } catch {
      showError('Erro ao carregar parcelas');
    } finally {
      setLoadingInstallments(false);
    }
  };

  const handleSelectCard = async (card: CreditCard) => {
    setSelectedCard(card);
    await fetchInstallments(card.id);
  };

  const handleCreateCard = async (data: CreditCardFormData) => {
    try {
      const newCard = await creditCardsApi.create({
        walletId: data.walletId,
        cardNumber: data.cardNumber.replace(/\s/g, ''),
        holderName: data.holderName,
        expiryDate: data.expiryDate,
        cvv: data.cvv || undefined,
        bank: data.bank,
        cardNetwork: data.cardNetwork as 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX',
        cardType: data.cardType,
        creditLimit: parseFloat(data.creditLimit),
      });
      showSuccess('Cartão criado com sucesso!');
      await fetchCards();
      setSelectedCard(newCard);
      await fetchInstallments(newCard.id);
    } catch (error) {
      showError('Erro ao criar cartão');
      console.error(error);
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cartões de Crédito</h1>
            <p className="text-gray-600 mt-1">Gerencie seus cartões e parcelas</p>
          </div>
          <Button onClick={() => setIsCardModalOpen(true)} className="gap-2">
            <Plus size={20} />
            Novo Cartão
          </Button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">Nenhum cartão cadastrado</p>
            <Button onClick={() => setIsCardModalOpen(true)}>Adicionar Cartão</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cartões de Crédito Registrados */}
            {wallets.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Contas de Crédito Cadastradas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="bg-white rounded-lg shadow p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                          {wallet.institution && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Building2 size={14} />
                              {wallet.institution}
                            </p>
                          )}
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {wallet.currency}
                        </span>
                      </div>

                      {wallet.creditLimit && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Limite:</span>
                            <span className="font-semibold">
                              R$ {wallet.creditLimit.toFixed(2)}
                            </span>
                          </div>
                          {wallet.billingCloseDay && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Fechamento:</span>
                              <span className="font-semibold flex items-center gap-1">
                                <Calendar size={14} />
                                Dia {wallet.billingCloseDay}
                              </span>
                            </div>
                          )}
                          {wallet.billingDueDay && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vencimento:</span>
                              <span className="font-semibold flex items-center gap-1">
                                <Calendar size={14} />
                                Dia {wallet.billingDueDay}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {wallet.description && (
                        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                          {wallet.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cards Grid */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Meus Cartões</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => void handleSelectCard(card)}
                    className={`cursor-pointer transition-transform ${
                      selectedCard?.id === card.id ? 'scale-105' : 'hover:scale-102'
                    }`}
                  >
                    <CreditCardComponent card={card} />
                  </div>
                ))}
              </div>
            </div>

            {/* Installments Section */}
            {selectedCard && (
              <div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Parcelas - {selectedCard.bank} ({selectedCard.cardNumber.slice(-4)})
                  </h2>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Limite Total</p>
                      <p className="text-xl font-bold text-blue-600">
                        R$ {selectedCard.creditLimit.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Utilizado</p>
                      <p className="text-xl font-bold text-red-600">
                        R$ {selectedCard.usedLimit.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Disponível</p>
                      <p className="text-xl font-bold text-green-600">
                        R$ {(selectedCard.creditLimit - selectedCard.usedLimit).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Installments List */}
                  <CardInstallmentsList installments={installments} loading={loadingInstallments} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação de Cartão */}
      <CreditCardModal
        open={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSubmit={(data) => void handleCreateCard(data)}
      />
    </MainLayout>
  );
}
