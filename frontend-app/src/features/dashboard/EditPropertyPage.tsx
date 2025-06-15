// features/dashboard/EditPropertyPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { validateAddress } from '../../utils/validation'

// 🧪 Mocked property fetch — to be replaced with real API
const getMockProperty = (id: string) => ({
  nickname: 'Cottage Airbnb',
  address: {
    line1: '22 Lighthouse Road',
    city: 'Lunenburg',
    province: 'NS',
    postalCode: 'B0J2C0',
    country: 'Canada',
  },
})

const EditPropertyPage: React.FC = () => {
  const { propertyId } = useParams()
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

  useEffect(() => {
    if (propertyId) {
      const data = getMockProperty(propertyId)
      setNickname(data.nickname || '')
      setAddress(data.address)
    }
  }, [propertyId])

  const handleSave = () => {
    const validationErrors = validateAddress(address)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Replace this with save API
    console.log('Saving property update:', { propertyId, nickname, address })
    navigate(`/dashboard/properties/${propertyId}`)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Edit Property</h2>

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
          className="w-full rounded border p-2"
        />
        {errors.line1 && <p className="text-sm text-red-500">{errors.line1}</p>}

        <input
          type="text"
          value={address.city}
          onChange={e => {
            setAddress({ ...address, city: e.target.value })
            setErrors(prev => ({ ...prev, city: '' }))
          }}
          className="w-full rounded border p-2"
        />
        {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}

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
        {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}

        <input
          type="text"
          value={address.postalCode}
          onChange={e => {
            setAddress({ ...address, postalCode: e.target.value })
            setErrors(prev => ({ ...prev, postalCode: '' }))
          }}
          className="w-full rounded border p-2"
        />
        {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}

export default EditPropertyPage
