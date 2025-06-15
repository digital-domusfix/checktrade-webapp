// features/dashboard/AddPropertyPage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { validateAddress } from '../../utils/validation'

const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const validationErrors = validateAddress(address)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Submit mock
    console.log('Property added:', { nickname, address })
    navigate('/dashboard/properties') // or property/:id after real save
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Add New Property</h2>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Nickname (optional)</label>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          className="w-full rounded border p-2"
        />

        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          value={address.line1}
          onChange={e => {
            setAddress({ ...address, line1: e.target.value })
            setErrors(prev => ({ ...prev, line1: '' }))
          }}
          placeholder="Street address"
          className="w-full rounded border p-2"
        />
        {errors.line1 && <p className="text-red-500 text-sm">{errors.line1}</p>}

        <input
          type="text"
          value={address.city}
          onChange={e => {
            setAddress({ ...address, city: e.target.value })
            setErrors(prev => ({ ...prev, city: '' }))
          }}
          placeholder="City"
          className="w-full rounded border p-2"
        />
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

        <select
          value={address.province}
          onChange={e => {
            setAddress({ ...address, province: e.target.value })
            setErrors(prev => ({ ...prev, province: '' }))
          }}
          className="w-full rounded border p-2"
        >
          <option value="">Select Province</option>
          <option value="NS">Nova Scotia</option>
          <option value="NB">New Brunswick</option>
          <option value="PE">Prince Edward Island</option>
          <option value="NL">Newfoundland & Labrador</option>
        </select>
        {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}

        <input
          type="text"
          value={address.postalCode}
          onChange={e => {
            setAddress({ ...address, postalCode: e.target.value })
            setErrors(prev => ({ ...prev, postalCode: '' }))
          }}
          placeholder="Postal Code"
          className="w-full rounded border p-2"
        />
        {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Save Property</Button>
      </div>
    </div>
  )
}

export default AddPropertyPage
