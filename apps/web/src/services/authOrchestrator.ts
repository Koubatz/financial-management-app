import type { AuthResponse, LoginForm, RegisterForm, User } from '@/types';
import { authStore } from '@/data/authStore';
import { getProfile, login, register } from './auth';

const TOKEN_STORAGE_KEY = 'token';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown error';

const clearSession = (error?: unknown) => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  authStore.setState({
    token: null,
    profile: null,
    loading: false,
    initialized: true,
    error: error ? getErrorMessage(error) : null,
  });
};

const loadProfile = async (token: string): Promise<User> => {
  authStore.setState({ loading: true, error: null });
  try {
    const profile = await getProfile(token);
    authStore.setState({ profile, loading: false, initialized: true });
    return profile;
  } catch (error) {
    clearSession(error);
    throw error;
  }
};

export const authOrchestrator = {
  async bootstrap(): Promise<User | null> {
    const currentState = authStore.getState();
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      authStore.setState({
        token: null,
        profile: null,
        loading: false,
        initialized: true,
        error: null,
      });
      return null;
    }

    if (currentState.profile && currentState.token === storedToken) {
      authStore.setState({ initialized: true });
      return currentState.profile;
    }

    authStore.setState({
      token: storedToken,
      loading: true,
      initialized: true,
      error: null,
    });

    try {
      const profile = await getProfile(storedToken);
      authStore.setState({ profile, loading: false });
      return profile;
    } catch (error) {
      clearSession(error);
      return null;
    }
  },

  async login(form: LoginForm): Promise<AuthResponse> {
    authStore.setState({ loading: true, error: null, initialized: true });
    try {
      const response = await login(form);
      localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      authStore.setState({ token: response.access_token });
      await loadProfile(response.access_token);
      return response;
    } catch (error) {
      const current = authStore.getState();
      if (current.loading) {
        authStore.setState({ loading: false });
      }
      if (!current.error) {
        authStore.setState({ error: getErrorMessage(error) });
      }
      throw error;
    }
  },

  async register(form: RegisterForm): Promise<User> {
    authStore.setState({ loading: true, error: null, initialized: true });
    try {
      const user = await register(form);
      authStore.setState({ loading: false });
      return user;
    } catch (error) {
      authStore.setState({ loading: false, error: getErrorMessage(error) });
      throw error;
    }
  },

  async refreshProfile(): Promise<User | null> {
    const token = authStore.getState().token ?? localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      authStore.setState({ profile: null, loading: false, initialized: true });
      return null;
    }
    return loadProfile(token);
  },

  logout(): void {
    clearSession();
  },
};
