import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../database/database.service';

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

export type UpdateWalletDto = Partial<CreateWalletDto> & {
  status?: WalletStatus;
};

interface WalletRow extends QueryResultRow {
  id: string;
  user_id: string;
  name: string;
  wallet_type: WalletType;
  currency: string;
  initial_balance: string;
  description?: string | null;
  institution?: string | null;
  is_primary: boolean;
  status: WalletStatus;
  credit_limit?: string | null;
  billing_close_day?: number | null;
  billing_due_day?: number | null;
  account_type?: BankAccountType | null;
  bank_name?: string | null;
  digital_wallet_provider?: string | null;
  created_at: Date;
  updated_at: Date;
  archived_at?: Date | null;
}

interface WalletDbPayload {
  name?: string;
  wallet_type?: WalletType;
  currency?: string;
  initial_balance?: number;
  description?: string | null;
  institution?: string | null;
  is_primary?: boolean;
  status?: WalletStatus;
  credit_limit?: number | null;
  billing_close_day?: number | null;
  billing_due_day?: number | null;
  account_type?: BankAccountType | null;
  bank_name?: string | null;
  digital_wallet_provider?: string | null;
}

@Injectable()
export class WalletsService {
  private static readonly allowedWalletTypes: WalletType[] = [
    'CASH',
    'BANK',
    'CREDIT_CARD',
    'INVESTMENT',
  ];

  private static readonly allowedStatuses: WalletStatus[] = ['ACTIVE', 'ARCHIVED'];
  private static readonly allowedBankAccountTypes: BankAccountType[] = ['CHECKING', 'SAVINGS'];

  private static readonly walletSelectColumns = [
    'id',
    'user_id',
    'name',
    'wallet_type',
    'currency',
    'initial_balance',
    'description',
    'institution',
    'is_primary',
    'status',
    'credit_limit',
    'billing_close_day',
    'billing_due_day',
    'account_type',
    'bank_name',
    'digital_wallet_provider',
    'created_at',
    'updated_at',
    'archived_at',
  ].join(', ');

  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {}

  async create(userId: string, payload: CreateWalletDto): Promise<Wallet> {
    const normalized = this.validatePayload(payload, { isUpdate: false });

    const id = randomUUID();
    const result = await this.databaseService.query<WalletRow>(
      `INSERT INTO wallets (
        id,
        user_id,
        name,
        wallet_type,
        currency,
        initial_balance,
        description,
        institution,
        is_primary,
        status,
        credit_limit,
        billing_close_day,
        billing_due_day,
        account_type,
        bank_name,
        digital_wallet_provider
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      )
      RETURNING ${WalletsService.walletSelectColumns}`,
      [
        id,
        userId,
        normalized.name,
        normalized.wallet_type,
        normalized.currency,
        normalized.initial_balance ?? 0,
        normalized.description,
        normalized.institution,
        normalized.is_primary ?? false,
        normalized.status ?? 'ACTIVE',
        normalized.credit_limit ?? null,
        normalized.billing_close_day ?? null,
        normalized.billing_due_day ?? null,
        normalized.account_type ?? null,
        normalized.bank_name ?? null,
        normalized.digital_wallet_provider ?? null,
      ],
    );

    const wallet = result.rows[0];
    return this.mapRow(wallet);
  }

