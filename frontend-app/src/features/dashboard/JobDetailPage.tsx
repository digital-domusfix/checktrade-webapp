// features/dashboard/JobDetailPage.tsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import { JobStatusBadge } from './components/JobStatusBadge'

const mockJob = {
  id: 'job-1',
  title: 'Fix leaking pipe under kitchen sink',
  description: 'Major leak near dishwasher. Needs quick fix.',
  status: 'open',
  propertyNickname: 'Beach House',
  address: {
    line1: '123 Shore Rd',
    city: 'Halifax',
    province: 'NS',
    postalCode: 'B3K 5X5',
  },
  preferredDate: '2025-06-18',
  createdAt: '2025-06-10',
  answers: [
    { question: 'Is the issue urgent?', answer: 'Yes' },
    { question: 'Describe the plumbing issue', answer: 'Pipe is dripping constantly.' },
  ],
  attachments: [
    { url: '/mock/photo1.jpg', fileName: 'leak.jpg' },
    { url: '/mock/photo2.jpg', fileName: 'under_sink.jpg' },
  ],
}

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams()

  const job = mockJob // Replace with API call later

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{job.title}</h2>
        <JobStatusBadge status={job.status} />
      </div>

      <div className="text-sm text-gray-600">
        <p>Created: {new Date(job.createdAt).toLocaleDateString()}</p>
        {job.preferredDate && <p>Preferred Start: {job.preferredDate}</p>}
        <p>
          Property: {job.propertyNickname} — {job.address.line1}, {job.address.city},{' '}
          {job.address.province} {job.address.postalCode}
        </p>
      </div>

      <div>
        <h4 className="font-medium mb-1">Job Description</h4>
        <p className="text-gray-800">{job.description}</p>
      </div>

      {job.answers?.length > 0 && (
        <div>
          <h4 className="font-medium mb-1">Job Questions</h4>
          <ul className="list-disc pl-4 text-sm text-gray-700">
            {job.answers.map((a, idx) => (
              <li key={idx}>
                <strong>{a.question}:</strong> {a.answer}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.attachments?.length > 0 && (
        <div>
          <h4 className="font-medium mb-1">Attachments</h4>
          <div className="grid grid-cols-2 gap-4">
            {job.attachments.map((file, idx) => (
              <a
                key={idx}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded border"
              >
                <img src={file.url} alt={file.fileName} className="w-full h-auto" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <Link to="/dashboard/jobs">
          <Button variant="outline">← Back to All Jobs</Button>
        </Link>
      </div>
    </div>
  )
}

export default JobDetailPage
