import { ArrowRightLeft, CreditCard, LayoutDashboard, LogOut, Wallet, X } from 'lucide-react';
import logo from '@/assets/controllah.svg';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const handleItemClick = (callback?: () => void) => {
    callback?.();
    onMobileClose?.();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-black flex flex-col h-full fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onMobileClose}
          className="lg:hidden absolute top-4 right-4 text-white/70 hover:text-white"
          aria-label="Fechar menu"
        >
          <X size={24} />
        </button>
        {/* Header / Logo */}
        <div className="flex justify-center px-6 py-4">
          <img src={logo} alt="FinManager" className="h-24 w-24 object-contain" />
        </div>

        {/* Navegação Principal */}
        <nav className="flex flex-1 flex-col overflow-y-auto py-3 px-6 gap-2">
          <span className="text-xs tracking-wider font-primary">MENU</span>
          <ul className="space-y-2">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              href="/dashboard"
              onClick={() => handleItemClick()}
            />
            <SidebarItem
              icon={ArrowRightLeft}
              label="Transações"
              href="/transactions"
              onClick={() => handleItemClick()}
            />
            <SidebarItem
              icon={Wallet}
              label="Contas"
              href="/wallets"
              onClick={() => handleItemClick()}
            />
            <SidebarItem
              icon={CreditCard}
              label="Cartões"
              href="/credit-cards"
              onClick={() => handleItemClick()}
            />
          </ul>
        </nav>

        {/* Footer / Logout */}
        <div className="p-6">
          <SidebarItem icon={LogOut} label="Sair" onClick={() => handleItemClick()} />
        </div>
      </aside>
    </>
  );
}
