// features/dashboard/AddContactPage.tsx
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { isValidEmail, isValidPhone } from '../../utils/validation'

const AddContactPage: React.FC = () => {
  const { propertyId } = useParams()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSave = () => {
    const newErrors: Record<string, string> = {}
    if (!fullName) newErrors.fullName = 'Full name is required.'
    if (!isValidEmail(email)) newErrors.email = 'Invalid email format.'
    if (!isValidPhone(phone)) newErrors.phone = 'Invalid phone number.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 🧪 Replace with real API call
    console.log('Add contact', { propertyId, fullName, email, phone, isPrimary })
    navigate(`/dashboard/properties/${propertyId}`)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Add Contact</h2>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={e => {
            setFullName(e.target.value)
            setErrors(prev => ({ ...prev, fullName: '' }))
          }}
          className="w-full rounded border p-2"
        />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}

        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            setErrors(prev => ({ ...prev, email: '' }))
          }}
          className="w-full rounded border p-2"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

        <label className="block text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={e => {
            setPhone(e.target.value)
            setErrors(prev => ({ ...prev, phone: '' }))
          }}
          className="w-full rounded border p-2"
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}

        <label className="inline-flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={e => setIsPrimary(e.target.checked)}
            className="form-checkbox"
          />
          Set as Primary Contact
        </label>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSave}>Save Contact</Button>
      </div>
    </div>
  )
}

export default AddContactPage
