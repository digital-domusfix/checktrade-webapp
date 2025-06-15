import React from 'react'
import { Link } from 'react-router-dom'
import { JobSummary } from '../../types'
import JobStatusBadge from './JobStatusBadge'

interface JobCardProps {
  job: JobSummary
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Link
      to={`/dashboard/jobs/${job.id}`}
      className="block rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold">{job.title}</h4>
        <JobStatusBadge status={job.status} />
      </div>
      <div className="text-xs text-gray-600">
        {job.description.slice(0, 60)}…
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {job.address.city}, {job.address.province} • {job.createdAt}
      </div>
    </Link>
  )
}
export default JobCard
