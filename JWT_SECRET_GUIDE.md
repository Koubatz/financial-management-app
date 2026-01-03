# JWT Secret Management

## Overview

Este documento explica como gerenciar JWT secrets corretamente em ambientes de desenvolvimento e produção.

## Ambiente de Desenvolvimento

### Configuração Local

1. O JWT secret padrão para dev está definido no `docker-compose.dev.yml`:

```yaml
JWT_SECRET: 'dev-secret-key-change-in-production'
JWT_EXPIRES_IN: '7d'
```

2. Se quiser usar um arquivo `.env.local`:

```bash
cp .env.example .env.local
# Editar com seus valores
```

3. Executar o projeto:

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Ambiente de Produção

### Geração de Secret Seguro

Nunca use hardcoded secrets em produção. Gere uma chave aleatória forte:

```bash
# Linux/macOS
openssl rand -base64 32

# PowerShell (Windows)
$secureKey = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
$bytes = new-object byte[] 32
$secureKey.GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Configurar Variáveis de Ambiente

Defina as variáveis antes de iniciar o container:

```bash
# Docker run
docker run -e JWT_SECRET="sua-chave-aleatoria-aqui" ...

# Docker compose com arquivo .env
cat > .env << EOF
JWT_SECRET=sua-chave-aleatoria-aqui
JWT_EXPIRES_IN=7d
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=monorepo
POSTGRES_USER=user
POSTGRES_PASSWORD=sua-senha-segura
EOF

docker compose up --build
```

### Ambiente Kubernetes/Cloud

Use secrets management:

```bash
# Kubernetes
kubectl create secret generic jwt-secret --from-literal=JWT_SECRET="sua-chave-aqui"

# AWS Secrets Manager
aws secretsmanager create-secret --name jwt-secret --secret-string "sua-chave-aqui"

# Google Cloud Secret Manager
gcloud secrets create jwt-secret --data-file=-
```

## Validação

O projeto agora valida automaticamente:

- ✅ JWT_SECRET é obrigatório (obrigado em produção)
- ✅ JWT_SECRET é lido apenas de variáveis de ambiente
- ✅ JWT_EXPIRES_IN é opcional (padrão: 7d)
- ✅ Token expira após o tempo configurado

## Segurança

### Boas Práticas

1. **Nunca commite secrets** - Adicione `.env.local` ao `.gitignore`
2. **Use secrets diferentes** - Dev e produção devem ter secrets diferentes
3. **Rotação de chaves** - Considere trocar secrets periodicamente
4. **HTTPS em produção** - Sempre use HTTPS para transmitir tokens
5. **HttpOnly cookies** - Considere usar HttpOnly cookies para tokens

### Checklist de Produção

- [ ] JWT_SECRET é uma string aleatória forte (32+ bytes)
- [ ] JWT_SECRET não está versionado no git
- [ ] JWT_SECRET vem de variáveis de ambiente
- [ ] JWT_EXPIRES_IN está configurado apropriadamente
- [ ] HTTPS está ativado
- [ ] Tokens são validados corretamente

## Exemplo: Renovação de Token (Recomendado)

Para melhor segurança, implemente refresh tokens:

```typescript
// Implementar em auth.service.ts
async refresh(refreshToken: string) {
  const payload = await this.jwtService.verifyAsync(refreshToken);
  const user = await this.usersService.findOneById(payload.sub);

  return {
    access_token: await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    }),
  };
}
```

## Troubleshooting

### Erro: "JWT_SECRET not set"

```
Error: JWT_SECRET not set
```

**Solução**: Defina a variável de ambiente JWT_SECRET antes de iniciar o container

### Erro: "JsonWebTokenError: invalid token"

**Solução**: Verifique se o secret usado para verificar o token é o mesmo usado para assinar

### Erro: "TokenExpiredError"

**Solução**: O token expirou. Implemente refresh token ou faça o usuário fazer login novamente
