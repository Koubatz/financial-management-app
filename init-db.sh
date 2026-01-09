#!/bin/bash
# Script de inicialização do PostgreSQL
# Executado automaticamente quando o container do PostgreSQL inicia

set -e

echo "Inicializando banco de dados..."

# Executar todas as migrations
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  -- Criar tipos ENUM
  CREATE TYPE wallet_type AS ENUM ('CASH', 'BANK', 'CREDIT_CARD', 'INVESTMENT');
  CREATE TYPE wallet_status AS ENUM ('ACTIVE', 'ARCHIVED');
  CREATE TYPE bank_account_type AS ENUM ('CHECKING', 'SAVINGS');
  CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');
  CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');
  CREATE TYPE payment_method AS ENUM ('CASH', 'DEBIT', 'CREDIT', 'PIX', 'BANK_TRANSFER', 'OTHER');

  -- Criar tabela users
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Criar tabela wallets
  CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    wallet_type wallet_type NOT NULL,
    currency VARCHAR(10) DEFAULT 'BRL',
    initial_balance DECIMAL(15, 2) DEFAULT 0,
    description TEXT,
    institution VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    status wallet_status DEFAULT 'ACTIVE',
    credit_limit DECIMAL(15, 2),
    billing_close_day INT,
    billing_due_day INT,
    account_type bank_account_type,
    bank_name VARCHAR(255),
    digital_wallet_provider VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Criar tabela transactions
  CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    wallet_id UUID NOT NULL,
    type transaction_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT NOT NULL,
    category_id UUID,
    status transaction_status DEFAULT 'COMPLETED',
    notes TEXT,
    payment_method payment_method,
    reference VARCHAR(255),
    tags TEXT[],
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_id UUID,
    installment_number INT,
    total_installments INT,
    source_wallet_id UUID REFERENCES wallets(id),
    destination_wallet_id UUID REFERENCES wallets(id),
    credit_card_id UUID,
    invoice_id UUID,
    invoice_month VARCHAR(7),
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
  );

  -- Criar tabela credit_cards
  CREATE TABLE IF NOT EXISTS credit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    wallet_id UUID NOT NULL,
    card_number VARCHAR(19) NOT NULL,
    holder_name VARCHAR(255) NOT NULL,
    expiry_date VARCHAR(5) NOT NULL,
    cvv VARCHAR(4),
    bank VARCHAR(100) NOT NULL,
    card_network VARCHAR(20) NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    credit_limit DECIMAL(15, 2) NOT NULL,
    used_limit DECIMAL(15, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
  );

  -- Criar tabela card_installments
  CREATE TABLE IF NOT EXISTS card_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_card_id UUID NOT NULL,
    transaction_id UUID,
    installment_number INT NOT NULL,
    total_installments INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date TIMESTAMP,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
  );

  -- Criar índices
  CREATE INDEX IF NOT EXISTS idx_credit_cards_user_id ON credit_cards(user_id);
  CREATE INDEX IF NOT EXISTS idx_credit_cards_wallet_id ON credit_cards(wallet_id);
  CREATE INDEX IF NOT EXISTS idx_credit_cards_status ON credit_cards(status);
  CREATE INDEX IF NOT EXISTS idx_card_installments_credit_card_id ON card_installments(credit_card_id);
  CREATE INDEX IF NOT EXISTS idx_card_installments_due_date ON card_installments(due_date);
  CREATE INDEX IF NOT EXISTS idx_card_installments_is_paid ON card_installments(is_paid);
  CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
EOSQL

echo "Banco de dados inicializado com sucesso!"
