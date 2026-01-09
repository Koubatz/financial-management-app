import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CreditCardComponent } from '@/components/credit-cards/CreditCardComponent';
import { CardInstallmentsList } from '@/components/credit-cards/CardInstallmentsList';
import { creditCardsApi, type CreditCard, type CardInstallment } from '@/services/creditCards';
import { useToast } from '@/hooks/useToast';
import { Plus } from 'lucide-react';

export function CreditCardsPage() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [installments, setInstallments] = useState<CardInstallment[]>([]);
  const [loadingInstallments, setLoadingInstallments] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    void fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const cardsData = await creditCardsApi.getAll();
      setCards(cardsData);
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
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus size={20} />
            Novo Cartão
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">Nenhum cartão cadastrado</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Adicionar Cartão
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cards Grid */}
            <div className="lg:col-span-3">
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
              <div className="lg:col-span-3">
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
    </MainLayout>
  );
}
