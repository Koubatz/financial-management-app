import { useSyncExternalStore } from 'react';
import type { User } from '@/types';

export type AuthState = {
  token: string | null;
  profile: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
};

type Listener = () => void;

const state: AuthState = {
  token: null,
  profile: null,
  loading: false,
  initialized: false,
  error: null,
};

const listeners = new Set<Listener>();

const emit = () => {
  for (const listener of listeners) {
    listener();
  }
};

const setState = (partial: Partial<AuthState>) => {
  Object.assign(state, partial);
  emit();
};

const reset = () => {
  state.token = null;
  state.profile = null;
  state.loading = false;
  state.initialized = true;
  state.error = null;
  emit();
};

const getState = () => ({ ...state });

const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const authStore = {
  getState,
  setState,
  reset,
  subscribe,
};

export const useAuthStore = <T,>(selector: (auth: AuthState) => T): T =>
  useSyncExternalStore(authStore.subscribe, () => selector(authStore.getState()));
