import * as React from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Option } from '@/components/ui/option';
import { walletsApi, type Wallet } from '@/services/wallets';
import { cn } from '@/lib/utils';

type CardNetwork = 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX';

interface CreditCardFormData {
  walletId: string;
  cardNumber: string;
  holderName: string;
  expiryDate: string;
  cvv: string;
  bank: string;
  cardNetwork: CardNetwork;
  cardType: string;
  creditLimit: string;
}

interface CreditCardModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
  closeOnSubmit?: boolean;
  onSubmit?: (data: CreditCardFormData) => void;
  onClose: () => void;
}

function CreditCardModal({
  open,
  title = 'Novo Cartão de Crédito',
  description = 'Preencha os dados do cartão de crédito.',
  confirmLabel = 'Salvar Cartão',
  cancelLabel = 'Cancelar',
  closeOnSubmit = true,
  onSubmit,
  onClose,
  className,
  ...props
}: CreditCardModalProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const [wallets, setWallets] = React.useState<Wallet[]>([]);
  const [loadingWallets, setLoadingWallets] = React.useState(true);

  React.useEffect(() => {
    const fetchWallets = async () => {
      try {
        const data = await walletsApi.getAll();
        setWallets(data.filter((w) => w.walletType === 'CREDIT_CARD' && w.status === 'ACTIVE'));
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

  const initialData = React.useMemo<CreditCardFormData>(
    () => ({
      walletId: wallets[0]?.id ?? '',
      cardNumber: '',
      holderName: '',
      expiryDate: '',
      cvv: '',
      bank: '',
      cardNetwork: 'VISA',
      cardType: 'CREDIT',
      creditLimit: '',
    }),
    [wallets],
  );

  const [formData, setFormData] = React.useState<CreditCardFormData>(initialData);

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

  const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length >= 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
  };

  const handleCreditLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numbers = value.replace(/\D/g, '');

    if (numbers === '') {
      setFormData((prev) => ({ ...prev, creditLimit: '' }));
      return;
    }

    const numericValue = (parseInt(numbers, 10) / 100).toFixed(2);
    setFormData((prev) => ({ ...prev, creditLimit: numericValue }));
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
          {/* Conta Vinculada */}
          <Select
            label="Conta Vinculada *"
            value={formData.walletId}
            onChange={(event) => setFormData((prev) => ({ ...prev, walletId: event.target.value }))}
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

          {/* Número do Cartão */}
          <Input
            label="Número do Cartão *"
            type="text"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            required
          />

          {/* Nome do Titular */}
          <Input
            label="Nome do Titular *"
            type="text"
            placeholder="Nome como está no cartão"
            value={formData.holderName}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, holderName: event.target.value }))
            }
            required
          />

          {/* Data de Validade e CVV */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Validade *"
              type="text"
              placeholder="MM/AA"
              maxLength={5}
              value={formData.expiryDate}
              onChange={handleExpiryDateChange}
              required
            />

            <Input
              label="CVV"
              type="text"
              placeholder="123"
              maxLength={4}
              value={formData.cvv}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, cvv: event.target.value.replace(/\D/g, '') }))
              }
            />
          </div>

          {/* Banco */}
          <Input
            label="Banco *"
            type="text"
            placeholder="Ex: Nubank, Itaú, Bradesco"
            value={formData.bank}
            onChange={(event) => setFormData((prev) => ({ ...prev, bank: event.target.value }))}
            required
          />

          {/* Bandeira e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Bandeira *"
              value={formData.cardNetwork}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  cardNetwork: event.target.value as CardNetwork,
                }))
              }
              required
            >
              <Option value="VISA">Visa</Option>
              <Option value="MASTERCARD">Mastercard</Option>
              <Option value="ELO">Elo</Option>
              <Option value="AMEX">American Express</Option>
            </Select>

            <Input
              label="Tipo *"
              type="text"
              placeholder="Ex: Crédito, Crédito Internacional"
              value={formData.cardType}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, cardType: event.target.value }))
              }
              required
            />
          </div>

          {/* Limite de Crédito */}
          <Input
            label="Limite de Crédito *"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={formatCurrency(formData.creditLimit)}
            onChange={handleCreditLimitChange}
            required
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

export { CreditCardModal };
export type { CreditCardFormData };
