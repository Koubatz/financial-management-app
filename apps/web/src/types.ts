export interface LoginForm {
  email?: string;
  password?: string;
}

export interface RegisterForm {
  name?: string;
  email?: string;
  password?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
}
