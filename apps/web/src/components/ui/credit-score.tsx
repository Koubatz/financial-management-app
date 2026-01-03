import * as React from 'react';

import { cn } from '@/lib/utils';

interface CreditScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  rating: string;
  description: string;
  initials?: string;
}

function CreditScore({
  score,
  rating,
  description,
  initials = 'CS',
  className,
  ...props
}: CreditScoreProps) {
  return (
    <div className={cn('flex items-center gap-3 rounded-lg border px-3 py-2', className)} {...props}>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
        {initials}
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">
          Score de crédito: {score} ({rating})
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

export { CreditScore };
