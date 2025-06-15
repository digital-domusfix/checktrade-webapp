import React from 'react'
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'

const HeaderBar: React.FC = () => {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Welcome back</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 hover:text-primary">
          <BellIcon className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 inline-block h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button className="text-gray-600 hover:text-primary">
          <UserCircleIcon className="h-8 w-8" />
        </button>
      </div>
    </div>
  )
}

export default HeaderBar
