import { ArrowRightLeft, CreditCard, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import logo from '@/assets/logo.svg';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  onTransactionsClick?: () => void;
}

export function Sidebar({ onTransactionsClick }: SidebarProps) {
  return (
    <aside className="w-64 bg-black flex flex-col h-full">
      {/* Header / Logo */}
      <div className="flex px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="FinManager" className="h-10 w-10 object-contain" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold font-primary tracking-wider">Gerenciamento </span>
            <span className="text-xs font-bold font-primary tracking-wider">Financeiro</span>
          </div>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex flex-1 flex-col overflow-y-auto py-3 px-6 gap-2">
        <span className="text-xs tracking-wider font-primary">MENU</span>
        <ul className="space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive />
          <SidebarItem icon={ArrowRightLeft} label="Transações" onClick={onTransactionsClick} />
          <SidebarItem icon={CreditCard} label="Cartões" />
        </ul>

        <span className="text-xs tracking-wider font-primary">GERAL</span>
        <ul className="space-y-2">
          <SidebarItem icon={Settings} label="Configurações" />
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="p-6">
        <SidebarItem icon={LogOut} label="Sair" />
      </div>
    </aside>
  );
}
