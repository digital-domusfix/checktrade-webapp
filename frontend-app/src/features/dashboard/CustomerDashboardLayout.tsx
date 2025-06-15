import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderBar from '../../layouts/HeaderBar';
import SidebarNav from '../../layouts/SidebarNav';

const CustomerDashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800">
      {/* Sidebar navigation (fixed left) */}
      <aside className="w-64 shrink-0 border-r bg-white">
        <SidebarNav />
      </aside>

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="border-b bg-white">
          <HeaderBar />
        </header>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;
