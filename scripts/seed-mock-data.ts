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

async function seedMockData() {
  console.log('🌱 Iniciando seed de dados mock...\n');

  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'financial_app',
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

    // 3. Resumo
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

    const stats = walletStats.rows[0];
    console.log(`   Total de carteiras: ${stats.total}`);
    console.log(`   Carteiras ativas: ${stats.ativas}`);
    console.log(`   Carteiras arquivadas: ${stats.arquivadas}`);
    console.log(`   Carteira principal: ${stats.principal}`);
    console.log(`   Criadas nesta execução: ${created}`);
    console.log(`   Puladas (já existiam): ${skipped}`);

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
