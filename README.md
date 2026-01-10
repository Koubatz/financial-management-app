# 💰 Financial Management App

Aplicação completa de gestão financeira pessoal construída com arquitetura monorepo, permitindo gerenciamento de carteiras, transações e visualização de dados financeiros.

---

## 🚀 Tecnologias Utilizadas

### **Arquitetura & Build Tools**

- **Monorepo**: Turbo + pnpm workspace
- **Package Manager**: pnpm 10.27.0
- **Build System**: Turborepo 2.5.8
- **TypeScript**: 5.9.3

### **Backend (API)**

- **Framework**: NestJS 10.4.13
- **Runtime**: Node.js 20
- **Banco de Dados**: PostgreSQL (com connection pooling)
- **Autenticação**: JWT (JSON Web Tokens)
- **Segurança**: Argon2 (hash de senhas)
- **Validação**: Joi 18.0.1
- **Testing**: Vitest 2.1.4
- **HTTP Server**: Express 4.18.2

### **Frontend (Web)**

- **Framework**: React 19.1.1
- **Build Tool**: Vite 5.0
- **Roteamento**: React Router DOM 7.11.0
- **State Management**: Zustand 5.0.2
- **Estilização**: TailwindCSS 4.1.17
- **Componentes UI**: Radix UI (acessibilidade)
- **Requisições HTTP**: Axios 1.13.2
- **Gráficos**: Recharts 2.15.4
- **Ícones**: Lucide React 0.562.0

### **DevOps & Infraestrutura**

- **Containerização**: Docker + Docker Compose
- **Ambiente de Desenvolvimento**: Hot Module Replacement (HMR)
- **Linting**: ESLint 9.38.0
- **Formatação**: Prettier 3.6.2
- **CI/CD**: Configurado para multi-stage builds

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js**: versão 20 ou superior
- **pnpm**: versão 10.27.0
  ```bash
  npm install -g pnpm@10.27.0
  ```
- **Docker** e **Docker Compose** (para execução containerizada)

---

## 🔧 Instalação

### 1️⃣ Clone o repositório

```bash
git clone <url-do-repositorio>
cd financial-management-app
```

### 2️⃣ Instale as dependências

```bash
pnpm install
```

---

## 🏃 Como Rodar a Aplicação Localmente

### **Opção 1: Usando Docker (Recomendado)**

A maneira mais simples de rodar a aplicação completa:

#### 1. Suba todos os serviços (API + Web + PostgreSQL)

```bash
docker-compose -f docker-compose.dev.yml up
```

#### 2. Acesse a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

#### 3. Seed de dados (opcional)

Para popular o banco com dados de exemplo:

```bash
pnpm seed
```

#### Comandos úteis do Docker

```bash
# Parar todos os containers
docker-compose -f docker-compose.dev.yml down

# Rebuild após mudanças no Dockerfile
docker-compose -f docker-compose.dev.yml up --build

# Ver logs específicos
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f web
```

---

### **Opção 2: Execução Local (Sem Docker)**

⚠️ **Requisito**: PostgreSQL deve estar instalado e rodando

#### 1. Instale e inicie o PostgreSQL

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**

```bash
brew install postgresql@16
brew services start postgresql@16
```

**Verifique se está rodando:**

```bash
sudo systemctl status postgresql  # Linux
brew services list                # macOS
```

#### 2. Crie o banco de dados

```bash
# Acesse o PostgreSQL
sudo -u postgres psql

# Dentro do psql, execute:
CREATE DATABASE monorepo;
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE monorepo TO user;
\q
```

#### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
# Copie o arquivo .env.example para .env
cp apps/api/.env.example apps/api/.env
```

Edite o arquivo `apps/api/.env` com suas configurações:

```env
NODE_ENV=development
PORT=3000

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=monorepo
POSTGRES_USER=user
POSTGRES_PASSWORD=password

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

#### 4. Execute as migrações do banco

```bash
# Popular o banco com dados de exemplo
pnpm seed
```

#### 5. Inicie o backend e frontend simultaneamente

```bash
# Em um terminal, inicie ambos os serviços
pnpm dev
```

**⚠️ Se encontrar erro `ECONNREFUSED 127.0.0.1:5432`:**

- Certifique-se de que o PostgreSQL está rodando: `sudo systemctl status postgresql`
- Verifique se a porta 5432 está aberta: `sudo netstat -plnt | grep 5432`
- Considere usar Docker (Opção 1) que é mais simples

**OU inicie separadamente:**

