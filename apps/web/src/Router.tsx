import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { ThemeShowcase } from '@/pages/ThemeShowcase';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/theme" element={<ThemeShowcase />} />
      </Routes>
    </BrowserRouter>
  );
}
