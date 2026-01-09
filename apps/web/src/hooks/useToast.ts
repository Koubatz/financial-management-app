import { useAppStore } from '@/store/useAppStore';

export function useToast() {
  const toasts = useAppStore((state) => state.toasts);
  const addToast = useAppStore((state) => state.addToast);
  const removeToast = useAppStore((state) => state.removeToast);
  const clearToasts = useAppStore((state) => state.clearToasts);

  const showError = (message: string, duration?: number) => addToast(message, 'error', duration);
  const showSuccess = (message: string, duration?: number) =>
    addToast(message, 'success', duration);
  const showWarning = (message: string, duration?: number) =>
    addToast(message, 'warning', duration);
  const showInfo = (message: string, duration?: number) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    clearAll: clearToasts,
  };
}
