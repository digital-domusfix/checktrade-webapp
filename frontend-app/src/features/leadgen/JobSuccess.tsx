// src/features/leadgen/JobSuccess.tsx
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'

const JobSuccess: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const jobId = (location.state as any)?.jobId
  const jobSummary = (location.state as any)?.jobSummary

  return (
    <div className="mx-auto max-w-xl rounded bg-white p-6 shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-green-600 text-center">🎉 Your job was posted!</h2>
      <p className="text-center text-gray-700">We’ve received your request. A tradesperson will be in touch soon.</p>

      {jobId && (
        <div className="rounded bg-gray-50 p-4 text-sm text-gray-600">
          <p><strong>Job ID:</strong> {jobId}</p>
        </div>
      )}

      {jobSummary && (
        <div className="rounded border p-4 bg-white shadow-sm space-y-2">
          <h4 className="text-md font-semibold">Job Summary</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>Category:</strong> {jobSummary.category}</li>
            <li><strong>Subcategory:</strong> {jobSummary.subcategory}</li>
            <li><strong>Preferred Date:</strong> {jobSummary.preferredDate}</li>
            <li><strong>Address:</strong> {jobSummary.address.line1}, {jobSummary.address.city}, {jobSummary.address.province}</li>
            <li><strong>Description:</strong> {jobSummary.description}</li>
            <li><strong>Attachments:</strong> {jobSummary.fileCount} file(s)</li>
          </ul>
        </div>
      )}

      <div className="text-center space-x-3">
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        <Button onClick={() => navigate('/post-job')} variant="outline">Post Another Job</Button>
      </div>
    </div>
  )
}

export default JobSuccess