  async findAll(userId: string): Promise<Wallet[]> {
    const result = await this.databaseService.query<WalletRow>(
      `SELECT ${WalletsService.walletSelectColumns}
       FROM wallets
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );

    return result.rows.map((row) => this.mapRow(row));
  }

  async findOne(userId: string, walletId: string): Promise<Wallet> {
    const wallet = await this.findOwnedWallet(userId, walletId);
    return this.mapRow(wallet);
  }

  async update(userId: string, walletId: string, payload: UpdateWalletDto): Promise<Wallet> {
    const current = await this.findOwnedWallet(userId, walletId);
    const normalized = this.validatePayload(payload, {
      isUpdate: true,
      currentWallet: this.mapRow(current),
    });

    const setClauses: string[] = [];
    const values: unknown[] = [];

    const add = (column: keyof WalletDbPayload, value: unknown) => {
      setClauses.push(`${column} = $${values.length + 1}`);
      values.push(value);
    };

    Object.entries(normalized).forEach(([column, value]) => {
      if (value !== undefined) {
        add(column as keyof WalletDbPayload, value);
      }
    });

    if (setClauses.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    setClauses.push(`updated_at = now()`);

    const result = await this.databaseService.query<WalletRow>(
      `UPDATE wallets
       SET ${setClauses.join(', ')}
       WHERE id = $${values.length + 1} AND user_id = $${values.length + 2}
       RETURNING ${WalletsService.walletSelectColumns}`,
      [...values, walletId, userId],
    );

    const updated = result.rows[0];
    if (!updated) {
      throw new NotFoundException('Wallet not found or not owned by user');
    }

    return this.mapRow(updated);
  }

  async archive(userId: string, walletId: string): Promise<Wallet> {
    const result = await this.databaseService.query<WalletRow>(
      `UPDATE wallets
       SET status = 'ARCHIVED', archived_at = now(), updated_at = now()
       WHERE id = $1 AND user_id = $2
       RETURNING ${WalletsService.walletSelectColumns}`,
      [walletId, userId],
    );

    const updated = result.rows[0];
    if (!updated) {
      throw new NotFoundException('Wallet not found or not owned by user');
    }

    return this.mapRow(updated);
  }

  private async findOwnedWallet(userId: string, walletId: string): Promise<WalletRow> {
    const result = await this.databaseService.query<WalletRow>(
      `SELECT ${WalletsService.walletSelectColumns}
       FROM wallets
       WHERE id = $1 AND user_id = $2
       LIMIT 1`,
      [walletId, userId],
    );

    const wallet = result.rows[0];
    if (!wallet) {
      throw new NotFoundException('Wallet not found or not owned by user');
    }

    return wallet;
  }

  private validatePayload(
    payload: CreateWalletDto | UpdateWalletDto,
    options: { isUpdate: boolean; currentWallet?: Wallet },
  ): WalletDbPayload {
    const normalized: WalletDbPayload = {};

    if (!options.isUpdate || payload.name !== undefined) {
      const trimmedName = (payload.name ?? '').trim();
      if (!trimmedName) {
        throw new BadRequestException('Wallet name is required');
      }
      normalized.name = trimmedName;
    }

    if (!options.isUpdate || payload.walletType !== undefined) {
      const type = payload.walletType;
      if (!WalletsService.allowedWalletTypes.includes(type as WalletType)) {
        throw new BadRequestException('Invalid wallet type');
      }
      normalized.wallet_type = type as WalletType;
    }

    const walletTypeToValidate = normalized.wallet_type ?? options.currentWallet?.walletType;

    if (!options.isUpdate || payload.currency !== undefined) {
      const currency = (payload.currency ?? '').trim().toUpperCase();
      if (!currency || currency.length < 3 || currency.length > 5) {
        throw new BadRequestException('Currency must be a valid code');
      }
      normalized.currency = currency;
    }

    if (!options.isUpdate || payload.initialBalance !== undefined) {
      const initialBalance = payload.initialBalance;
      if (initialBalance === undefined || Number.isNaN(Number(initialBalance))) {
        throw new BadRequestException('Initial balance must be a number');
      }
      normalized.initial_balance = Number(initialBalance);
    }

    if (payload.description !== undefined) {
      normalized.description = payload.description?.trim() || null;
    }

    if (payload.institution !== undefined) {
      normalized.institution = payload.institution?.trim() || null;
    }

    if (payload.isPrimary !== undefined) {
      normalized.is_primary = Boolean(payload.isPrimary);
    }

    if ('status' in payload && payload.status !== undefined) {
      if (!WalletsService.allowedStatuses.includes(payload.status)) {
        throw new BadRequestException('Invalid status');
      }
      normalized.status = payload.status;
    }

    if (payload.creditLimit !== undefined) {
      const creditLimit = Number(payload.creditLimit);
      if (Number.isNaN(creditLimit) || creditLimit < 0) {
        throw new BadRequestException('Credit limit must be a positive number');
      }
      if (walletTypeToValidate && walletTypeToValidate !== 'CREDIT_CARD') {
        throw new BadRequestException('Credit limit is only allowed for credit card wallets');
      }
      normalized.credit_limit = creditLimit;
    }

    if (payload.billingCloseDay !== undefined) {
      this.assertDayWithinMonth(payload.billingCloseDay, 'Billing close day');
      if (walletTypeToValidate && walletTypeToValidate !== 'CREDIT_CARD') {
        throw new BadRequestException('Billing close day is only allowed for credit card wallets');
      }
      normalized.billing_close_day = payload.billingCloseDay;
    }

    if (payload.billingDueDay !== undefined) {
      this.assertDayWithinMonth(payload.billingDueDay, 'Billing due day');
      if (walletTypeToValidate && walletTypeToValidate !== 'CREDIT_CARD') {
        throw new BadRequestException('Billing due day is only allowed for credit card wallets');
      }
      normalized.billing_due_day = payload.billingDueDay;
    }

    if (payload.accountType !== undefined) {
      if (!WalletsService.allowedBankAccountTypes.includes(payload.accountType)) {
        throw new BadRequestException('Invalid bank account type');
      }
      if (walletTypeToValidate && walletTypeToValidate !== 'BANK') {
        throw new BadRequestException('Account type is only allowed for bank wallets');
      }
      normalized.account_type = payload.accountType;
    }

    if (payload.bankName !== undefined) {
      if (walletTypeToValidate && walletTypeToValidate !== 'BANK') {
        throw new BadRequestException('Bank name is only allowed for bank wallets');
      }
      const trimmedBank = payload.bankName?.trim() || null;
      normalized.bank_name = trimmedBank;
    }

    if (payload.digitalWalletProvider !== undefined) {
      normalized.digital_wallet_provider = payload.digitalWalletProvider?.trim() || null;
    }

    if (!options.isUpdate) {
      if (!normalized.wallet_type) {
        throw new BadRequestException('Wallet type is required');
      }
      if (walletTypeToValidate === 'CREDIT_CARD') {
        if (normalized.credit_limit === undefined) {
          throw new BadRequestException('Credit limit is required for credit cards');
        }
        if (normalized.billing_close_day === undefined) {
          throw new BadRequestException('Billing close day is required for credit cards');
        }
        if (normalized.billing_due_day === undefined) {
          throw new BadRequestException('Billing due day is required for credit cards');
        }
      }

      if (walletTypeToValidate === 'BANK') {
        if (!normalized.account_type) {
          throw new BadRequestException('Account type is required for bank wallets');
        }
        if (!normalized.bank_name) {
          throw new BadRequestException('Bank name is required for bank wallets');
        }
      }
    }

    return normalized;
  }

  private assertDayWithinMonth(value: number | undefined, label: string): void {
    if (value === undefined || Number.isNaN(Number(value))) {
      throw new BadRequestException(`${label} must be a number between 1 and 31`);
    }

    const parsed = Number(value);
    if (parsed < 1 || parsed > 31) {
      throw new BadRequestException(`${label} must be between 1 and 31`);
    }
  }

  private mapRow(row: WalletRow): Wallet {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      walletType: row.wallet_type,
      currency: row.currency,
      initialBalance: Number(row.initial_balance),
      description: row.description ?? null,
      institution: row.institution ?? null,
      isPrimary: row.is_primary,
      status: row.status,
      creditLimit:
        row.credit_limit !== null && row.credit_limit !== undefined
          ? Number(row.credit_limit)
          : null,
      billingCloseDay: row.billing_close_day ?? null,
      billingDueDay: row.billing_due_day ?? null,
      accountType: row.account_type ?? null,
      bankName: row.bank_name ?? null,
      digitalWalletProvider: row.digital_wallet_provider ?? null,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      archivedAt: row.archived_at ? row.archived_at.toISOString() : null,
    };
  }
}
