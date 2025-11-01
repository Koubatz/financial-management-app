import { useEffect, useState } from 'react';

const DEFAULT_API_URL = 'http://localhost:3000';

export default function App() {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_API_URL;
    const requestUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    const fetchMessage = async () => {
      try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const text = await response.text();
        if (!cancelled) {
          setMessage(text);
        }
      } catch (err) {
        if (!cancelled) {
          const { message: reason = 'Unknown error' } = err as Error;
          setError(reason);
        }
      }
    };

    fetchMessage().catch((err) => {
      console.error(err);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p>Erro ao carregar mensagem da API: {error}</p>;
  }

  if (!message) {
    return <p>Carregando dados da API...</p>;
  }

  return <h1>{message}</h1>;
}
