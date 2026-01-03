import { LoginForm, RegisterForm, AuthResponse, User } from '../types';

const API_URL = 'http://localhost:3000';

export const login = async (loginForm: LoginForm): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginForm),
  });
  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }
  const data = (await response.json()) as AuthResponse;
  return data;
};

export const register = async (registerForm: RegisterForm): Promise<User> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerForm),
  });
  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }
  const data = (await response.json()) as User;
  return data;
};

export const getProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }
  const data = (await response.json()) as User;
  return data;
};
