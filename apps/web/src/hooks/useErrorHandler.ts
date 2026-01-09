import { useToast } from '@/hooks/useToast';
import { useAppStore } from '@/store/useAppStore';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  onError?: (error: Error) => void;
}

export function useErrorHandler() {
  const { showError } = useToast();
  const showCriticalError = useAppStore((state) => state.showCriticalError);

  const handleError = (error: unknown, options: ErrorHandlerOptions = {}): void => {
    const { showToast = true, logToConsole = true, onError } = options;

    // Extrair mensagem de erro
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    // Log no console em desenvolvimento
    if (logToConsole && import.meta.env.DEV) {
      console.error('Error caught:', error);
    }

    // Mostrar toast
    if (showToast) {
      showError(errorMessage);
    }

    // Callback customizado
    if (onError && error instanceof Error) {
      onError(error);
    }
  };

  const handleApiError = (error: unknown): void => {
    let message = 'Failed to process request';

    // Verificar se é um erro de API com response
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object'
    ) {
      const response = error.response as {
        data?: { message?: string };
        status?: number;
      };

      if (response.data?.message) {
        message = response.data.message;
      } else if (response.status) {
        // Mensagens padrão por status code
        const statusMessages: Record<number, string> = {
          400: 'Invalid request',
          401: 'Authentication required',
          403: 'Access denied',
          404: 'Resource not found',
          409: 'Conflict with existing data',
          422: 'Validation failed',
          429: 'Too many requests',
          500: 'Server error',
          502: 'Bad gateway',
          503: 'Service unavailable',
        };

        message = statusMessages[response.status] || message;
      }
    }

    handleError(message);
  };

  const handleValidationError = (errors: Record<string, string[]>): void => {
    const firstError = Object.values(errors)[0]?.[0];
    if (firstError) {
      handleError(firstError);
    }
  };

  const handleNetworkError = (): void => {
    handleError('Network error. Please check your connection.');
  };

  const handleCriticalError = (title: string, description: string): void => {
    showCriticalError({
      title,
      description,
      primaryLabel: 'Try Again',
      secondaryLabel: 'Contact Support',
    });
  };

  return {
    handleError,
    handleApiError,
    handleValidationError,
    handleNetworkError,
    handleCriticalError,
  };
}
