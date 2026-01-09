import type { CreditCard } from '@/services/creditCards';
import { CreditCard as CreditCardIcon } from 'lucide-react';

interface CreditCardComponentProps {
  card: CreditCard;
  onSelect?: (card: CreditCard) => void;
}

export function CreditCardComponent({ card, onSelect }: CreditCardComponentProps) {
  const availableLimit = card.creditLimit - card.usedLimit;
  const usedPercentage = (card.usedLimit / card.creditLimit) * 100;

  const lastFourDigits = card.cardNumber.slice(-4);
  const [month, year] = card.expiryDate.split('/');

  return (
    <div
      onClick={() => onSelect?.(card)}
      className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <CreditCardIcon size={24} />
          <span className="font-semibold text-sm">{card.bank}</span>
        </div>
        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
          {card.cardNetwork}
        </span>
      </div>

      {/* Card Number */}
      <div className="mb-8">
        <p className="text-xs text-blue-100 mb-2">Número do Cartão</p>
        <p className="text-2xl font-mono tracking-widest">•••• •••• •••• {lastFourDigits}</p>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-blue-100">Titulário</p>
          <p className="font-semibold text-sm">{card.holderName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-100">Válido até</p>
          <p className="font-mono">
            {month}/{year}
          </p>
        </div>
      </div>

      {/* Limite */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-blue-100">Limite disponível</span>
          <span className="font-semibold">R$ {availableLimit.toFixed(2)}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white/80 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-blue-100">Limite utilizado</span>
          <span className="text-xs font-medium">{usedPercentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
