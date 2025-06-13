// src/components/PropertyForm.tsx
import React from 'react'

interface PropertyFormProps {
  value: {
    line1: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  onChange: (val: PropertyFormProps['value']) => void
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ value, onChange }) => {
  const updateField = (field: keyof PropertyFormProps['value'], v: string) => {
    onChange({ ...value, [field]: v })
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Address Line 1</label>
      <input
        type="text"
        value={value.line1}
        onChange={e => updateField('line1', e.target.value)}
        className="w-full rounded border p-2"
        placeholder="123 Main St"
      />

      <label className="block text-sm font-medium">City</label>
      <input
        type="text"
        value={value.city}
        onChange={e => updateField('city', e.target.value)}
        className="w-full rounded border p-2"
        placeholder="Halifax"
      />

      <label className="block text-sm font-medium">Province</label>
      <input
        type="text"
        value={value.province}
        onChange={e => updateField('province', e.target.value)}
        className="w-full rounded border p-2"
        placeholder="NS"
      />

      <label className="block text-sm font-medium">Postal Code</label>
      <input
        type="text"
        value={value.postalCode}
        onChange={e => updateField('postalCode', e.target.value)}
        className="w-full rounded border p-2"
        placeholder="B3J 2K9"
      />

      <label className="block text-sm font-medium">Country</label>
      <input
        type="text"
        value={value.country}
        onChange={e => updateField('country', e.target.value)}
        className="w-full rounded border p-2"
        placeholder="Canada"
      />
    </div>
  )
}
