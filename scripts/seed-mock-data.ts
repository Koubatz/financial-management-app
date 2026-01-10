import { Pool } from 'pg';
import * as argon2 from 'argon2';

/**
 * Script para criar dados mock de teste
 * Executa: pnpm tsx scripts/seed-mock-data.ts
 */

const MOCK_USER = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'João Silva',
  email: 'joao.silva@test.com',
  password: 'Test@123',
};

const MOCK_WALLETS = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    name: 'Carteira Pessoal',
    walletType: 'CASH',
    currency: 'BRL',
    initialBalance: 1500.0,
    description: 'Dinheiro em espécie para gastos do dia a dia',
    isPrimary: true,
    status: 'ACTIVE',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    name: 'Conta Corrente',
    walletType: 'BANK',
    currency: 'BRL',
    initialBalance: 8500.5,
    description: 'Conta principal para recebimento de salário',
    institution: 'Banco do Brasil',
    accountType: 'CHECKING',
    bankName: 'Banco do Brasil',
    status: 'ACTIVE',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    name: 'Poupança',
    walletType: 'BANK',
    currency: 'BRL',
    initialBalance: 12000.0,
    description: 'Reserva de emergência',
    institution: 'Caixa Econômica Federal',
    accountType: 'SAVINGS',
    bankName: 'Caixa Econômica Federal',
    status: 'ACTIVE',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440004',
    name: 'Cartão Nubank',
    walletType: 'CREDIT_CARD',
    currency: 'BRL',
    initialBalance: -850.0,
    description: 'Cartão para compras online e cashback',
    institution: 'Nubank',
    creditLimit: 5000.0,
    billingCloseDay: 15,
    billingDueDay: 25,
    digitalWalletProvider: 'Nubank',
    status: 'ACTIVE',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440005',
    name: 'Visa Internacional',
    walletType: 'CREDIT_CARD',
    currency: 'USD',
    initialBalance: -125.5,
    description: 'Cartão para viagens internacionais',
    institution: 'Banco Itaú',
    creditLimit: 3000.0,
    billingCloseDay: 10,
    billingDueDay: 20,
    status: 'ACTIVE',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440006',
    name: 'Investimentos XP',
    walletType: 'INVESTMENT',
    currency: 'BRL',
    initialBalance: 45000.0,
    description: 'Carteira de investimentos diversificada',
    institution: 'XP Investimentos',
    status: 'ACTIVE',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440007',
    name: 'PicPay',
    walletType: 'BANK',
    currency: 'BRL',
    initialBalance: 350.0,
    description: 'Carteira digital para pagamentos rápidos',
    institution: 'PicPay',
    accountType: 'CHECKING',
    bankName: 'PicPay',
    digitalWalletProvider: 'PicPay',
    status: 'ACTIVE',
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440008',
    name: 'Conta Antiga',
    walletType: 'BANK',
    currency: 'BRL',
    initialBalance: 0.0,
    description: 'Conta bancária que não uso mais',
    institution: 'Santander',
    accountType: 'CHECKING',
    bankName: 'Santander',
    status: 'ARCHIVED',
  },
];

const MOCK_CREDIT_CARDS = [
  {
    id: '770e8400-e29b-41d4-a716-446655440001',
    walletId: '660e8400-e29b-41d4-a716-446655440004', // Cartão Nubank
    cardNumber: '5162 4512 3456 7890',
    holderName: 'João Silva',
    expiryDate: '12/28',
    cvv: '123',
    bank: 'Nubank',
    cardNetwork: 'MASTERCARD',
    cardType: 'Crédito',
    creditLimit: 5000.0,
    usedLimit: 1250.75,
    status: 'ACTIVE',
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    walletId: '660e8400-e29b-41d4-a716-446655440005', // Visa Internacional
    cardNumber: '4532 1234 5678 9010',
    holderName: 'João Silva',
    expiryDate: '06/27',
    cvv: '456',
    bank: 'Banco Itaú',
    cardNetwork: 'VISA',
    cardType: 'Crédito Internacional',
    creditLimit: 3000.0,
    usedLimit: 580.25,
    status: 'ACTIVE',
  },
];

