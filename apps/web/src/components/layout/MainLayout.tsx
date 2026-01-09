import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { TransactionModal } from '@/components/ui/transaction-modal';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-200 h-screen overflow-hidden">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className="flex flex-col bg-white rounded-xl m-4 w-screen"
        style={{ height: 'calc(100% - 32px)' }}
      >
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-6 overflow-auto">{children}</main>
      </div>

      <TransactionModal open={isTransactionOpen} onClose={() => setIsTransactionOpen(false)} />
    </div>
  );
}
