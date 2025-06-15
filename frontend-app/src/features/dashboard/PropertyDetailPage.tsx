// features/dashboard/PropertyDetailPage.tsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '../../components/Button'
import JobCard from './components/JobCard'

const mockProperty = {
  id: 'prop-1',
  nickname: 'Main Residence',
  address: {
    line1: '42 Maple St',
    city: 'Halifax',
    province: 'NS',
    postalCode: 'B3K 1Y5',
  },
  contacts: [
    {
      id: 'c1',
      name: 'Alex Gray',
      phone: '(902) 123-4567',
      email: 'alex@example.com',
      isPrimary: true,
    },
  ],
  jobs: [
    {
      id: 'j1',
      title: 'Fix leaking faucet',
      status: 'open',
      createdAt: '2024-06-01',
      preferredStartDate: '2024-06-10',
    },
    {
      id: 'j2',
      title: 'Install new shower head',
      status: 'completed',
      createdAt: '2024-04-01',
      preferredStartDate: '2024-04-05',
    },
  ],
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{mockProperty.nickname}</h2>
          <p className="text-sm text-gray-600">
            {mockProperty.address.line1}, {mockProperty.address.city},{' '}
            {mockProperty.address.province} {mockProperty.address.postalCode}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={`/dashboard/properties/${mockProperty.id}/edit`}>
            <Button variant="outline" size="sm">Edit Property</Button>
          </Link>
          <Link to={`/dashboard/jobs/new?propertyId=${mockProperty.id}`}>
            <Button size="sm">Post Job</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Contacts</h3>
        {mockProperty.contacts.map(c => (
          <div key={c.id} className="rounded border p-3 bg-gray-50">
            <p><strong>{c.name}</strong> ({c.isPrimary ? 'Primary' : 'Secondary'})</p>
            <p>{c.phone} — {c.email}</p>
          </div>
        ))}
        <Link to={`/dashboard/properties/${mockProperty.id}/add-contact`}>
          <Button variant="outline" size="sm">Add Contact</Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Jobs</h3>
        {mockProperty.jobs.length === 0 && <p>No jobs yet for this property.</p>}
        <div className="space-y-2">
          {mockProperty.jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage
