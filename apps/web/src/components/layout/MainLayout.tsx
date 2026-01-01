import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { TransactionModal } from '@/components/ui/transaction-modal';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);

  return (
    <div className="flex w-screen h-screen bg-gray-200">
      <div className="hidden md:block h-full">
        <Sidebar onTransactionsClick={() => setIsTransactionOpen(true)} />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-white rounded-xl m-4">
          <Topbar />
          <main className="px-6">{children}</main>
        </div>
      </div>
      <TransactionModal
        open={isTransactionOpen}
        onClose={() => setIsTransactionOpen(false)}
      />
    </div>
  );
}