```bash
# Terminal 1 - Backend API
cd apps/api
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

#### 5. Acesse a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## 📦 Scripts Disponíveis

### Scripts Globais (raiz do monorepo)

```bash
pnpm dev          # Inicia backend e frontend em modo desenvolvimento
pnpm build        # Compila todos os projetos
pnpm lint         # Executa linting em todos os projetos
pnpm test         # Executa testes em todos os projetos
pnpm seed         # Popula o banco com dados de exemplo
```

### Scripts do Backend (`apps/api`)

```bash
pnpm dev          # Desenvolvimento com hot-reload
pnpm build        # Compila TypeScript para JavaScript
pnpm start        # Inicia servidor em produção
pnpm test         # Executa testes unitários
pnpm lint         # Verifica código com ESLint
```

### Scripts do Frontend (`apps/web`)

```bash
pnpm dev          # Desenvolvimento com Vite HMR
pnpm build        # Build de produção
pnpm preview      # Preview do build de produção
pnpm lint         # Verifica código com ESLint
pnpm lint:fix     # Corrige problemas de linting automaticamente
```

---

## 🗂️ Estrutura do Projeto

```
financial-management-app/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/          # Módulo de autenticação (JWT)
│   │   │   ├── users/         # Gestão de usuários
│   │   │   ├── wallets/       # Gestão de carteiras
│   │   │   ├── transactions/  # Gestão de transações
│   │   │   ├── database/      # Conexão PostgreSQL
│   │   │   └── config/        # Configurações (env, JWT, DB)
│   │   └── package.json
│   │
│   └── web/                    # Frontend React
│       ├── src/
│       │   ├── pages/         # Páginas (Dashboard, Wallets, etc)
│       │   ├── components/    # Componentes reutilizáveis
│       │   ├── services/      # API clients (axios)
│       │   ├── hooks/         # Custom hooks
│       │   ├── contexts/      # React contexts
│       │   └── store/         # Zustand stores
│       └── package.json
│
├── packages/
│   ├── tsconfig/              # Configurações TypeScript compartilhadas
│   └── utils/                 # Utilitários compartilhados
│
├── scripts/
│   └── seed-mock-data.ts      # Script de seed do banco
│
├── docker-compose.dev.yml     # Desenvolvimento com Docker
├── docker-compose.yml         # Produção
├── Dockerfile                 # Build de produção
├── Dockerfile.dev             # Build de desenvolvimento
├── turbo.json                 # Configuração Turborepo
├── pnpm-workspace.yaml        # Workspace configuration
└── package.json               # Root package.json
```

---

## 🔐 Autenticação

A aplicação utiliza JWT (JSON Web Tokens) para autenticação:

1. **Login**: POST `/auth/login` com email e senha
2. **Token**: JWT retornado e armazenado no `localStorage`
3. **Proteção**: Todas as rotas (exceto `/login`) requerem autenticação
4. **Segurança**: Senhas hashadas com Argon2

### Usuário Padrão (após seed)

```
Email: joao.silva@test.com
Senha: Test@123
```

---

## 🎨 Funcionalidades

- ✅ **Autenticação JWT** (login/logout)
- ✅ **Gestão de Carteiras** (criar, editar, arquivar)
- ✅ **Gestão de Transações** (receitas e despesas)
- ✅ **Dashboard** com visualização de dados
- ✅ **Gráficos** de receitas vs despesas
- ✅ **Filtros** por período e categoria
- ✅ **Múltiplas moedas** suportadas
- ✅ **Responsive Design** (mobile-friendly)
- ✅ **Tema customizável** (Tailwind CSS)

---

## 🧪 Testes

### Backend

```bash
cd apps/api
pnpm test
```

### Frontend

```bash
cd apps/web
pnpm test
```

---

## 📝 Variáveis de Ambiente

### Backend (`apps/api/.env`)

| Variável            | Descrição            | Padrão        |
| ------------------- | -------------------- | ------------- |
| `NODE_ENV`          | Ambiente de execução | `development` |
| `PORT`              | Porta do servidor    | `3000`        |
| `POSTGRES_HOST`     | Host do PostgreSQL   | `localhost`   |
| `POSTGRES_PORT`     | Porta do PostgreSQL  | `5432`        |
| `POSTGRES_DB`       | Nome do banco        | `monorepo`    |
| `POSTGRES_USER`     | Usuário do banco     | `user`        |
| `POSTGRES_PASSWORD` | Senha do banco       | `password`    |
| `JWT_SECRET`        | Chave secreta do JWT | _obrigatório_ |
| `JWT_EXPIRES_IN`    | Expiração do token   | `7d`          |

### Frontend (`apps/web/.env`)

| Variável       | Descrição          | Padrão                  |
| -------------- | ------------------ | ----------------------- |
| `VITE_API_URL` | URL da API backend | `http://localhost:3000` |

---

## 🐳 Deploy com Docker

### Build de Produção

```bash
# Build da API
docker build -t financial-api --target api-runner .

# Build do Web
docker build -t financial-web --target web-runner .
```

### Executar em Produção

```bash
docker-compose up -d
```

---

## 🛠️ Solução de Problemas

### ❌ Erro: `connect ECONNREFUSED 127.0.0.1:5432`

**Problema**: PostgreSQL não está rodando

**Solução 1 - Usar Docker (Recomendado):**

```bash
# Pare o pnpm dev se estiver rodando
docker compose -f docker-compose.dev.yml up
```

**Solução 2 - Instalar PostgreSQL localmente:**

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl status postgresql

# macOS
brew install postgresql@16
brew services start postgresql@16
brew services list

# Verifique se a porta 5432 está aberta
sudo netstat -plnt | grep 5432  # Linux
lsof -i :5432                   # macOS
```

### ❌ Erro: `JWT_SECRET is required`

**Problema**: Variáveis de ambiente não configuradas

**Solução:**

```bash
# Copie o arquivo de exemplo
cp apps/api/.env.example apps/api/.env

# Edite apps/api/.env e adicione JWT_SECRET
```

### Porta 3000 ou 5173 já em uso

```bash
# Encontre e mate o processo
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Docker: node_modules não sincronizado

```bash
# Rebuild com volumes limpos
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Erro de conexão com PostgreSQL

Verifique se:

- PostgreSQL está rodando
- Credenciais estão corretas no `.env`
- Porta 5432 está disponível

```bash
# Teste a conexão
psql -h localhost -U user -d monorepo
```

---

## 📚 Documentação Adicional

- [Otimização de Bundle](BUNDLE_OPTIMIZATION.md)
- [Solução de Dynamic Imports](DYNAMIC_IMPORTS_SOLUTION.md)
- [Guia de JWT Secret](JWT_SECRET_GUIDE.md)

---

## 👥 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---
