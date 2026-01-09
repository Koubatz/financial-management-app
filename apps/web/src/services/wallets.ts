import { api } from '@/lib/api';

export type WalletType = 'CASH' | 'BANK' | 'CREDIT_CARD' | 'INVESTMENT';
export type WalletStatus = 'ACTIVE' | 'ARCHIVED';
export type BankAccountType = 'CHECKING' | 'SAVINGS';

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  walletType: WalletType;
  currency: string;
  initialBalance: number;
  description?: string | null;
  institution?: string | null;
  isPrimary: boolean;
  status: WalletStatus;
  creditLimit?: number | null;
  billingCloseDay?: number | null;
  billingDueDay?: number | null;
  accountType?: BankAccountType | null;
  bankName?: string | null;
  digitalWalletProvider?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface CreateWalletDto {
  name: string;
  walletType: WalletType;
  currency: string;
  initialBalance: number;
  description?: string;
  institution?: string;
  isPrimary?: boolean;
  creditLimit?: number;
  billingCloseDay?: number;
  billingDueDay?: number;
  accountType?: BankAccountType;
  bankName?: string;
  digitalWalletProvider?: string;
}

export interface UpdateWalletDto extends Partial<CreateWalletDto> {
  status?: WalletStatus;
}

export const walletsApi = {
  // Listar todas as carteiras do usuário
  getAll: async (): Promise<Wallet[]> => {
    const response = await api.get<Wallet[]>('/wallets');
    return response.data;
  },

  // Buscar uma carteira específica
  getById: async (walletId: string): Promise<Wallet> => {
    const response = await api.get<Wallet>(`/wallets/${walletId}`);
    return response.data;
  },

  // Criar nova carteira
  create: async (data: CreateWalletDto): Promise<Wallet> => {
    const response = await api.post<Wallet>('/wallets', data);
    return response.data;
  },

  // Atualizar carteira
  update: async (walletId: string, data: UpdateWalletDto): Promise<Wallet> => {
    const response = await api.put<Wallet>(`/wallets/${walletId}`, data);
    return response.data;
  },

  // Arquivar carteira (soft delete)
  archive: async (walletId: string): Promise<Wallet> => {
    const response = await api.delete<Wallet>(`/wallets/${walletId}`);
    return response.data;
  },
};
