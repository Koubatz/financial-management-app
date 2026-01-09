import { ToastContainer } from '@/components/ui/error-toast';
import { ErrorToast } from '@/components/ui/error-toast';
import { useToast } from '@/hooks/useToast';

export function ToastRenderer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <ToastContainer position="top-center">
      {toasts.map((toast) => (
        <ErrorToast
          key={toast.id}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
          type={toast.type}
        />
      ))}
    </ToastContainer>
  );
}
