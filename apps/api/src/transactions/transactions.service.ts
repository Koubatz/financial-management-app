import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../database/database.service';

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

interface TransactionRow extends QueryResultRow {
  id: string;
  user_id: string;
  wallet_id: string;
  type: TransactionType;
  amount: string;
  date: Date;
  description: string;
  category_id?: string | null;
  status: TransactionStatus;
  notes?: string | null;
  payment_method?: PaymentMethod | null;
  reference?: string | null;
  tags?: string[] | null;
  is_recurring: boolean;
  recurring_id?: string | null;
  installment_number?: number | null;
  total_installments?: number | null;
  source_wallet_id?: string | null;
  destination_wallet_id?: string | null;
  credit_card_id?: string | null;
  invoice_id?: string | null;
  invoice_month?: string | null;
  is_paid?: boolean | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

interface TransactionDbPayload {
  wallet_id?: string;
  type?: TransactionType;
  amount?: number;
  date?: Date;
  description?: string;
  category_id?: string | null;
  status?: TransactionStatus;
  notes?: string | null;
  payment_method?: PaymentMethod | null;
  reference?: string | null;
  tags?: string[] | null;
  is_recurring?: boolean;
  recurring_id?: string | null;
  installment_number?: number | null;
  total_installments?: number | null;
  source_wallet_id?: string | null;
  destination_wallet_id?: string | null;
  credit_card_id?: string | null;
  invoice_id?: string | null;
  invoice_month?: string | null;
  is_paid?: boolean | null;
}

@Injectable()
export class TransactionsService {
  private static readonly allowedTypes: TransactionType[] = ['INCOME', 'EXPENSE', 'TRANSFER'];
  private static readonly allowedStatuses: TransactionStatus[] = [
    'PENDING',
    'COMPLETED',
    'CANCELED',
  ];
  private static readonly allowedPaymentMethods: PaymentMethod[] = [
    'CASH',
    'DEBIT',
    'CREDIT',
    'PIX',
    'BANK_TRANSFER',
    'OTHER',
  ];

  private static readonly transactionSelectColumns = [
    'id',
    'user_id',
    'wallet_id',
    'type',
    'amount',
    'date',
    'description',
    'category_id',
    'status',
    'notes',
    'payment_method',
    'reference',
    'tags',
    'is_recurring',
    'recurring_id',
    'installment_number',
    'total_installments',
    'source_wallet_id',
    'destination_wallet_id',
    'credit_card_id',
    'invoice_id',
    'invoice_month',
    'is_paid',
    'created_at',
    'updated_at',
    'deleted_at',
  ].join(', ');

  constructor(
    @Inject(DatabaseService)
    private readonly databaseService: DatabaseService,
  ) {}

  async create(userId: string, payload: CreateTransactionDto): Promise<Transaction> {
    const normalized = this.validatePayload(payload, { isUpdate: false });

    const id = randomUUID();
    const result = await this.databaseService.query<TransactionRow>(
      `INSERT INTO transactions (
        id, user_id, wallet_id, type, amount, date, description,
        category_id, status, notes, payment_method, reference, tags,
        is_recurring, recurring_id, installment_number, total_installments,
        source_wallet_id, destination_wallet_id, credit_card_id,
        invoice_id, invoice_month, is_paid
      )
      VALUES (
        $1, $2, $3, $4::transaction_type, $5, $6, $7, $8, $9::transaction_status,
        $10, $11::payment_method, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23
      )
      RETURNING ${TransactionsService.transactionSelectColumns}`,
      [
        id,
        userId,
        normalized.wallet_id,
        normalized.type,
        normalized.amount,
        normalized.date,
        normalized.description,
        normalized.category_id || null,
        normalized.status || 'COMPLETED',
        normalized.notes || null,
        normalized.payment_method || null,
        normalized.reference || null,
        normalized.tags ? JSON.stringify(normalized.tags) : null,
        normalized.is_recurring ?? false,
        normalized.recurring_id || null,
        normalized.installment_number || null,
        normalized.total_installments || null,
        normalized.source_wallet_id || null,
        normalized.destination_wallet_id || null,
        normalized.credit_card_id || null,
        normalized.invoice_id || null,
        normalized.invoice_month || null,
        normalized.is_paid ?? false,
      ],
    );

    const transaction = result.rows[0];
    return this.mapRow(transaction);
  }

