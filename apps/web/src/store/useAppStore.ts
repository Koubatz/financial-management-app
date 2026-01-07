import { create } from 'zustand';

export type ToastType = 'error' | 'success' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface CriticalError {
  title: string;
  description: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryDisabled?: boolean;
}

interface AppState {
  toasts: Toast[];
  criticalError?: CriticalError;
  addToast: (message: string, type?: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  showCriticalError: (error: CriticalError) => void;
  clearCriticalError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  toasts: [],
  criticalError: undefined,
  addToast: (message, type = 'error', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, duration };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
  showCriticalError: (error) => set({ criticalError: error }),
  clearCriticalError: () => set({ criticalError: undefined }),
}));