const MOCK_TRANSACTIONS = [
  // Despesas recentes
  {
    id: '880e8400-e29b-41d4-a716-446655440001',
    walletId: '660e8400-e29b-41d4-a716-446655440002', // Conta Corrente
    type: 'EXPENSE',
    amount: 125.5,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    description: 'Supermercado Extra',
    status: 'COMPLETED',
    paymentMethod: 'DEBIT',
    notes: 'Compras do mês',
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440002',
    walletId: '660e8400-e29b-41d4-a716-446655440001', // Carteira Pessoal
    type: 'EXPENSE',
    amount: 45.0,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    description: 'Restaurante - Almoço',
    status: 'COMPLETED',
    paymentMethod: 'CASH',
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440003',
    walletId: '660e8400-e29b-41d4-a716-446655440007', // PicPay
    type: 'EXPENSE',
    amount: 15.5,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    description: 'Uber - Corrida Centro',
    status: 'COMPLETED',
    paymentMethod: 'PIX',
  },
  // Receitas
  {
    id: '880e8400-e29b-41d4-a716-446655440004',
    walletId: '660e8400-e29b-41d4-a716-446655440002', // Conta Corrente
    type: 'INCOME',
    amount: 5500.0,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    description: 'Salário Janeiro/2026',
    status: 'COMPLETED',
    paymentMethod: 'BANK_TRANSFER',
    notes: 'Pagamento mensal',
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440005',
    walletId: '660e8400-e29b-41d4-a716-446655440007', // PicPay
    type: 'INCOME',
    amount: 250.0,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
    description: 'Freelance - Design Logo',
    status: 'COMPLETED',
    paymentMethod: 'PIX',
  },
  // Transferências
  {
    id: '880e8400-e29b-41d4-a716-446655440006',
    walletId: '660e8400-e29b-41d4-a716-446655440002', // Conta Corrente
    type: 'TRANSFER',
    amount: 1000.0,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
    description: 'Transferência para Poupança',
    status: 'COMPLETED',
    paymentMethod: 'BANK_TRANSFER',
    sourceWalletId: '660e8400-e29b-41d4-a716-446655440002',
    destinationWalletId: '660e8400-e29b-41d4-a716-446655440003',
  },
  // Despesas com cartão de crédito
  {
    id: '880e8400-e29b-41d4-a716-446655440007',
    walletId: '660e8400-e29b-41d4-a716-446655440004', // Cartão Nubank
    type: 'EXPENSE',
    amount: 299.9,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 dias atrás
    description: 'Netflix - Assinatura Anual',
    status: 'COMPLETED',
    paymentMethod: 'CREDIT',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440008',
    walletId: '660e8400-e29b-41d4-a716-446655440004', // Cartão Nubank
    type: 'EXPENSE',
    amount: 1200.0,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 dias atrás
    description: 'Notebook Dell - Parcelado em 12x',
    status: 'COMPLETED',
    paymentMethod: 'CREDIT',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    installmentNumber: 1,
    totalInstallments: 12,
  },
];

const MOCK_CARD_INSTALLMENTS = [
  // Parcelas do Notebook
  {
    id: '990e8400-e29b-41d4-a716-446655440001',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 1,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 0, 25), // 25/Jan/2026
    isPaid: true,
    paidDate: new Date(2026, 0, 24),
    description: 'Notebook Dell - Parcela 1/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440002',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 2,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 1, 25), // 25/Fev/2026
    isPaid: false,
    description: 'Notebook Dell - Parcela 2/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440003',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 3,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 2, 25), // 25/Mar/2026
    isPaid: false,
    description: 'Notebook Dell - Parcela 3/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440004',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 4,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 3, 25), // 25/Abr/2026
    isPaid: false,
    description: 'Notebook Dell - Parcela 4/12',
  },
  // Outras parcelas (5-12)
  {
    id: '990e8400-e29b-41d4-a716-446655440005',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 5,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 4, 25),
    isPaid: false,
    description: 'Notebook Dell - Parcela 5/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440006',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 6,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 5, 25),
    isPaid: false,
    description: 'Notebook Dell - Parcela 6/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440007',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 7,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 6, 25),
    isPaid: false,
    description: 'Notebook Dell - Parcela 7/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440008',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 8,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 7, 25),
    isPaid: false,
    description: 'Notebook Dell - Parcela 8/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440009',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 9,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 8, 25),
    isPaid: false,
    description: 'Notebook Dell - Parcela 9/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440010',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 10,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 9, 25),
    isPaid: false,
    description: 'Notebook Dell - Parcela 10/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440011',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 11,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 10, 25),
    isPaid: false,
    description: 'Notebook Dell - Parcela 11/12',
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440012',
    creditCardId: '770e8400-e29b-41d4-a716-446655440001',
    transactionId: '880e8400-e29b-41d4-a716-446655440008',
    installmentNumber: 12,
    totalInstallments: 12,
    amount: 100.0,
    dueDate: new Date(2026, 11, 25),
    isPaid: false,
    description: 'Notebook Dell - Parcela 12/12',
  },
];

