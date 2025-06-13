// src/pages/Job/JobSuccessPage.tsx
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'

export default function JobSuccessPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <h2 className="text-2xl font-bold text-primary mb-4">🎉 Job Submitted!</h2>
      <p className="text-gray-600 mb-6">
        We’re now matching your job with available pros near you. You’ll get updates soon.
      </p>
      <Button onClick={() => navigate('/dashboard')} className="w-full mb-2">
        Go to My Account
      </Button>
      <p className="text-sm text-gray-500">
        Or <a href="/home" className="underline text-primary">return to homepage</a>
      </p>
    </div>
  )
}
