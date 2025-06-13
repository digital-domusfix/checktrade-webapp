import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../Button'
import { Spinner } from '../Spinner'

const PhoneLoginForm: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'enterPhone' | 'enterOtp'>('enterPhone')
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const verify = useAuthStore((s) => s.verify)
  const resend = useAuthStore((s) => s.resend)
  const registerCustomer = useAuthStore((s) => s.registerCustomer)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    setLoading(true)
    setError('')
    try {
      // Register anonymously (if not already registered)
      const userId = await registerCustomer({
        email: `${phone}@placeholder.com`,
        password: 'Temp@1234',
        firstName: 'Temp',
        lastName: 'User',
        mobile: phone,
        referralSource: 'phone-login',
        preferredLanguage: 'en',
        acceptedTerms: true,
        marketingOptIn: false,
      })
      setUserId(userId)
      setStep('enterOtp')
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!userId || !otp) return
    setLoading(true)
    setError('')
    try {
      await verify({ userId, mobileOtp: otp, emailOtp: '' })
      navigate('/dashboard') // 🎯 Authenticated route
    } catch (err: any) {
      setError('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Log in with your phone</h2>

      {step === 'enterPhone' && (
        <>
          <label htmlFor="phone" className="text-sm font-medium">
            Mobile number
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full rounded border p-2"
            placeholder="e.g. +1 902-555-1234"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button onClick={handleSendOtp} disabled={loading || !phone}>
            {loading ? <Spinner /> : 'Send OTP'}
          </Button>
        </>
      )}

      {step === 'enterOtp' && (
        <>
          <label htmlFor="otp" className="text-sm font-medium">
            Enter the 6-digit code sent to {phone}
          </label>
          <input
            type="text"
            id="otp"
            className="w-full rounded border p-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
          />
          <div className="flex justify-between items-center">
            <Button onClick={handleVerifyOtp} disabled={loading || !otp}>
              {loading ? <Spinner /> : 'Verify & Log In'}
            </Button>
            <button
              type="button"
              className="text-sm text-primary underline"
              onClick={() => userId && resend({ userId })}
            >
              Resend code
            </button>
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default PhoneLoginForm
