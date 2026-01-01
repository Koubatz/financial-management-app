import * as React from 'react';

import { cn } from '@/lib/utils';

interface CardActionItem {
  icon: React.ReactNode;
  label: string;
}

interface CardActionListProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  actions: CardActionItem[];
}

function CardActionList({
  title,
  ctaLabel,
  onCtaClick,
  actions,
  className,
  ...props
}: CardActionListProps) {
  return (
    <div className={cn('rounded-lg bg-muted/40 p-3', className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        {ctaLabel ? (
          <button
            type="button"
            onClick={onCtaClick}
            className="text-xs font-semibold text-violet-600 transition hover:text-violet-700"
          >
            {ctaLabel}
          </button>
        ) : null}
      </div>
      <div className="mt-3 space-y-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { CardActionList };
export type { CardActionItem };
