import { ReactNode } from 'react';

// Keep ToastProvider for compatibility; state is managed by Zustand
export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
