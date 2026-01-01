import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { Bell } from 'lucide-react';

export function Topbar() {
  return (
    <header className="h-20 bg-white flex items-center justify-between px-6 sticky top-0 z-10 rounded-t-xl">
      {/* Lado Esquerdo: Barra de Busca */}
      <span className="text-2xl font-bold">Bem-vindo, Usuário Demo</span>

      {/* Lado Direito: Notificações e Perfil */}
      <div className="flex items-center gap-4">
        <SearchInput placeholder="Buscar..." />

        {/* <hr className="h-8 w-px bg-gray-200" /> */}

        <Button className="relative" variant="outline" size="icon">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </Button>

        {/* <hr className="h-8 w-px bg-gray-200" /> */}

        <div className="flex items-center gap-3 pl-2 cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-700">Usuário Demo</p>
            <p className="text-xs text-gray-500">admin@finmanager.com</p>
          </div>
          <div className="h-9 w-9 rounded-md          bg-blue-600 flex items-center justify-center text-white font-medium shadow-sm ring-2 ring-blue-100">
            UD
          </div>
        </div>
      </div>
    </header>
  );
}
