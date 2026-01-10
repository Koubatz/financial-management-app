import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/data/authStore';
import { Bell, Menu } from 'lucide-react';

const getInitials = (name?: string | null) => {
  if (!name) {
    return 'UD';
  }
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('');
  return initials || 'UD';
};

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const displayName = profile?.name ?? 'Usuário Demo';
  const displayEmail = profile?.email ?? 'admin@finmanager.com';
  const initials = getInitials(profile?.name);

  return (
    <header className="bg-white flex items-center justify-between p-6 sticky top-0 z-10 rounded-t-xl">
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-md"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {/* Lado Esquerdo: Barra de Busca */}
      <span className="text-2xl font-bold hidden lg:block">
        {loading ? 'Carregando...' : `Bem-vindo, ${displayName}`}
      </span>
      <span className="text-lg font-bold lg:hidden">
        {loading ? 'Carregando...' : displayName.split(' ')[0]}
      </span>

      {/* <span className="text-2xl font-bold">{`Bem-vindo, ${displayName}`}</span> */}

      {/* Lado Direito: Notificações e Perfil */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* <hr className="h-8 w-px bg-gray-200" /> */}

        <Button className="relative" variant="outline" size="icon">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>

        {/* <hr className="h-8 w-px bg-gray-200" /> */}

        <div className="flex items-center gap-3 pl-2 cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-700">{displayName}</p>
            <p className="text-xs text-gray-500">{displayEmail}</p>
          </div>
          <div className="h-9 w-9 rounded-md bg-blue-600 flex items-center justify-center text-white font-medium shadow-sm ring-2 ring-blue-100">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
