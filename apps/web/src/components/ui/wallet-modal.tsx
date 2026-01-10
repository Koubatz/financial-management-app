import * as React from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Option } from '@/components/ui/option';
import { cn } from '@/lib/utils';

type WalletType = 'CASH' | 'BANK' | 'CREDIT_CARD' | 'INVESTMENT';
type BankAccountType = 'CHECKING' | 'SAVINGS';

interface WalletFormData {
  name: string;
  walletType: WalletType;
  currency: string;
  initialBalance: string;
  description?: string;
  institution?: string;
  isPrimary?: boolean;
  // Credit card fields
  creditLimit?: string;
  billingCloseDay?: string;
  billingDueDay?: string;
  // Bank fields
  accountType?: BankAccountType;
  bankName?: string;
  // Digital wallet
  digitalWalletProvider?: string;
}

interface WalletModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  defaultValues?: Partial<WalletFormData>;
  closeOnSubmit?: boolean;
  onSubmit?: (data: WalletFormData) => void;
  onClose: () => void;
}

function WalletModal({
  open,
  title = 'Nova Conta',
  description = 'Preencha os dados para cadastrar uma nova conta.',
  confirmLabel = 'Salvar conta',
  cancelLabel = 'Cancelar',
  defaultValues,
  closeOnSubmit = true,
  onSubmit,
  onClose,
  className,
  ...props
}: WalletModalProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  const initialData = React.useMemo<WalletFormData>(
    () => ({
      name: defaultValues?.name ?? '',
      walletType: defaultValues?.walletType ?? 'CASH',
      currency: defaultValues?.currency ?? 'BRL',
      initialBalance: defaultValues?.initialBalance ?? '0',
      description: defaultValues?.description ?? '',
      institution: defaultValues?.institution ?? '',
      isPrimary: defaultValues?.isPrimary ?? false,
      creditLimit: defaultValues?.creditLimit ?? '',
      billingCloseDay: defaultValues?.billingCloseDay ?? '',
      billingDueDay: defaultValues?.billingDueDay ?? '',
      accountType: defaultValues?.accountType ?? 'CHECKING',
      bankName: defaultValues?.bankName ?? '',
      digitalWalletProvider: defaultValues?.digitalWalletProvider ?? '',
    }),
    [defaultValues],
  );

  const [formData, setFormData] = React.useState<WalletFormData>(initialData);

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

  const showCreditCardFields = formData.walletType === 'CREDIT_CARD';
  const showBankFields = formData.walletType === 'BANK';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={onClose}
      {...props}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto',
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

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
          {/* Nome da Carteira */}
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Nome da Conta *
            <input
              type="text"
              placeholder="Ex: Pessoal, Empresa, Viagem"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>

          {/* Tipo de Carteira */}
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Tipo de Conta *
            <Select
              value={formData.walletType}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  walletType: event.target.value as WalletType,
                }))
              }
              required
            >
              <Option value="CASH">Dinheiro</Option>
              <Option value="BANK">Conta Bancária</Option>
              <Option value="CREDIT_CARD">Cartão de Crédito</Option>
              <Option value="INVESTMENT">Investimentos</Option>
            </Select>
          </label>

          {/* Moeda */}
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Moeda *
            <Select
              value={formData.currency}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, currency: event.target.value }))
              }
              required
            >
              <Option value="BRL">BRL - Real Brasileiro</Option>
              <Option value="USD">USD - Dólar Americano</Option>
              <Option value="EUR">EUR - Euro</Option>
            </Select>
          </label>

          {/* Saldo Inicial */}
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Saldo Inicial *
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="0,00"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.initialBalance}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, initialBalance: event.target.value }))
              }
              required
            />
          </label>

          {/* Descrição */}
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Descrição
            <textarea
              placeholder="Descrição da conta (opcional)"
              rows={2}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </label>

          {/* Instituição Financeira */}
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Instituição Financeira
            <input
              type="text"
              placeholder="Ex: Banco do Brasil, Nubank"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.institution}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, institution: event.target.value }))
              }
            />
          </label>

          {/* Campos específicos do Cartão de Crédito */}
          {showCreditCardFields && (
            <>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Limite do Cartão *
                <input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0,00"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={formData.creditLimit}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, creditLimit: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-foreground">
                Dia de Fechamento da Fatura *
                <input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="1-31"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={formData.billingCloseDay}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, billingCloseDay: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-foreground">
                Dia de Vencimento da Fatura *
                <input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="1-31"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={formData.billingDueDay}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, billingDueDay: event.target.value }))
                  }
                  required
                />
              </label>
            </>
          )}

          {/* Campos específicos da Conta Bancária */}
          {showBankFields && (
            <>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Tipo da Conta *
                <Select
                  value={formData.accountType}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountType: event.target.value as BankAccountType,
                    }))
                  }
                  required
                >
                  <Option value="CHECKING">Corrente</Option>
                  <Option value="SAVINGS">Poupança</Option>
                </Select>
              </label>

              <label className="grid gap-2 text-sm font-medium text-foreground">
                Nome do Banco *
                <input
                  type="text"
                  placeholder="Ex: Banco do Brasil"
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={formData.bankName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, bankName: event.target.value }))
                  }
                  required
                />
              </label>
            </>
          )}

          {/* Carteira Digital */}
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Carteira Digital
            <input
              type="text"
              placeholder="Ex: PicPay, PayPal"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.digitalWalletProvider}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, digitalWalletProvider: event.target.value }))
              }
            />
          </label>

          {/* Conta Principal */}
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-200 text-primary focus:ring-2 focus:ring-ring"
              checked={formData.isPrimary}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, isPrimary: event.target.checked }))
              }
            />
            Definir como conta principal
          </label>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button type="submit">{confirmLabel}</Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export { WalletModal };
export type { WalletFormData, WalletType, BankAccountType };
