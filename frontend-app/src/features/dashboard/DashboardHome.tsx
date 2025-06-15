import React from 'react'
import { format } from 'date-fns'
import { Button } from '@headlessui/react'
import { JobStatusBadge } from './components/JobStatusBadge'

type Job = {
  id: string
  title: string
  propertyId: string
  status: string
  preferredStartDate: string
}

type Property = {
  id: string
  nickname?: string
  address: { line1: string; city: string }
}

const mockProperties: Property[] = [
  {
    id: 'prop-1',
    nickname: 'Downtown Condo',
    address: { line1: '101 King St', city: 'Halifax' },
  },
  {
    id: 'prop-2',
    nickname: 'Rental A',
    address: { line1: '22 Ocean Ave', city: 'Dartmouth' },
  },
]

const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Leaky sink',
    propertyId: 'prop-1',
    status: 'open',
    preferredStartDate: '2025-06-20',
  },
  {
    id: 'job-2',
    title: 'Panel inspection',
    propertyId: 'prop-1',
    status: 'assigned',
    preferredStartDate: '2025-06-22',
  },
  {
    id: 'job-3',
    title: 'Deck repair',
    propertyId: 'prop-2',
    status: 'quoted',
    preferredStartDate: '2025-06-25',
  },
]

const DashboardHome: React.FC = () => {
  const upcomingJobs = mockJobs
    .filter(job => ['open', 'assigned', 'quoted'].includes(job.status))
    .sort((a, b) => new Date(a.preferredStartDate).getTime() - new Date(b.preferredStartDate).getTime())

  const getJobsByProperty = (propertyId: string) =>
    mockJobs.filter(j => j.propertyId === propertyId)

  return (
    <div className="space-y-10">
      {/* Upcoming Jobs */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Upcoming Jobs</h2>
        {upcomingJobs.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming jobs</p>
        ) : (
          <ul className="space-y-3">
            {upcomingJobs.map(job => {
              const prop = mockProperties.find(p => p.id === job.propertyId)
              return (
                <li key={job.id} className="rounded border p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-500">
                        {prop?.nickname || prop?.address.line1}, {format(new Date(job.preferredStartDate), 'PPP')}
                      </p>
                    </div>
                    <JobStatusBadge status={job.status} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Properties Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockProperties.map(property => {
            const jobs = getJobsByProperty(property.id)
            const statusCount = jobs.reduce<Record<string, number>>((acc, j) => {
              acc[j.status] = (acc[j.status] || 0) + 1
              return acc
            }, {})

            return (
              <div key={property.id} className="rounded border p-4 shadow-sm space-y-2">
                <h4 className="font-medium text-lg">
                  {property.nickname || property.address.line1}
                </h4>
                <p className="text-sm text-gray-500">{property.address.city}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(statusCount).map(([status, count]) => (
                    <JobStatusBadge key={status} status={status} count={count} />
                  ))}
                </div>
                <div className="pt-3">
                  <Button size="sm" variant="secondary">View Jobs</Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default DashboardHome
