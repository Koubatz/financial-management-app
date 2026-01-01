// import { FormEvent, useEffect, useMemo, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';

// const DEFAULT_API_URL = 'http://localhost:3000';

// type User = {
//   id: string;
//   name: string;
//   email: string;
//   created_at?: string;
//   updated_at?: string;
// };

// function normalizeBaseUrl(url: string): string {
//   return url.endsWith('/') ? url.slice(0, -1) : url;
// }

export default function App() {
  // const [users, setUsers] = useState<User[]>([]);
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [loadError, setLoadError] = useState<string>();
  // const [formError, setFormError] = useState<string>();
  // const [successMessage, setSuccessMessage] = useState<string>();
  // const [loading, setLoading] = useState(true);
  // const [submitting, setSubmitting] = useState(false);

  // const apiBaseUrl = useMemo(() => {
  //   const rawEnv = import.meta.env.VITE_API_URL as string | undefined;
  //   const sanitized = rawEnv && rawEnv.trim().length > 0 ? rawEnv.trim() : DEFAULT_API_URL;
  //   return normalizeBaseUrl(sanitized);
  // }, []);

  // useEffect(() => {
  //   let cancelled = false;

  //   const fetchUsers = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`${apiBaseUrl}/users`);
  //       if (!response.ok) {
  //         throw new Error(`Request failed with status ${response.status}`);
  //       }

  //       const data = (await response.json()) as User[];
  //       if (!cancelled) {
  //         setUsers(data);
  //         setLoadError(undefined);
  //       }
  //     } catch (error) {
  //       if (!cancelled) {
  //         const message = error instanceof Error ? error.message : 'Erro desconhecido';
  //         setLoadError(`Não foi possível carregar os usuários: ${message}`);
  //       }
  //     } finally {
  //       if (!cancelled) {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchUsers().catch((error) => {
  //     console.error('Failed to load users', error);
  //   });

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [apiBaseUrl]);

  // const submitUser = async () => {
  //   const trimmedName = name.trim();
  //   const trimmedEmail = email.trim();

  //   if (!trimmedName || !trimmedEmail) {
  //     setFormError('Informe nome e e-mail.');
  //     return;
  //   }

  //   setSubmitting(true);
  //   setFormError(undefined);
  //   setSuccessMessage(undefined);

  //   try {
  //     const response = await fetch(`${apiBaseUrl}/users`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
  //     });

  //     if (!response.ok) {
  //       const message = (await response.text()) || `Request failed with status ${response.status}`;
  //       throw new Error(message);
  //     }

  //     const user = (await response.json()) as User;
  //     setUsers((current) => [user, ...current]);
  //     setName('');
  //     setEmail('');
  //     setSuccessMessage('Usuário criado com sucesso!');
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : 'Erro desconhecido';
  //     setFormError(`Não foi possível criar o usuário: ${message}`);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   void submitUser();
  // };

  return (
    <MainLayout>
      {/* O conteúdo das suas páginas (Dashboard, etc) será renderizado aqui */}
      <div className="space-y-4">
        <Dashboard />
        {/* Exemplo de conteúdo placeholder */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-32"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-32"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-32"></div>
        </div> */}
      </div>
    </MainLayout>
  );
}
