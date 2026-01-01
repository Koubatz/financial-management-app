import * as React from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TransactionType = 'credit' | 'debit';

interface TransactionFormData {
  amount: string;
  type: TransactionType;
  category: string;
  date: string;
}

interface TransactionModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  categories?: string[];
  defaultValues?: Partial<TransactionFormData>;
  closeOnSubmit?: boolean;
  onSubmit?: (data: TransactionFormData) => void;
  onClose: () => void;
}

const defaultCategories = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde'];

function TransactionModal({
  open,
  title = 'Nova transação',
  description = 'Preencha os dados para registrar a movimentação.',
  confirmLabel = 'Salvar transação',
  cancelLabel = 'Cancelar',
  categories = defaultCategories,
  defaultValues,
  closeOnSubmit = true,
  onSubmit,
  onClose,
  className,
  ...props
}: TransactionModalProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  const initialData = React.useMemo<TransactionFormData>(
    () => ({
      amount: defaultValues?.amount ?? '',
      type: defaultValues?.type ?? 'credit',
      category: defaultValues?.category ?? categories[0] ?? '',
      date: defaultValues?.date ?? '',
    }),
    [categories, defaultValues],
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
          'relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl',
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

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-foreground">
            Valor
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="0,00"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.amount}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, amount: event.target.value }))
              }
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-foreground">
            Tipo de operação
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.type}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  type: event.target.value as TransactionType,
                }))
              }
            >
              <option value="credit">Crédito</option>
              <option value="debit">Débito</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-foreground">
            Categoria
            <select
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.category}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, category: event.target.value }))
              }
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-foreground">
            Data da operação
            <input
              type="date"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              value={formData.date}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, date: event.target.value }))
              }
              required
            />
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

export { TransactionModal };
export type { TransactionFormData, TransactionType };
