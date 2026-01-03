import React from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  name: string; // email
  email?: string; // display email used on registration
  password: string;
  confirmPassword?: string;
  onNameChange: (v: string) => void;
  onEmailChange?: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => Promise<void>;
  submitting?: boolean;
  formError?: string;
  successMessage?: string;
  isLogin?: boolean;
  onToggleMode?: () => void;
};

export function LoginCard({
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  submitting,
  formError,
  successMessage,
  isLogin = true,
  onToggleMode,
}: Props) {
  const [errors, setErrors] = React.useState<{
    email?: string;
    name?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const next: { email?: string; name?: string; password?: string; confirmPassword?: string } = {};
    // simple email check
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      next.email = 'Informe um email válido';
    }

    if (!isLogin) {
      if (!name || name.trim().length < 2) {
        next.name = 'Informe um nome (mínimo 2 caracteres)';
      }
    }

    if (!password || password.length < 6) {
      next.password = 'A senha deve ter ao menos 6 caracteres';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleClick = () => {
    if (!validate()) return;
    // clear any previous field errors when submitting
    setErrors({});
    // Fire-and-forget the async submit handler
    void onSubmit();
  };

  const onConfirmPasswordChange = (v: string) => {
    if (v !== password) {
      setErrors((s) => ({ ...s, confirmPassword: 'As senhas não coincidem' }));
    } else {
      setErrors((s) => ({ ...s, confirmPassword: undefined }));
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-90 transition-all duration-500 ease-in-out">
      <div className="flex flex-col items-center mb-4">
        <img src="src/assets/controllah.svg" alt="Controllah Logo" className="w-40" />
      </div>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

      {/* Name input: animated show/hide (0.5s) */}
      <div
        className={`mb-4 transition-all duration-500 ease-in-out ${isLogin ? 'max-h-0 opacity-0 pointer-events-none overflow-hidden' : 'max-h-40 opacity-100'}`}
        aria-hidden={isLogin}
      >
        <div className={`transition-opacity duration-500 ${isLogin ? 'opacity-0' : 'opacity-100'}`}>
          <input
            id="name"
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => {
              onNameChange(e.target.value);
              if (errors.name) setErrors((s) => ({ ...s, name: undefined }));
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>
      </div>

      {/* Email input (always shown) */}
      <div className="mb-4">
        <input
          id="email"
          type="email"
          placeholder={'Email'}
          value={email}
          onChange={(e) => {
            onEmailChange?.(e.target.value);
            if (errors.email) setErrors((s) => ({ ...s, email: undefined }));
          }}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p id="email-error" className="text-red-500 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-4">
        <input
          id="password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => {
            onPasswordChange(e.target.value);
            if (errors.password) setErrors((s) => ({ ...s, password: undefined }));
          }}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && (
          <p id="password-error" className="text-red-500 text-sm mt-1">
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm password input: animated show/hide (0.5s) */}
      <div
        className={`mb-4 transition-all duration-500 ease-in-out ${isLogin ? 'max-h-0 opacity-0 pointer-events-none overflow-hidden' : 'max-h-40 opacity-100'}`}
        aria-hidden={isLogin}
      >
        <div className={`transition-opacity duration-500 ${isLogin ? 'opacity-0' : 'opacity-100'}`}>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => {
              onConfirmPasswordChange(e.target.value);
              if (errors.confirmPassword) setErrors((s) => ({ ...s, confirmPassword: undefined }));
            }}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
          />
          {errors.confirmPassword && (
            <p id="password-error" className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-between mb-4 gap-2">
        <label className="inline-flex items-center text-sm text-gray-600">
          <input type="checkbox" className="mr-2" /> Lembre-se de mim
        </label>
        <button
          className="text-sm text-blue-500 cursor-pointer hover:underline"
          type="button"
          onClick={() => {
            setErrors({});
            onToggleMode?.();
          }}
        >
          {isLogin ? 'Crie uma nova conta' : 'Ja tenho uma conta'}
        </button>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleClick} disabled={submitting} data-variant="default">
          {submitting ? 'Carregando...' : isLogin ? 'Acessar' : 'Registrar'}
        </Button>
      </div>
    </div>
  );
}
