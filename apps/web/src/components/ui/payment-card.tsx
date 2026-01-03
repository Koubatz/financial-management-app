import * as React from 'react';
import { Wifi } from 'lucide-react';

import { cn } from '@/lib/utils';

interface PaymentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  bankName: string;
  cardNumber: string;
  holderName: string;
}

function PaymentCard({ bankName, cardNumber, holderName, className, ...props }: PaymentCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-500 p-4 text-white shadow-md',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/90">{bankName}</span>
        <Wifi className="h-5 w-5 text-white/80" />
      </div>
      <div className="mt-6 space-y-4">
        <span className="block text-lg font-semibold tracking-[0.22em]">{cardNumber}</span>
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/70">
          <span>{holderName}</span>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-orange-400" />
            <span className="-ml-1 h-3 w-3 rounded-full bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { PaymentCard };
