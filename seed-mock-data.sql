-- =============================================
-- Script de Dados Mock para Testes
-- =============================================
-- Este script cria um usuário de teste e várias carteiras
-- para facilitar o desenvolvimento e testes da aplicação
-- =============================================

-- Limpar dados existentes (CUIDADO: Remove todos os dados!)
-- Descomente as linhas abaixo apenas se quiser resetar completamente
-- TRUNCATE TABLE wallets CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- =============================================
-- 1. CRIAR USUÁRIO DE TESTE
-- =============================================
-- Senha: Test@123
-- Hash gerado com argon2 para a senha "Test@123"
INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'João Silva',
  'joao.silva@test.com',
  '$argon2id$v=19$m=65536,t=3,p=4$qPZvBxQwF8rKZQPz8MxLRQ$OKZe8VqPWqPO8VqPWqPO8VqPWqPO8VqPWqPO8VqPWqA',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- 2. CRIAR CARTEIRAS DE TESTE
-- =============================================

-- Carteira 1: Dinheiro (Principal)
INSERT INTO wallets (
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
  created_at,
  updated_at
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Carteira Pessoal',
  'CASH',
  'BRL',
  1500.00,
  'Dinheiro em espécie para gastos do dia a dia',
  NULL,
  true,
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Carteira 2: Conta Bancária Corrente
INSERT INTO wallets (
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
  account_type,
  bank_name,
  created_at,
  updated_at
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440000',
  'Conta Corrente',
  'BANK',
  'BRL',
  8500.50,
  'Conta principal para recebimento de salário',
  'Banco do Brasil',
  false,
  'ACTIVE',
  'CHECKING',
  'Banco do Brasil',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Carteira 3: Conta Poupança
INSERT INTO wallets (
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
  account_type,
  bank_name,
  created_at,
  updated_at
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440000',
  'Poupança',
  'BANK',
  'BRL',
  12000.00,
  'Reserva de emergência',
  'Caixa Econômica Federal',
  false,
  'ACTIVE',
  'SAVINGS',
  'Caixa Econômica Federal',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Carteira 4: Cartão de Crédito
INSERT INTO wallets (
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
  digital_wallet_provider,
  created_at,
  updated_at
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440000',
  'Cartão Nubank',
  'CREDIT_CARD',
  'BRL',
  -850.00,
  'Cartão para compras online e cashback',
  'Nubank',
  false,
  'ACTIVE',
  5000.00,
  15,
  25,
  'Nubank',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Carteira 5: Cartão de Crédito Internacional
INSERT INTO wallets (
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
  created_at,
  updated_at
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440000',
  'Visa Internacional',
  'CREDIT_CARD',
  'USD',
  -125.50,
  'Cartão para viagens internacionais',
  'Banco Itaú',
  false,
  'ACTIVE',
  3000.00,
  10,
  20,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Carteira 6: Investimentos
INSERT INTO wallets (
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
  created_at,
  updated_at
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440000',
  'Investimentos XP',
  'INVESTMENT',
  'BRL',
  45000.00,
  'Carteira de investimentos diversificada',
  'XP Investimentos',
  false,
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Carteira 7: Conta Digital
INSERT INTO wallets (
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
  account_type,
  bank_name,
  digital_wallet_provider,
  created_at,
  updated_at
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440000',
  'PicPay',
  'BANK',
  'BRL',
  350.00,
  'Carteira digital para pagamentos rápidos',
  'PicPay',
  false,
  'ACTIVE',
  'CHECKING',
  'PicPay',
  'PicPay',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Carteira 8: Conta Arquivada (Exemplo)
INSERT INTO wallets (
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
  account_type,
  bank_name,
  archived_at,
  created_at,
  updated_at
)
VALUES (
  '660e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  'Conta Antiga',
  'BANK',
  'BRL',
  0.00,
  'Conta bancária que não uso mais',
  'Santander',
  false,
  'ARCHIVED',
  'CHECKING',
  'Santander',
  NOW(),
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. CRIAR TRANSAÇÕES DE TESTE
-- =============================================

-- Transação 1: Receita - Salário
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  category_id,
  status,
  payment_method,
  notes,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440002', -- Conta Corrente
  'INCOME',
  5500.00,
  NOW() - INTERVAL '5 days',
  'Salário Janeiro 2026',
  NULL,
  'COMPLETED',
  'BANK_TRANSFER',
  'Depósito mensal',
  '["salário", "renda"]',
  true,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 2: Despesa - Supermercado
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  reference,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440004', -- Cartão Nubank
  'EXPENSE',
  287.50,
  NOW() - INTERVAL '3 days',
  'Supermercado Extra',
  'COMPLETED',
  'CREDIT',
  'COMPRA-12345',
  '["alimentação", "mercado"]',
  false,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 3: Despesa - Aluguel (Recorrente)
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  notes,
  tags,
  is_recurring,
  recurring_id,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440002', -- Conta Corrente
  'EXPENSE',
  1800.00,
  NOW() - INTERVAL '1 day',
  'Aluguel Janeiro',
  'COMPLETED',
  'BANK_TRANSFER',
  'Pagamento aluguel mensal',
  '["moradia", "fixo", "aluguel"]',
  true,
  '880e8400-e29b-41d4-a716-446655440001',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 4: Transferência entre carteiras
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  source_wallet_id,
  destination_wallet_id,
  notes,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440002', -- Conta Corrente
  'TRANSFER',
  500.00,
  NOW() - INTERVAL '2 days',
  'Transferência para poupança',
  'COMPLETED',
  'BANK_TRANSFER',
  '660e8400-e29b-41d4-a716-446655440002', -- Conta Corrente (origem)
  '660e8400-e29b-41d4-a716-446655440003', -- Poupança (destino)
  'Guardando dinheiro',
  '["transferência", "poupança"]',
  false,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 5: Despesa parcelada - Notebook (1/6)
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  reference,
  notes,
  tags,
  is_recurring,
  installment_number,
  total_installments,
  credit_card_id,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440004', -- Cartão Nubank
  'EXPENSE',
  416.67,
  NOW() - INTERVAL '10 days',
  'Notebook Dell - Parcela 1/6',
  'COMPLETED',
  'CREDIT',
  'NF-98765',
  'Compra parcelada',
  '["eletrônicos", "trabalho"]',
  false,
  1,
  6,
  '660e8400-e29b-41d4-a716-446655440004',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 6: Despesa parcelada - Notebook (2/6)
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  reference,
  notes,
  tags,
  is_recurring,
  installment_number,
  total_installments,
  credit_card_id,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440004', -- Cartão Nubank
  'EXPENSE',
  416.67,
  NOW(),
  'Notebook Dell - Parcela 2/6',
  'PENDING',
  'CREDIT',
  'NF-98765',
  'Próxima parcela',
  '["eletrônicos", "trabalho"]',
  false,
  2,
  6,
  '660e8400-e29b-41d4-a716-446655440004',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Transação 7: Receita - Freelance
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  reference,
  notes,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440007', -- PicPay
  'INCOME',
  850.00,
  NOW() - INTERVAL '7 days',
  'Projeto freelance - Design',
  'COMPLETED',
  'PIX',
  'PIX-12345',
  'Cliente: Empresa XYZ',
  '["freelance", "extra"]',
  false,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 8: Despesa - Restaurante
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440001', -- Carteira Pessoal
  'EXPENSE',
  125.00,
  NOW() - INTERVAL '1 day',
  'Jantar em restaurante',
  'COMPLETED',
  'CASH',
  '["alimentação", "lazer"]',
  false,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 9: Despesa - Uber
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440004', -- Cartão Nubank
  'EXPENSE',
  28.50,
  NOW(),
  'Uber - Casa para trabalho',
  'COMPLETED',
  'CREDIT',
  '["transporte"]',
  false,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Transação 10: Despesa - Academia (Pendente)
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  notes,
  tags,
  is_recurring,
  recurring_id,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440002', -- Conta Corrente
  'EXPENSE',
  89.90,
  NOW() + INTERVAL '3 days',
  'Mensalidade Academia - Janeiro',
  'PENDING',
  'DEBIT',
  'Débito automático dia 12',
  '["saúde", "fixo"]',
  true,
  '880e8400-e29b-41d4-a716-446655440002',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Transação 11: Despesa - Netflix
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  notes,
  tags,
  is_recurring,
  recurring_id,
  credit_card_id,
  invoice_month,
  is_paid,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440004', -- Cartão Nubank
  'EXPENSE',
  45.90,
  NOW() - INTERVAL '8 days',
  'Assinatura Netflix',
  'COMPLETED',
  'CREDIT',
  'Assinatura mensal',
  '["assinatura", "lazer", "fixo"]',
  true,
  '880e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440004',
  '2026-01',
  false,
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 12: Despesa - Combustível
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  reference,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440004', -- Cartão Nubank
  'EXPENSE',
  180.00,
  NOW() - INTERVAL '4 days',
  'Gasolina - Posto Shell',
  'COMPLETED',
  'CREDIT',
  'CUPOM-456789',
  '["transporte", "combustível"]',
  false,
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '4 days'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 13: Receita - Dividendos
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  notes,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440006', -- Investimentos XP
  'INCOME',
  234.56,
  NOW() - INTERVAL '6 days',
  'Dividendos ITSA4',
  'COMPLETED',
  'BANK_TRANSFER',
  'Rendimento mensal',
  '["investimento", "renda passiva"]',
  true,
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '6 days'
)
ON CONFLICT (id) DO NOTHING;

-- Transação 14: Despesa Cancelada
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  notes,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440014',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440004', -- Cartão Nubank
  'EXPENSE',
  299.00,
  NOW() - INTERVAL '2 days',
  'Compra cancelada - Amazon',
  'CANCELED',
  'CREDIT',
  'Produto com defeito - estornado',
  '["cancelado"]',
  false,
  NOW() - INTERVAL '2 days',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Transação 15: Despesa - Farmácia
INSERT INTO transactions (
  id,
  user_id,
  wallet_id,
  type,
  amount,
  date,
  description,
  status,
  payment_method,
  tags,
  is_recurring,
  created_at,
  updated_at
)
VALUES (
  '770e8400-e29b-41d4-a716-446655440015',
  '550e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440007', -- PicPay
  'EXPENSE',
  67.80,
  NOW() - INTERVAL '5 days',
  'Medicamentos',
  'COMPLETED',
  'PIX',
  '["saúde", "farmácia"]',
  false,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RESUMO DOS DADOS CRIADOS
-- =============================================
SELECT 
  '✓ Dados mock criados com sucesso!' as status,
  COUNT(*) FILTER (WHERE email = 'joao.silva@test.com') as usuarios_criados
FROM users;

SELECT 
  '✓ Carteiras criadas:' as status,
  COUNT(*) as total_carteiras,
  COUNT(*) FILTER (WHERE status = 'ACTIVE') as ativas,
  COUNT(*) FILTER (WHERE status = 'ARCHIVED') as arquivadas,
  COUNT(*) FILTER (WHERE is_primary = true) as principal
FROM wallets
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

SELECT 
  '✓ Transações criadas:' as status,
  COUNT(*) as total_transacoes,
  COUNT(*) FILTER (WHERE type = 'INCOME') as receitas,
  COUNT(*) FILTER (WHERE type = 'EXPENSE') as despesas,
  COUNT(*) FILTER (WHERE type = 'TRANSFER') as transferencias,
  COUNT(*) FILTER (WHERE status = 'COMPLETED') as completas,
  COUNT(*) FILTER (WHERE status = 'PENDING') as pendentes,
  COUNT(*) FILTER (WHERE status = 'CANCELED') as canceladas
FROM transactions
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

-- =============================================
-- CREDENCIAIS DE ACESSO
-- =============================================
-- Email: joao.silva@test.com
-- Senha: Test@123
-- =============================================
