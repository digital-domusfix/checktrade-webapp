import React, { useState } from 'react'
import { Button } from '../../components/Button'
import { Link } from 'react-router-dom'
import { JobStatusBadge } from './components/JobStatusBadge'

// Mocked job data structure (replace with real API later)
type JobStatus = 'open' | 'quoted' | 'assigned' | 'completed'
interface JobSummary {
  id: string
  title: string
  propertyNickname?: string
  addressLine: string
  status: JobStatus
  preferredDate?: string
  createdAt: string
}

const mockJobs: JobSummary[] = [
  {
    id: 'job-1',
    title: 'Fix leaking pipe',
    propertyNickname: 'Beach House',
    addressLine: '123 Shore Rd, Halifax',
    status: 'open',
    preferredDate: '2025-06-18',
    createdAt: '2025-06-10',
  },
  {
    id: 'job-2',
    title: 'Replace broken tiles',
    propertyNickname: 'Downtown Condo',
    addressLine: '45 Main St, Halifax',
    status: 'assigned',
    createdAt: '2025-05-30',
  },
]

const JobListPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | JobStatus>('all')

  const filtered = filter === 'all' ? mockJobs : mockJobs.filter(j => j.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Jobs</h2>
        <div className="space-x-2">
          {['all', 'open', 'quoted', 'assigned', 'completed'].map(s => (
            <Button
              key={s}
              variant={filter === s ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(s as JobStatus | 'all')}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(job => (
          <Link
            to={`/dashboard/jobs/${job.id}`}
            key={job.id}
            className="block rounded border p-4 shadow hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{job.title}</h3>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="text-sm text-gray-500">
              {job.propertyNickname ? `${job.propertyNickname} — ` : ''}
              {job.addressLine}
            </p>
            <p className="text-sm text-gray-500">
              Submitted: {new Date(job.createdAt).toLocaleDateString()}
              {job.preferredDate && ` · Preferred: ${job.preferredDate}`}
            </p>
          </Link>
        ))}

        {filtered.length === 0 && <p className="text-sm text-gray-600">No jobs found for this filter.</p>}
      </div>
    </div>
  )
}

export default JobListPage
