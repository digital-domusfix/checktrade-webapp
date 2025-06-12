import React, { useState } from 'react'
import { Button } from '../../components/Button'
import { useAuthStore } from '../../store/useAuthStore'
import { Spinner } from '../../components/Spinner'

interface PhoneVerificationStepProps {
  phone: string
  onVerified: () => void
}

const PhoneVerificationStep: React.FC<PhoneVerificationStepProps> = ({
  phone,
  onVerified,
}) => {
  const [otp, setOtp] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [step, setStep] = useState<'enterPhone' | 'enterOtp'>('enterPhone')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const resendOtp = useAuthStore(s => s.resend)
  const verifyOtp = useAuthStore(s => s.verify)
  const registerCustomer = useAuthStore(s => s.registerCustomer)

  const sendOtp = async () => {
    try {
      setSending(true)
      setError('')

      const tempUserId = await registerCustomer({
        email: `${phone}@placeholder.com`, // spoofed
        password: 'Temp@1234',
        firstName: 'Temp',
        lastName: 'User',
        mobile: phone,
        referralSource: 'quick-wizard',
        preferredLanguage: 'en',
        acceptedTerms: true,
        marketingOptIn: false,
      })

      setUserId(tempUserId)
      setStep('enterOtp')
    } catch (err: any) {
      const apiError = err?.response?.data?.errors
      if (apiError) {
        const messages = Object.entries(apiError)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
          .join('\n')
        setError(messages)
      } else {
        setError(err.message || 'Failed to send OTP')
      }
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async () => {
    if (!userId || !otp) return
    try {
      await verifyOtp({ userId, mobileOtp: otp, emailOtp: '' })
      onVerified()
    } catch (err: any) {
      setError('Invalid OTP. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Verify Your Phone</h3>
      <p className="text-sm text-gray-600">
        We’ve sent a code to your phone number <strong>{phone}</strong>.
      </p>

      {step === 'enterPhone' && (
        <Button onClick={sendOtp} disabled={sending}>
          {sending ? <Spinner /> : 'Send OTP'}
        </Button>
      )}

      {step === 'enterOtp' && (
        <>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full rounded border p-2"
          />
          <div className="flex justify-between items-center">
            <Button onClick={handleVerify}>Verify</Button>
            <button
              type="button"
              className="text-sm text-primary underline"
              onClick={() => userId && resendOtp({ userId })}
            >
              Resend code
            </button>
          </div>
        </>
      )}

      {error && (
        <p className="text-red-500 whitespace-pre-line text-sm">{error}</p>
      )}
    </div>
  )
}

export default PhoneVerificationStep