  async findAll(
    userId: string,
    filters?: { walletId?: string; type?: TransactionType; status?: TransactionStatus },
  ): Promise<Transaction[]> {
    let query = `SELECT ${TransactionsService.transactionSelectColumns}
                 FROM transactions
                 WHERE user_id = $1 AND deleted_at IS NULL`;
    const params: unknown[] = [userId];
    let paramIndex = 2;

    if (filters?.walletId) {
      query += ` AND wallet_id = $${paramIndex}`;
      params.push(filters.walletId);
      paramIndex++;
    }

    if (filters?.type) {
      query += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    if (filters?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    query += ` ORDER BY date DESC, created_at DESC`;

    const result = await this.databaseService.query<TransactionRow>(query, params);
    return result.rows.map((row) => this.mapRow(row));
  }

  async findAllPaginated(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters?: { walletId?: string; type?: TransactionType; status?: TransactionStatus },
  ): Promise<{ data: Transaction[]; total: number; page: number; limit: number; pages: number }> {
    const pageNum = Math.max(1, page);
    const limitNum = Math.min(100, Math.max(1, limit));
    const offset = (pageNum - 1) * limitNum;

    // Count total
    let countQuery = `SELECT COUNT(*) as count FROM transactions WHERE user_id = $1 AND deleted_at IS NULL`;
    const countParams: unknown[] = [userId];
    let paramIndex = 2;

    if (filters?.walletId) {
      countQuery += ` AND wallet_id = $${paramIndex}`;
      countParams.push(filters.walletId);
      paramIndex++;
    }

    if (filters?.type) {
      countQuery += ` AND type = $${paramIndex}`;
      countParams.push(filters.type);
      paramIndex++;
    }

    if (filters?.status) {
      countQuery += ` AND status = $${paramIndex}`;
      countParams.push(filters.status);
      paramIndex++;
    }

    const countResult = await this.databaseService.query<{ count: string }>(
      countQuery,
      countParams,
    );
    const total = parseInt(countResult.rows[0].count, 10);
    const pages = Math.ceil(total / limitNum);

    // Fetch data
    let dataQuery = `SELECT ${TransactionsService.transactionSelectColumns}
                     FROM transactions
                     WHERE user_id = $1 AND deleted_at IS NULL`;
    const dataParams: unknown[] = [userId];
    let dataParamIndex = 2;

    if (filters?.walletId) {
      dataQuery += ` AND wallet_id = $${dataParamIndex}`;
      dataParams.push(filters.walletId);
      dataParamIndex++;
    }

    if (filters?.type) {
      dataQuery += ` AND type = $${dataParamIndex}`;
      dataParams.push(filters.type);
      dataParamIndex++;
    }

    if (filters?.status) {
      dataQuery += ` AND status = $${dataParamIndex}`;
      dataParams.push(filters.status);
      dataParamIndex++;
    }

    dataQuery += ` ORDER BY date DESC, created_at DESC LIMIT $${dataParamIndex} OFFSET $${dataParamIndex + 1}`;
    dataParams.push(limitNum, offset);

    const result = await this.databaseService.query<TransactionRow>(dataQuery, dataParams);

    return {
      data: result.rows.map((row) => this.mapRow(row)),
      total,
      page: pageNum,
      limit: limitNum,
      pages,
    };
  }

  async findOne(userId: string, transactionId: string): Promise<Transaction> {
    const transaction = await this.findOwnedTransaction(userId, transactionId);
    return this.mapRow(transaction);
  }

  async update(
    userId: string,
    transactionId: string,
    payload: UpdateTransactionDto,
  ): Promise<Transaction> {
    const normalized = this.validatePayload(payload, { isUpdate: true });

    const setClauses: string[] = [];
    const values: unknown[] = [];

    const add = (column: string, value: unknown, cast?: string) => {
      if (cast) {
        setClauses.push(`${column} = $${values.length + 1}::${cast}`);
      } else {
        setClauses.push(`${column} = $${values.length + 1}`);
      }
      values.push(value);
    };

    Object.entries(normalized).forEach(([column, value]) => {
      if (value !== undefined) {
        if (column === 'type') {
          add(column, value, 'transaction_type');
        } else if (column === 'status') {
          add(column, value, 'transaction_status');
        } else if (column === 'payment_method') {
          add(column, value, 'payment_method');
        } else if (column === 'tags') {
          add(column, JSON.stringify(value));
        } else {
          add(column, value);
        }
      }
    });

    if (setClauses.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    setClauses.push(`updated_at = now()`);

    const result = await this.databaseService.query<TransactionRow>(
      `UPDATE transactions
       SET ${setClauses.join(', ')}
       WHERE id = $${values.length + 1} AND user_id = $${values.length + 2} AND deleted_at IS NULL
       RETURNING ${TransactionsService.transactionSelectColumns}`,
      [...values, transactionId, userId],
    );

    const updated = result.rows[0];
    if (!updated) {
      throw new NotFoundException('Transaction not found or not owned by user');
    }

    return this.mapRow(updated);
  }

  async delete(userId: string, transactionId: string): Promise<Transaction> {
    const result = await this.databaseService.query<TransactionRow>(
      `UPDATE transactions
       SET deleted_at = now(), updated_at = now()
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
       RETURNING ${TransactionsService.transactionSelectColumns}`,
      [transactionId, userId],
    );

    const deleted = result.rows[0];
    if (!deleted) {
      throw new NotFoundException('Transaction not found or not owned by user');
    }

    return this.mapRow(deleted);
  }

  private async findOwnedTransaction(
    userId: string,
    transactionId: string,
  ): Promise<TransactionRow> {
    const result = await this.databaseService.query<TransactionRow>(
      `SELECT ${TransactionsService.transactionSelectColumns}
       FROM transactions
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
       LIMIT 1`,
      [transactionId, userId],
    );

    const transaction = result.rows[0];
    if (!transaction) {
      throw new NotFoundException('Transaction not found or not owned by user');
    }

    return transaction;
  }

  private validatePayload(
    payload: CreateTransactionDto | UpdateTransactionDto,
    options: { isUpdate: boolean },
  ): TransactionDbPayload {
    const normalized: TransactionDbPayload = {};

    if (!options.isUpdate || payload.walletId !== undefined) {
      if (!payload.walletId?.trim()) {
        throw new BadRequestException('Wallet ID is required');
      }
      normalized.wallet_id = payload.walletId.trim();
    }

    if (!options.isUpdate || payload.type !== undefined) {
      if (!TransactionsService.allowedTypes.includes(payload.type as TransactionType)) {
        throw new BadRequestException('Invalid transaction type');
      }
      normalized.type = payload.type as TransactionType;
    }

    if (!options.isUpdate || payload.amount !== undefined) {
      const amount = Number(payload.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        throw new BadRequestException('Amount must be a positive number');
      }
      normalized.amount = amount;
    }

    if (!options.isUpdate || payload.date !== undefined) {
      if (!payload.date) {
        throw new BadRequestException('Date is required');
      }
      const date = new Date(payload.date);
      if (Number.isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      normalized.date = date;
    }

    if (!options.isUpdate || payload.description !== undefined) {
      const description = (payload.description ?? '').trim();
      if (!description) {
        throw new BadRequestException('Description is required');
      }
      normalized.description = description;
    }

    if (payload.categoryId !== undefined) {
      normalized.category_id = payload.categoryId?.trim() || null;
    }

    if ('status' in payload && payload.status !== undefined) {
      if (!TransactionsService.allowedStatuses.includes(payload.status)) {
        throw new BadRequestException('Invalid status');
      }
      normalized.status = payload.status;
    }

    if (payload.notes !== undefined) {
      normalized.notes = payload.notes?.trim() || null;
    }

    if (payload.paymentMethod !== undefined) {
      if (
        payload.paymentMethod &&
        !TransactionsService.allowedPaymentMethods.includes(payload.paymentMethod)
      ) {
        throw new BadRequestException('Invalid payment method');
      }
      normalized.payment_method = payload.paymentMethod || null;
    }

    if (payload.reference !== undefined) {
      normalized.reference = payload.reference?.trim() || null;
    }

    if (payload.tags !== undefined) {
      normalized.tags = Array.isArray(payload.tags) ? payload.tags : null;
    }

    if (payload.isRecurring !== undefined) {
      normalized.is_recurring = Boolean(payload.isRecurring);
    }

    if (payload.recurringId !== undefined) {
      normalized.recurring_id = payload.recurringId?.trim() || null;
    }

    if (payload.installmentNumber !== undefined || payload.totalInstallments !== undefined) {
      const instNum = payload.installmentNumber ? Number(payload.installmentNumber) : null;
      const instTotal = payload.totalInstallments ? Number(payload.totalInstallments) : null;

      if ((instNum !== null && instTotal === null) || (instNum === null && instTotal !== null)) {
        throw new BadRequestException(
          'Both installment number and total installments must be provided together',
        );
      }

      if (instNum !== null && instTotal !== null) {
        if (instNum < 1 || instTotal < 1 || instNum > instTotal) {
          throw new BadRequestException('Invalid installment values');
        }
        normalized.installment_number = instNum;
        normalized.total_installments = instTotal;
      }
    }

    if (payload.type === 'TRANSFER') {
      if (!options.isUpdate) {
        if (!payload.sourceWalletId || !payload.destinationWalletId) {
          throw new BadRequestException(
            'Source and destination wallets are required for transfers',
          );
        }
        if (payload.sourceWalletId === payload.destinationWalletId) {
          throw new BadRequestException('Source and destination wallets must be different');
        }
      }
      if (payload.sourceWalletId !== undefined) {
        normalized.source_wallet_id = payload.sourceWalletId?.trim() || null;
      }
      if (payload.destinationWalletId !== undefined) {
        normalized.destination_wallet_id = payload.destinationWalletId?.trim() || null;
      }
    }

    if (payload.creditCardId !== undefined) {
      normalized.credit_card_id = payload.creditCardId?.trim() || null;
    }

    if (payload.invoiceId !== undefined) {
      normalized.invoice_id = payload.invoiceId?.trim() || null;
    }

    if (payload.invoiceMonth !== undefined) {
      normalized.invoice_month = payload.invoiceMonth?.trim() || null;
    }

    if (payload.isPaid !== undefined) {
      normalized.is_paid = Boolean(payload.isPaid);
    }

    return normalized;
  }

  private mapRow(row: TransactionRow): Transaction {
    return {
      id: row.id,
      userId: row.user_id,
      walletId: row.wallet_id,
      type: row.type,
      amount: Number(row.amount),
      date: row.date.toISOString(),
      description: row.description,
      categoryId: row.category_id ?? null,
      status: row.status,
      notes: row.notes ?? null,
      paymentMethod: row.payment_method ?? null,
      reference: row.reference ?? null,
      tags: row.tags ? (Array.isArray(row.tags) ? row.tags : null) : null,
      isRecurring: row.is_recurring,
      recurringId: row.recurring_id ?? null,
      installmentNumber: row.installment_number ?? null,
      totalInstallments: row.total_installments ?? null,
      sourceWalletId: row.source_wallet_id ?? null,
      destinationWalletId: row.destination_wallet_id ?? null,
      creditCardId: row.credit_card_id ?? null,
      invoiceId: row.invoice_id ?? null,
      invoiceMonth: row.invoice_month ?? null,
      isPaid: row.is_paid ?? null,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      deletedAt: row.deleted_at ? row.deleted_at.toISOString() : null,
    };
  }
}
