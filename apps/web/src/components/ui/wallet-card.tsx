import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Wallet } from '@/services/wallets';
import { CreditCard, Wallet as WalletIcon, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from './button';

interface WalletCardProps {
  wallet: Wallet;
  onEdit?: (wallet: Wallet) => void;
  onArchive?: (wallet: Wallet) => void;
}

const walletTypeIcons = {
  CASH: DollarSign,
  BANK: WalletIcon,
  CREDIT_CARD: CreditCard,
  INVESTMENT: TrendingUp,
};

const walletTypeLabels = {
  CASH: 'Dinheiro',
  BANK: 'Conta Bancária',
  CREDIT_CARD: 'Cartão de Crédito',
  INVESTMENT: 'Investimentos',
};

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

export function WalletCard({ wallet, onEdit, onArchive }: WalletCardProps) {
  const Icon = walletTypeIcons[wallet.walletType];
  const isArchived = wallet.status === 'ARCHIVED';

  return (
    <Card className={`relative ${isArchived ? 'opacity-60 bg-gray-50' : ''}`}>
      {wallet.isPrimary && !isArchived && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
          Principal
        </div>
      )}

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{wallet.name}</h3>
            <p className="text-sm text-muted-foreground">{walletTypeLabels[wallet.walletType]}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Saldo */}
          <div>
            <p className="text-sm text-muted-foreground">Saldo</p>
            <p
              className={`text-2xl font-bold ${wallet.initialBalance < 0 ? 'text-red-600' : 'text-green-600'}`}
            >
              {formatCurrency(wallet.initialBalance, wallet.currency)}
            </p>
          </div>

          {/* Informações específicas por tipo */}
          {wallet.walletType === 'CREDIT_CARD' && wallet.creditLimit && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Limite</p>
              <p className="text-sm font-medium">
                {formatCurrency(wallet.creditLimit, wallet.currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Disponível:{' '}
                {formatCurrency(wallet.creditLimit + wallet.initialBalance, wallet.currency)}
              </p>
            </div>
          )}

          {wallet.walletType === 'BANK' && wallet.bankName && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Banco</p>
              <p className="text-sm font-medium">{wallet.bankName}</p>
              {wallet.accountType && (
                <p className="text-xs text-muted-foreground">
                  {wallet.accountType === 'CHECKING' ? 'Corrente' : 'Poupança'}
                </p>
              )}
            </div>
          )}

          {wallet.institution && wallet.walletType !== 'BANK' && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Instituição</p>
              <p className="text-sm font-medium">{wallet.institution}</p>
            </div>
          )}

          {wallet.description && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">{wallet.description}</p>
            </div>
          )}

          {isArchived && (
            <div className="pt-2 border-t">
              <p className="text-xs text-orange-600 font-medium">⚠️ Carteira arquivada</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit?.(wallet)} className="flex-1">
          Editar
        </Button>
        {!isArchived && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onArchive?.(wallet)}
            className="text-orange-600 hover:text-orange-700"
          >
            Arquivar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
