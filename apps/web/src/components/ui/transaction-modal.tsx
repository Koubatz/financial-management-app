import * as React from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Option } from '@/components/ui/option';
import { walletsApi, type Wallet } from '@/services/wallets';
import { cn } from '@/lib/utils';

type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
type TransactionStatus = 'COMPLETED' | 'PENDING' | 'CANCELED';
type PaymentMethod = 'CASH' | 'DEBIT' | 'CREDIT' | 'PIX' | 'BANK_TRANSFER' | 'OTHER';

interface TransactionFormData {
  amount: string;
  type: TransactionType;
  description: string;
  walletId: string;
  date: string;
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  sourceWalletId?: string;
  destinationWalletId?: string;
}

interface TransactionModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  defaultValues?: Partial<TransactionFormData>;
  closeOnSubmit?: boolean;
  onSubmit?: (data: TransactionFormData) => void;
  onClose: () => void;
}

function TransactionModal({
  open,
  title = 'Nova transação',
  description = 'Preencha os dados para registrar a movimentação.',
  confirmLabel = 'Salvar transação',
  cancelLabel = 'Cancelar',
  defaultValues,
  closeOnSubmit = true,
  onSubmit,
  onClose,
  className,
  ...props
}: TransactionModalProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const [wallets, setWallets] = React.useState<Wallet[]>([]);
  const [loadingWallets, setLoadingWallets] = React.useState(true);

  React.useEffect(() => {
    const fetchWallets = async () => {
      try {
        const data = await walletsApi.getAll();
        setWallets(data.filter((w) => w.status === 'ACTIVE'));
      } catch (error) {
        console.error('Erro ao carregar carteiras:', error);
      } finally {
        setLoadingWallets(false);
      }
    };

    if (open) {
      void fetchWallets();
    }
  }, [open]);

  const initialData = React.useMemo<TransactionFormData>(
    () => ({
      amount: defaultValues?.amount ?? '',
      type: defaultValues?.type ?? 'EXPENSE',
      description: defaultValues?.description ?? '',
      walletId: defaultValues?.walletId ?? wallets[0]?.id ?? '',
      date: defaultValues?.date ?? '',
      status: defaultValues?.status ?? 'COMPLETED',
      paymentMethod: defaultValues?.paymentMethod ?? 'CASH',
      notes: defaultValues?.notes ?? '',
      sourceWalletId: defaultValues?.sourceWalletId,
      destinationWalletId: defaultValues?.destinationWalletId,
    }),
    [wallets, defaultValues],
  );

  const [formData, setFormData] = React.useState<TransactionFormData>(initialData);

  React.useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(formData);
    if (closeOnSubmit) {
      onClose();
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');

    if (numbers === '') {
      setFormData((prev) => ({ ...prev, amount: '' }));
      return;
    }

    // Converte para número e divide por 100 para ter centavos
    const numericValue = (parseInt(numbers, 10) / 100).toFixed(2);
    setFormData((prev) => ({ ...prev, amount: numericValue }));
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return '';

    return numericValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Fechar apenas se clicar no backdrop, não em elementos filhos
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={handleBackdropClick}
      {...props}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />
      <div
        className={cn(
          'relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl',
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-2">
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="p-1 mt-2 grid gap-4 max-h-[60vh] overflow-y-auto">
          {/* Tipo de Transação */}
          <Select
            label="Tipo de Transação *"
            value={formData.type}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                type: event.target.value as TransactionType,
              }))
            }
            required
          >
            <Option value="INCOME">Receita</Option>
            <Option value="EXPENSE">Despesa</Option>
            <Option value="TRANSFER">Transferência</Option>
          </Select>

          {/* Valor */}
          <Input
            label="Valor *"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={formatCurrency(formData.amount)}
            onChange={handleAmountChange}
            required
          />

          {/* Descrição */}
          <Input
            label="Descrição *"
            type="text"
            placeholder="Ex: Salário, Compra no mercado, Transferência"
            value={formData.description}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, description: event.target.value }))
            }
            required
          />

          {/* Carteira Vinculada */}
          {formData.type !== 'TRANSFER' && (
            <Select
              label="Conta Vinculada *"
              value={formData.walletId}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, walletId: event.target.value }))
              }
              required
            >
              {loadingWallets ? (
                <Option value="">Carregando contas...</Option>
              ) : wallets.length > 0 ? (
                wallets.map((wallet) => (
                  <Option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({wallet.currency})
                  </Option>
                ))
              ) : (
                <Option value="">Nenhuma conta disponível</Option>
              )}
            </Select>
          )}

          {/* Transferência - Contas de Origem e Destino */}
          {formData.type === 'TRANSFER' && (
            <>
              <Select
                label="Conta de Origem *"
                value={formData.sourceWalletId || ''}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, sourceWalletId: event.target.value }))
                }
                required
              >
                <Option value="">Selecione uma conta...</Option>
                {wallets.map((wallet) => (
                  <Option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({wallet.currency})
                  </Option>
                ))}
              </Select>

              <Select
                label="Conta de Destino *"
                value={formData.destinationWalletId || ''}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, destinationWalletId: event.target.value }))
                }
                required
              >
                <Option value="">Selecione uma conta...</Option>
                {wallets.map((wallet) => (
                  <Option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({wallet.currency})
                  </Option>
                ))}
              </Select>
            </>
          )}

          {/* Data */}
          <Input
            label="Data da Transação *"
            type="date"
            value={formData.date}
            onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
            required
          />

          {/* Status */}
          <Select
            label="Status"
            value={formData.status || 'COMPLETED'}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                status: event.target.value as TransactionStatus,
              }))
            }
          >
            <Option value="COMPLETED">Concluída</Option>
            <Option value="PENDING">Pendente</Option>
            <Option value="CANCELED">Cancelada</Option>
          </Select>

          {/* Método de Pagamento */}
          <Select
            label="Método de Pagamento"
            value={formData.paymentMethod || 'CASH'}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                paymentMethod: event.target.value as PaymentMethod,
              }))
            }
          >
            <Option value="CASH">Dinheiro</Option>
            <Option value="DEBIT">Débito</Option>
            <Option value="CREDIT">Crédito</Option>
            <Option value="PIX">PIX</Option>
            <Option value="BANK_TRANSFER">Transferência Bancária</Option>
            <Option value="OTHER">Outro</Option>
          </Select>

          {/* Notas */}
          <Input
            label="Notas"
            type="text"
            placeholder="Observações adicionais (opcional)"
            value={formData.notes || ''}
            onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
          />

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={loadingWallets}>
              {confirmLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export { TransactionModal };
export type { TransactionFormData, TransactionType };
