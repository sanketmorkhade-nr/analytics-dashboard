import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
