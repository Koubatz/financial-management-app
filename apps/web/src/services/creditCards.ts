import { api } from '@/lib/api';

export interface CreditCard {
  id: string;
  walletId: string;
  userId: string;
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  cvv?: string;
  bank: string;
  cardNetwork: string;
  cardType: string;
  creditLimit: number;
  usedLimit: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardInstallment {
  id: string;
  creditCardId: string;
  transactionId: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const creditCardsApi = {
  async getAll(): Promise<CreditCard[]> {
    const { data } = await api.get<CreditCard[]>('/credit-cards');
    return data;
  },

  async getById(id: string): Promise<CreditCard> {
    const { data } = await api.get<CreditCard>(`/credit-cards/${id}`);
    return data;
  },

  async create(card: Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreditCard> {
    const { data } = await api.post<CreditCard>('/credit-cards', card);
    return data;
  },

  async update(
    id: string,
    updates: Partial<Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<CreditCard> {
    const { data } = await api.put<CreditCard>(`/credit-cards/${id}`, updates);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/credit-cards/${id}`);
  },

  async getInstallments(cardId: string): Promise<CardInstallment[]> {
    const { data } = await api.get<CardInstallment[]>(`/credit-cards/${cardId}/installments`);
    return data;
  },
};
