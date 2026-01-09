import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';

export type CardStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type CardNetwork = 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX';

interface CreditCardRow {
  id: string;
  user_id: string;
  wallet_id: string;
  card_number: string;
  holder_name: string;
  expiry_date: string;
  cvv: string | null;
  bank: string;
  card_network: CardNetwork;
  card_type: string;
  credit_limit: string;
  used_limit: string;
  status: CardStatus;
  created_at: string;
  updated_at: string;
}

interface CardInstallmentRow {
  id: string;
  credit_card_id: string;
  transaction_id: string;
  installment_number: number;
  total_installments: number;
  amount: string;
  due_date: string;
  is_paid: boolean;
  paid_date: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreditCard {
  id: string;
  userId: string;
  walletId: string;
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  cvv?: string;
  bank: string;
  cardNetwork: CardNetwork;
  cardType: string;
  creditLimit: number;
  usedLimit: number;
  status: CardStatus;
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

export interface CreateCreditCardDto {
  walletId: string;
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  cvv?: string;
  bank: string;
  cardNetwork: CardNetwork;
  cardType: string;
  creditLimit: number;
}

@Injectable()
export class CreditCardsService {
  @Inject(DatabaseService)
  private readonly db!: DatabaseService;

  async create(userId: string, dto: CreateCreditCardDto): Promise<CreditCard> {
    const id = randomUUID();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO credit_cards 
      (id, user_id, wallet_id, card_number, holder_name, expiry_date, cvv, bank, card_network, card_type, credit_limit, used_limit, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      id,
      userId,
      dto.walletId,
      dto.cardNumber,
      dto.holderName,
      dto.expiryDate,
      dto.cvv || null,
      dto.bank,
      dto.cardNetwork,
      dto.cardType,
      dto.creditLimit,
      0,
      'ACTIVE',
      now,
      now,
    ]);

    return this.mapRowToCard(result.rows[0] as CreditCardRow);
  }

  async getAll(userId: string): Promise<CreditCard[]> {
    const query = `
      SELECT * FROM credit_cards 
      WHERE user_id = $1 AND status != 'BLOCKED'
      ORDER BY created_at DESC
    `;

    const result = await this.db.query(query, [userId]);
    return result.rows.map((row) => this.mapRowToCard(row as CreditCardRow));
  }

  async getById(id: string, userId: string): Promise<CreditCard> {
    const query = `
      SELECT * FROM credit_cards 
      WHERE id = $1 AND user_id = $2
    `;

    const result = await this.db.query(query, [id, userId]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Cartão não encontrado');
    }

    return this.mapRowToCard(result.rows[0] as CreditCardRow);
  }

  async update(id: string, userId: string, updates: Partial<CreditCard>): Promise<CreditCard> {
    const card = await this.getById(id, userId);

    const updatedCard = { ...card, ...updates, updatedAt: new Date().toISOString() };

    const query = `
      UPDATE credit_cards 
      SET used_limit = $1, status = $2, updated_at = $3
      WHERE id = $4
      RETURNING *
    `;

    const result = await this.db.query(query, [
      updatedCard.usedLimit,
      updatedCard.status,
      updatedCard.updatedAt,
      id,
    ]);

    return this.mapRowToCard(result.rows[0] as CreditCardRow);
  }

  async delete(id: string): Promise<void> {
    const query = `
      UPDATE credit_cards 
      SET status = 'BLOCKED'
      WHERE id = $1
    `;

    await this.db.query(query, [id]);
  }

  async getInstallments(cardId: string, userId: string): Promise<CardInstallment[]> {
    // Verify card belongs to user
    await this.getById(cardId, userId);

    const query = `
      SELECT * FROM card_installments 
      WHERE credit_card_id = $1
      ORDER BY due_date ASC
    `;

    const result = await this.db.query(query, [cardId]);
    return result.rows.map((row) => this.mapRowToInstallment(row as CardInstallmentRow));
  }

  async createInstallment(
    installment: Omit<CardInstallment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CardInstallment> {
    const id = randomUUID();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO card_installments 
      (id, credit_card_id, transaction_id, installment_number, total_installments, amount, due_date, is_paid, description, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await this.db.query(query, [
      id,
      installment.creditCardId,
      installment.transactionId,
      installment.installmentNumber,
      installment.totalInstallments,
      installment.amount,
      installment.dueDate,
      installment.isPaid || false,
      installment.description,
      now,
      now,
    ]);

    return this.mapRowToInstallment(result.rows[0] as CardInstallmentRow);
  }

  async markInstallmentAsPaid(
    installmentId: string,
    cardId: string,
    userId: string,
  ): Promise<CardInstallment> {
    // Verify card belongs to user
    await this.getById(cardId, userId);

    const now = new Date().toISOString();

    const query = `
      UPDATE card_installments 
      SET is_paid = true, paid_date = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;

    const result = await this.db.query(query, [now, now, installmentId]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Parcela não encontrada');
    }

    return this.mapRowToInstallment(result.rows[0] as CardInstallmentRow);
  }

  private mapRowToCard(row: CreditCardRow): CreditCard {
    return {
      id: row.id,
      userId: row.user_id,
      walletId: row.wallet_id,
      cardNumber: row.card_number,
      holderName: row.holder_name,
      expiryDate: row.expiry_date,
      cvv: row.cvv ?? undefined,
      bank: row.bank,
      cardNetwork: row.card_network,
      cardType: row.card_type,
      creditLimit: parseFloat(row.credit_limit),
      usedLimit: parseFloat(row.used_limit),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRowToInstallment(row: CardInstallmentRow): CardInstallment {
    return {
      id: row.id,
      creditCardId: row.credit_card_id,
      transactionId: row.transaction_id,
      installmentNumber: row.installment_number,
      totalInstallments: row.total_installments,
      amount: parseFloat(row.amount),
      dueDate: row.due_date,
      isPaid: row.is_paid,
      paidDate: row.paid_date ?? undefined,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
