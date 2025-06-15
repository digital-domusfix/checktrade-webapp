// components/JobStatusBadge.tsx
import React from 'react'
import clsx from 'clsx'

interface Props {
  status: string
  count?: number
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  quoted: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-600',
  expired: 'bg-orange-100 text-orange-800',
  resubmitted: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-300 text-gray-700',
}

export const JobStatusBadge: React.FC<Props> = ({ status, count }) => {
  const label = status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        statusColors[status] || 'bg-gray-200 text-gray-800'
      )}
    >
      {count && <span className="mr-1 font-semibold">{count}</span>}
      {label}
    </span>
  )
}
export default JobStatusBadge;