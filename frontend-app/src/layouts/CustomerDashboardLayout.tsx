import React from 'react'
import { Outlet } from 'react-router-dom'
import SidebarNav from './SidebarNav'
import HeaderBar from './HeaderBar'

const CustomerDashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <SidebarNav />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar with avatar, logout, notifications */}
        <HeaderBar />

        {/* Scrollable main panel */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CustomerDashboardLayout
