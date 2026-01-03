import { cn } from '@/lib/utils';

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

export function LoadingSpinner({
  size = 24,
  className,
  label = 'Carregando...',
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      <div
        className="animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
