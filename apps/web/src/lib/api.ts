import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { useToast } from '@/hooks/useToast';

const API_URL: string =
  typeof import.meta.env.VITE_API_URL === 'string'
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:3000';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // Ensure rejection reason is an Error instance for lint rule compliance
  // and better error handling downstream
  (error) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Extract error message
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      if (typeof data === 'object' && data !== null && 'message' in data) {
        errorMessage = String(data.message);
      } else {
        // Default messages by status code
        const statusMessages: Record<number, string> = {
          400: 'Invalid request',
          401: 'Authentication required. Please login.',
          403: 'Access denied',
          404: 'Resource not found',
          409: 'Conflict with existing data',
          422: 'Validation failed',
          429: 'Too many requests. Please try again later.',
          500: 'Server error. Please try again.',
          502: 'Bad gateway',
          503: 'Service unavailable',
        };

        errorMessage = statusMessages[status] || errorMessage;
      }

      // Auto logout on 401
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'Network error. Please check your connection.';
    }

    // Attach formatted error message
    error.message = errorMessage;

    return Promise.reject(error);
  },
);

// Hook to use API with error handling and stable callback (avoids rerender loops)
export function useApi() {
  const { showError } = useToast();

  const request = useCallback(
    async <T>(config: AxiosRequestConfig): Promise<T> => {
      try {
        const response = await api.request<T>(config);
        return response.data;
      } catch (error) {
        if (error instanceof Error) {
          showError(error.message);
        }
        throw error;
      }
    },
    [showError],
  );

  return { request };
}