async function seedMockData() {
  console.log('🌱 Iniciando seed de dados mock...\n');

  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'monorepo',
  });

  try {
    // 1. Criar usuário de teste
    console.log('👤 Criando usuário de teste...');
    const passwordHash = await argon2.hash(MOCK_USER.password);

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [
      MOCK_USER.email,
    ]);

    if (existingUser.rows.length > 0) {
      console.log(`   ⚠️  Usuário ${MOCK_USER.email} já existe. Pulando criação.`);
    } else {
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash)
         VALUES ($1, $2, $3, $4)`,
        [MOCK_USER.id, MOCK_USER.name, MOCK_USER.email, passwordHash],
      );
      console.log(`   ✓ Usuário criado: ${MOCK_USER.email}`);
    }

    // 2. Criar carteiras
    console.log('\n💼 Criando carteiras...');
    let created = 0;
    let skipped = 0;

    for (const wallet of MOCK_WALLETS) {
      const existingWallet = await pool.query('SELECT id FROM wallets WHERE id = $1', [wallet.id]);

      if (existingWallet.rows.length > 0) {
        console.log(`   ⚠️  Carteira "${wallet.name}" já existe. Pulando.`);
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO wallets (
          id, user_id, name, wallet_type, currency, initial_balance,
          description, institution, is_primary, status,
          credit_limit, billing_close_day, billing_due_day,
          account_type, bank_name, digital_wallet_provider,
          archived_at
        )
        VALUES (
          $1, $2, $3, $4::wallet_type, $5, $6, $7, $8, $9, $10::wallet_status,
          $11, $12, $13, $14::bank_account_type, $15, $16, $17
        )`,
        [
          wallet.id,
          MOCK_USER.id,
          wallet.name,
          wallet.walletType,
          wallet.currency,
          wallet.initialBalance,
          wallet.description || null,
          wallet.institution || null,
          wallet.isPrimary || false,
          wallet.status,
          (wallet as any).creditLimit || null,
          (wallet as any).billingCloseDay || null,
          (wallet as any).billingDueDay || null,
          (wallet as any).accountType || null,
          (wallet as any).bankName || null,
          (wallet as any).digitalWalletProvider || null,
          wallet.status === 'ARCHIVED' ? new Date() : null,
        ],
      );
      console.log(`   ✓ Carteira criada: ${wallet.name} (${wallet.walletType})`);
      created++;
    }

    // 3. Criar cartões de crédito
    console.log('\n💳 Criando cartões de crédito...');
    let cardsCreated = 0;
    let cardsSkipped = 0;

    for (const card of MOCK_CREDIT_CARDS) {
      const existingCard = await pool.query('SELECT id FROM credit_cards WHERE id = $1', [card.id]);

      if (existingCard.rows.length > 0) {
        console.log(
          `   ⚠️  Cartão "${card.bank} - ${card.cardNumber.slice(-4)}" já existe. Pulando.`,
        );
        cardsSkipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO credit_cards (
          id, user_id, wallet_id, card_number, holder_name, expiry_date, cvv,
          bank, card_network, card_type, credit_limit, used_limit, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          card.id,
          MOCK_USER.id,
          card.walletId,
          card.cardNumber,
          card.holderName,
          card.expiryDate,
          card.cvv,
          card.bank,
          card.cardNetwork,
          card.cardType,
          card.creditLimit,
          card.usedLimit,
          card.status,
        ],
      );
      console.log(
        `   ✓ Cartão criado: ${card.bank} - ${card.cardNetwork} (${card.cardNumber.slice(-4)})`,
      );
      cardsCreated++;
    }

    // 4. Criar transações
    console.log('\n💸 Criando transações...');
    let transactionsCreated = 0;
    let transactionsSkipped = 0;

    for (const transaction of MOCK_TRANSACTIONS) {
      const existingTransaction = await pool.query('SELECT id FROM transactions WHERE id = $1', [
        transaction.id,
      ]);

      if (existingTransaction.rows.length > 0) {
        console.log(`   ⚠️  Transação "${transaction.description}" já existe. Pulando.`);
        transactionsSkipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO transactions (
          id, user_id, wallet_id, type, amount, date, description, status,
          payment_method, notes, source_wallet_id, destination_wallet_id,
          credit_card_id, installment_number, total_installments
        )
        VALUES ($1, $2, $3, $4::transaction_type, $5, $6, $7, $8::transaction_status, 
                $9::payment_method, $10, $11, $12, $13, $14, $15)`,
        [
          transaction.id,
          MOCK_USER.id,
          transaction.walletId,
          transaction.type,
          transaction.amount,
          transaction.date,
          transaction.description,
          transaction.status,
          transaction.paymentMethod || null,
          (transaction as any).notes || null,
          (transaction as any).sourceWalletId || null,
          (transaction as any).destinationWalletId || null,
          (transaction as any).creditCardId || null,
          (transaction as any).installmentNumber || null,
          (transaction as any).totalInstallments || null,
        ],
      );
      console.log(
        `   ✓ Transação criada: ${transaction.description} - R$ ${transaction.amount.toFixed(2)}`,
      );
      transactionsCreated++;
    }

    // 5. Criar parcelas de cartão
    console.log('\n📅 Criando parcelas de cartão...');
    let installmentsCreated = 0;
    let installmentsSkipped = 0;

    for (const installment of MOCK_CARD_INSTALLMENTS) {
      const existingInstallment = await pool.query(
        'SELECT id FROM card_installments WHERE id = $1',
        [installment.id],
      );

      if (existingInstallment.rows.length > 0) {
        console.log(`   ⚠️  Parcela "${installment.description}" já existe. Pulando.`);
        installmentsSkipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO card_installments (
          id, credit_card_id, transaction_id, installment_number, total_installments,
          amount, due_date, is_paid, paid_date, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          installment.id,
          installment.creditCardId,
          installment.transactionId,
          installment.installmentNumber,
          installment.totalInstallments,
          installment.amount,
          installment.dueDate,
          installment.isPaid,
          (installment as any).paidDate || null,
          installment.description,
        ],
      );
      console.log(
        `   ✓ Parcela criada: ${installment.description} - R$ ${installment.amount.toFixed(2)} (${installment.isPaid ? 'PAGA' : 'PENDENTE'})`,
      );
      installmentsCreated++;
    }

    // 6. Resumo
    console.log('\n📊 Resumo:');
    const walletStats = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'ACTIVE') as ativas,
        COUNT(*) FILTER (WHERE status = 'ARCHIVED') as arquivadas,
        COUNT(*) FILTER (WHERE is_primary = true) as principal
       FROM wallets
       WHERE user_id = $1`,
      [MOCK_USER.id],
    );

    const transactionStats = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE type = 'INCOME') as receitas,
        COUNT(*) FILTER (WHERE type = 'EXPENSE') as despesas,
        COUNT(*) FILTER (WHERE type = 'TRANSFER') as transferencias,
        SUM(amount) FILTER (WHERE type = 'INCOME') as total_receitas,
        SUM(amount) FILTER (WHERE type = 'EXPENSE') as total_despesas
       FROM transactions
       WHERE user_id = $1`,
      [MOCK_USER.id],
    );

    const cardStats = await pool.query(
      `SELECT COUNT(*) as total FROM credit_cards WHERE user_id = $1`,
      [MOCK_USER.id],
    );

    const installmentStats = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_paid = true) as pagas,
        COUNT(*) FILTER (WHERE is_paid = false) as pendentes
       FROM card_installments ci
       JOIN credit_cards cc ON ci.credit_card_id = cc.id
       WHERE cc.user_id = $1`,
      [MOCK_USER.id],
    );

    const walletStatsData = walletStats.rows[0];
    const transactionStatsData = transactionStats.rows[0];
    const cardStatsData = cardStats.rows[0];
    const installmentStatsData = installmentStats.rows[0];

    console.log('\n  📁 Carteiras:');
    console.log(`     Total: ${walletStatsData.total}`);
    console.log(`     Ativas: ${walletStatsData.ativas}`);
    console.log(`     Arquivadas: ${walletStatsData.arquivadas}`);
    console.log(`     Criadas nesta execução: ${created}`);
    console.log(`     Puladas: ${skipped}`);

    console.log('\n  💳 Cartões de Crédito:');
    console.log(`     Total: ${cardStatsData.total}`);
    console.log(`     Criados nesta execução: ${cardsCreated}`);
    console.log(`     Pulados: ${cardsSkipped}`);

    console.log('\n  💸 Transações:');
    console.log(`     Total: ${transactionStatsData.total}`);
    console.log(
      `     Receitas: ${transactionStatsData.receitas} (R$ ${Number(transactionStatsData.total_receitas || 0).toFixed(2)})`,
    );
    console.log(
      `     Despesas: ${transactionStatsData.despesas} (R$ ${Number(transactionStatsData.total_despesas || 0).toFixed(2)})`,
    );
    console.log(`     Transferências: ${transactionStatsData.transferencias}`);
    console.log(`     Criadas nesta execução: ${transactionsCreated}`);
    console.log(`     Puladas: ${transactionsSkipped}`);

    console.log('\n  📅 Parcelas de Cartão:');
    console.log(`     Total: ${installmentStatsData.total}`);
    console.log(`     Pagas: ${installmentStatsData.pagas}`);
    console.log(`     Pendentes: ${installmentStatsData.pendentes}`);
    console.log(`     Criadas nesta execução: ${installmentsCreated}`);
    console.log(`     Puladas: ${installmentsSkipped}`);

    console.log('\n🎉 Seed concluído com sucesso!\n');
    console.log('📧 Credenciais de acesso:');
    console.log(`   Email: ${MOCK_USER.email}`);
    console.log(`   Senha: ${MOCK_USER.password}`);
    console.log('');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Executar seed
seedMockData();
