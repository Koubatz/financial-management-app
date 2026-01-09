import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';

interface ErrorToastProps {
  message: string;
  onClose?: () => void;
  duration?: number;
  className?: string;
  type?: 'error' | 'success' | 'warning' | 'info';
}

export function ErrorToast({
  message,
  onClose,
  duration = 5000,
  className,
  type = 'error',
}: ErrorToastProps) {
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

  const stylesByType = {
    error: {
      bg: 'bg-red-500',
      iconText: 'text-red-500',
      hover: 'hover:bg-red-600',
    },
    success: {
      bg: 'bg-green-500',
      iconText: 'text-green-500',
      hover: 'hover:bg-green-600',
    },
    warning: {
      bg: 'bg-yellow-500',
      iconText: 'text-yellow-500',
      hover: 'hover:bg-yellow-600',
    },
    info: {
      bg: 'bg-blue-500',
      iconText: 'text-blue-500',
      hover: 'hover:bg-blue-600',
    },
  } as const;

  let Icon = AlertCircle;
  switch (type) {
    case 'success':
      Icon = CheckCircle;
      break;
    case 'warning':
      Icon = AlertTriangle;
      break;
    case 'info':
      Icon = Info;
      break;
    default:
      Icon = AlertCircle;
  }
  const t = stylesByType[type];

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg',
        t.bg,
        'animate-in slide-in-from-top-5 fade-in duration-300',
        !isVisible && 'animate-out slide-out-to-top-5 fade-out',
        className,
      )}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
          <Icon className={cn('h-5 w-5', t.iconText)} />
        </div>
      </div>

      {/* Message */}
      <p className="flex-1 text-sm font-medium text-white">{message}</p>

      {/* Close button */}
      <button
        onClick={handleClose}
        className={cn('flex-shrink-0 rounded-md p-1 text-white transition-colors', t.hover)}
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
