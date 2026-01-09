import { api } from '@/lib/api';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELED';
export type PaymentMethod = 'CASH' | 'DEBIT' | 'CREDIT' | 'PIX' | 'BANK_TRANSFER' | 'OTHER';

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  categoryId?: string | null;
  status: TransactionStatus;
  notes?: string | null;
  paymentMethod?: PaymentMethod | null;
  reference?: string | null;
  tags?: string[] | null;
  isRecurring: boolean;
  recurringId?: string | null;
  installmentNumber?: number | null;
  totalInstallments?: number | null;
  sourceWalletId?: string | null;
  destinationWalletId?: string | null;
  creditCardId?: string | null;
  invoiceId?: string | null;
  invoiceMonth?: string | null;
  isPaid?: boolean | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateTransactionDto {
  walletId: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  categoryId?: string;
  status?: TransactionStatus;
  notes?: string;
  paymentMethod?: PaymentMethod;
  reference?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringId?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  sourceWalletId?: string;
  destinationWalletId?: string;
  creditCardId?: string;
  invoiceId?: string;
  invoiceMonth?: string;
  isPaid?: boolean;
}

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export const transactionsApi = {
  getAll: async (params?: {
    walletId?: string;
    type?: TransactionType;
    status?: TransactionStatus;
  }): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions', { params });
    return response.data;
  },

  getAllPaginated: async (params?: {
    page?: number;
    limit?: number;
    walletId?: string;
    type?: TransactionType;
    status?: TransactionStatus;
  }): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> => {
    const response = await api.get<{
      data: Transaction[];
      total: number;
      page: number;
      limit: number;
      pages: number;
    }>('/transactions/paginated/list', { params });
    return response.data;
  },

  getById: async (transactionId: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${transactionId}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (transactionId: string, data: UpdateTransactionDto): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${transactionId}`, data);
    return response.data;
  },

  delete: async (transactionId: string): Promise<Transaction> => {
    const response = await api.delete<Transaction>(`/transactions/${transactionId}`);
    return response.data;
  },
};
