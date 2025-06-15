import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'My Properties', to: '/dashboard/properties', icon: BuildingOfficeIcon },
  { name: 'All Jobs', to: '/dashboard/jobs', icon: ClipboardDocumentListIcon },
  { name: 'Profile', to: '/dashboard/profile', icon: UserCircleIcon },
]

const SidebarNav: React.FC = () => {
  return (
    <div className="flex w-64 flex-col bg-white border-r shadow-sm">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-lg font-bold text-primary">CheckTrade</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {name}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t">
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default SidebarNav
