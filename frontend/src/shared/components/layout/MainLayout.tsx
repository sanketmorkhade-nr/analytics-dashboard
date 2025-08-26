import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
