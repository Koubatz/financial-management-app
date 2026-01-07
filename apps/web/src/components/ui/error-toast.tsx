import { X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';

interface ErrorToastProps {
  message: string;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

export function ErrorToast({ message, onClose, duration = 5000, className }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl bg-red-500 px-4 py-3 shadow-lg',
        'animate-in slide-in-from-top-5 fade-in duration-300',
        !isVisible && 'animate-out slide-out-to-top-5 fade-out',
        className,
      )}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
      </div>

      {/* Message */}
      <p className="flex-1 text-sm font-medium text-white">{message}</p>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-md p-1 text-white transition-colors hover:bg-red-600"
        aria-label="Close notification"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

// Toast container component
interface ToastContainerProps {
  children: React.ReactNode;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

export function ToastContainer({ children, position = 'top-center' }: ToastContainerProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position])}>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
