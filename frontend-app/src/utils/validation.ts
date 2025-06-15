// src/utils/validation.ts
export const isValidPostalCode = (postal: string): boolean => {
  return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postal.trim())
}

export const isValidProvince = (province: string): boolean => {
  return ['NS', 'NB', 'PE', 'NL'].includes(province.trim().toUpperCase())
}

export const validateAddress = (address: {
  line1: string
  city: string
  province: string
  postalCode: string
}) => {
  const errors: Record<string, string> = {}

  if (!address.line1) errors.line1 = 'Address line is required.'
  if (!address.city) errors.city = 'City is required.'
  if (!address.province || !isValidProvince(address.province)) {
    errors.province = 'Select a valid province (NS, NB, PE, NL).'
  }
  if (!address.postalCode || !isValidPostalCode(address.postalCode)) {
    errors.postalCode = 'Invalid Canadian postal code.'
  }

  return errors
}

export const validateDescription = ({
  notes,
  answers,
}: {
  notes: string
  answers: Record<string, string>
}) => {
  if (!notes && Object.values(answers).every(ans => !ans.trim())) {
    return 'Please describe the issue or answer at least one question.'
  }
  return ''
}

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

export const isValidPhone = (phone: string): boolean =>
  /^\d{10}$/.test(phone.replace(/\D/g, ''))

export const validateEmailPhone = ({
  email,
  phone,
}: {
  email: string
  phone: string
}) => {
  const errors: Record<string, string> = {}
  if (!email || !isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!phone || !isValidPhone(phone)) {
    errors.phone = 'Enter a valid 10-digit phone number.'
  }
  return errors
}