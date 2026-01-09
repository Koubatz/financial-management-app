import { createRoot } from 'react-dom/client';
import { ToastRenderer } from './components/toast/ToastRenderer';
import { ToastProvider } from './contexts/ToastContext';
import './index.css';
import { Router } from './Router';

createRoot(document.getElementById('root')!).render(
  <ToastProvider>
    <Router />
    <ToastRenderer />
  </ToastProvider>,
);
