import React, { useState } from 'react';
import { LoginCard } from '@/components/auth/LoginCard';
import { LoginBackground } from '@/components/layout/LoginBackground';
import { authOrchestrator } from '@/services/authOrchestrator';
import { useNavigate } from 'react-router-dom';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useToast } from '@/hooks/useToast';
import type { LoginForm, RegisterForm } from '@/types';

export function LoginPage() {
  const [name, setName] = useState(''); // email
  const [email, setEmail] = useState(''); // display name for registration
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { handleError, handleApiError } = useErrorHandler();
  const { showSuccess } = useToast();

  const handleSubmit = async (): Promise<void> => {
    setSubmitting(true);
    setFormError(undefined);
    setSuccessMessage(undefined);
    try {
      if (isLogin) {
        const data = await authOrchestrator.login({ email, password } as LoginForm);
        if (data && typeof data.access_token === 'string') {
          showSuccess('Login successful!');
          void navigate('/');
        } else {
          handleError('Login failed');
        }
      } else {
        // Use the separate username (display name) as `name` and use the email from `email` state
        const data = await authOrchestrator.register({
          name: name,
          email: email,
          password: password,
        } as RegisterForm);
        if (data && data.id) {
          showSuccess('Registration successful! Please login.');
          setIsLogin(true);
        } else {
          handleError('Registration failed');
        }
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      <LoginBackground />

      <div className="relative z-10">
        <LoginCard
          name={name}
          email={email}
          password={password}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
          submitting={submitting}
          formError={formError}
          successMessage={successMessage}
          isLogin={isLogin}
          onToggleMode={() =>
            setIsLogin((v) => {
              const next = !v;
              if (next) setEmail('');
              return next;
            })
          }
        />
      </div>
    </div>
  );
}
