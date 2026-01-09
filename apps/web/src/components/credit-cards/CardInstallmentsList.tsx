import type { CardInstallment } from '@/services/creditCards';
import { CheckCircle, Clock } from 'lucide-react';

interface CardInstallmentsListProps {
  installments: CardInstallment[];
  loading?: boolean;
}

export function CardInstallmentsList({ installments, loading }: CardInstallmentsListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-12 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (installments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma parcela encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {installments.map((installment) => {
        const dueDate = new Date(installment.dueDate);
        const today = new Date();
        const isOverdue = dueDate < today && !installment.isPaid;
        const isUpcoming = dueDate >= today && !installment.isPaid;

        return (
          <div
            key={installment.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              installment.isPaid
                ? 'bg-green-50 border-green-200'
                : isOverdue
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900">{installment.description}</p>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {installment.installmentNumber}/{installment.totalInstallments}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Vencimento: {dueDate.toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">R$ {installment.amount.toFixed(2)}</p>
                {installment.isPaid && installment.paidDate && (
                  <p className="text-xs text-green-600">
                    Pago em {new Date(installment.paidDate).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>

              {installment.isPaid ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : isOverdue ? (
                <Clock size={20} className="text-red-600" />
              ) : isUpcoming ? (
                <Clock size={20} className="text-yellow-600" />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
