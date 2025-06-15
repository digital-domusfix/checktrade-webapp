import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useJobCategories } from '../../hooks/useJobCategories'
import { useJobSubcategories } from '../../hooks/useJobSubcategories'
import { CategoryPicker } from '../../components/CategoryPicker'
import { CategoryIcons, DefaultCategoryIcon } from '../../icons/CategoryIcons'
import { logEvent } from '../../utils/analytics'
import { Button } from '../../components/Button'
import type { JobCategory, JobSubcategory } from '../../services/jobService'
import PhoneVerificationStep from './PhoneVerificationStep'
import { usePostJobFlow } from '../../hooks/usePostJobFlow'
import { AddressForm } from '../../utils/serializers'
import { useJobQuestionForm } from '../../hooks/useJobQuestionForm'
import AdvancedFileUploader from '../../components/jobs/AdvancedFileUploader'
import JobQuestionRenderer from '../../components/jobs/JobQuestionRenderer'
import {
  validateAddress,
  validateDescription,
  isValidEmail,
  isValidPhone,
  validateEmailPhone,
} from '../../utils/validation'

type QuickWizardProps = {
  onStart?: () => void
  onComplete?: () => void
}

const QuickWizard: React.FC<QuickWizardProps> = ({ onStart, onComplete }) =>{
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState<JobCategory | null>(null)
  const [subcategory, setSubcategory] = useState<JobSubcategory | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [propertyAddress, setPropertyAddress] = useState<AddressForm>({
    line1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
  })

  const { postJobFlow } = usePostJobFlow()
  const { categories } = useJobCategories()
  const { subcategories, loading: loadingSubs, error: errorSubs } = useJobSubcategories(category?.id.value ?? '')
  const { questions: subcategoryQuestions } = useJobQuestionForm(subcategory?.id.value)

  const next = () => {
    logEvent('wizard_step', { step: step + 1 })
    setStep(s => s + 1)
  }

  const back = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const result = await postJobFlow({
        address: propertyAddress,
        job: {
          categoryId: category?.id.value || '',
          subcategoryId: subcategory?.id.value || '',
          title: subcategory?.name || 'Untitled Job',
          description: notes || Object.values(answers).join('; '),
          preferredStartDate: date,
          alternateAddress: { ...propertyAddress },
          answers: Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })),
          attachments: [],
        },
      })

      if (result.success) {
         onComplete?.()            
        navigate('/job/success', {
          state: {
            jobId: result.jobId,
            jobSummary: {
              category: category?.name,
              subcategory: subcategory?.name,
              preferredDate: date,
              address: propertyAddress,
              description: notes || Object.values(answers).join('; '),
              fileCount: attachments.length,
            },
          },
        })
      } else {
        alert(`Something went wrong: ${result.error}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded bg-white p-6 shadow-md sm:p-8">
      {step === 0 && (
        <motion.section layout>
          <h3 className="mb-3 text-lg font-semibold">What kind of help do you need?</h3>
          <CategoryPicker
            categories={categories}
            topN={5}
            onSelect={c => {
              setCategory(c)
              next()
            }}
          />
        </motion.section>
      )}

      {step === 1 && category && (
        <motion.section layout>
          <h3 className="mb-3 text-lg font-semibold">What best describes your job?</h3>
          {loadingSubs && <div>Loading options…</div>}
          {errorSubs && <div className="text-red-500">Failed to load options</div>}
          {!loadingSubs && (
            <div className="grid grid-cols-2 gap-4">
              {subcategories.map(sub => {
                const Icon = CategoryIcons[sub.code] ?? DefaultCategoryIcon
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSubcategory(sub)
                      next()
                    }}
                    className="flex flex-col items-center gap-2 rounded border p-3 text-sm hover:bg-primary hover:text-white"
                  >
                    <Icon className="size-6 text-primary" />
                    {sub.name}
                  </button>
                )
              })}
            </div>
          )}
          <div className="mt-4">{step > 0 && <Button onClick={back} variant="outline">Back</Button>}</div>
        </motion.section>
      )}

      {step === 2 && subcategory && (
        <motion.section layout className="space-y-4">
          <h3 className="mb-3 text-lg font-semibold">Just a few details</h3>

          {subcategoryQuestions.map(q => (
            <JobQuestionRenderer
              key={q.id.value}
              question={q}
              value={answers[q.id.value] || ''}
              onChange={val =>
                setAnswers(prev => ({
                  ...prev,
                  [q.id.value]: val,
                }))
              }
            />
          ))}

          <label className="text-sm font-medium">Anything else?</label>
          <textarea
            value={notes}
            onChange={e => {
              setNotes(e.target.value)
              setErrors(prev => ({ ...prev, description: '' }))
            }}
            onBlur={() => {
              const msg = validateDescription({ notes, answers })
              if (msg) setErrors(prev => ({ ...prev, description: msg }))
            }}
            className="w-full rounded border p-2"
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}

          <AdvancedFileUploader
            files={attachments}
            previews={attachmentPreviews}
            maxFiles={5}
            onChange={(files, previews) => {
              setAttachments(files)
              setAttachmentPreviews(previews)
            }}
          />

          <div className="flex justify-between">
            <Button onClick={back} variant="outline">Back</Button>
            <Button
              onClick={() => {
                const msg = validateDescription({ notes, answers })
                if (msg) {
                  setErrors({ description: msg })
                  return
                }
                setErrors({})
                next()
              }}
            >
              Continue
            </Button>
          </div>
        </motion.section>
      )}

      {step === 3 && (
        <motion.section layout className="space-y-4">
          <h3 className="text-lg font-semibold">Where is the job located?</h3>

          <label className="text-sm font-medium">Address</label>
          <input
            type="text"
            value={propertyAddress.line1}
            onChange={e => {
              setPropertyAddress({ ...propertyAddress, line1: e.target.value })
              setErrors(prev => ({ ...prev, line1: '' }))
            }}
            onBlur={() => {
              if (!propertyAddress.line1) {
                setErrors(prev => ({ ...prev, line1: 'Address line is required.' }))
              }
            }}
            className="w-full rounded border p-2"
          />
          {errors.line1 && <p className="text-sm text-red-500">{errors.line1}</p>}

          <label className="text-sm font-medium">City</label>
          <input
            type="text"
            value={propertyAddress.city}
            onChange={e => {
              setPropertyAddress({ ...propertyAddress, city: e.target.value })
              setErrors(prev => ({ ...prev, city: '' }))
            }}
            onBlur={() => {
              if (!propertyAddress.city) {
                setErrors(prev => ({ ...prev, city: 'City is required.' }))
              }
            }}
            className="w-full rounded border p-2"
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}

          <label className="text-sm font-medium">Province</label>
          <select
            value={propertyAddress.province}
            onChange={e => {
              setPropertyAddress({ ...propertyAddress, province: e.target.value })
              setErrors(prev => ({ ...prev, province: '' }))
            }}
            onBlur={() => {
              if (!propertyAddress.province) {
                setErrors(prev => ({ ...prev, province: 'Province is required.' }))
              }
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

          <label className="text-sm font-medium">Postal Code</label>
          <input
            type="text"
            value={propertyAddress.postalCode}
            onChange={e => {
              setPropertyAddress({ ...propertyAddress, postalCode: e.target.value })
              setErrors(prev => ({ ...prev, postalCode: '' }))
            }}
            onBlur={() => {
              const err = validateAddress(propertyAddress)
              if (err.postalCode) {
                setErrors(prev => ({ ...prev, postalCode: err.postalCode }))
              }
            }}
            className="w-full rounded border p-2"
          />
          {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}

          <div className="flex justify-between">
            <Button onClick={back} variant="outline">Back</Button>
            <Button
              onClick={() => {
                const validationErrors = validateAddress(propertyAddress)
                if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors)
                  return
                }
                setErrors({})
                next()
              }}
            >
              Continue
            </Button>
          </div>
        </motion.section>
      )}

      {step === 4 && (
        <motion.section layout className="space-y-4">
          <label className="block text-sm font-medium">When do you need the service?</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full rounded border p-2"
          />
          <div className="flex justify-between">
            <Button onClick={back} variant="outline">Back</Button>
            <Button onClick={next} disabled={!date}>Next</Button>
          </div>
        </motion.section>
      )}

      {step === 5 && (
        <motion.section layout className="space-y-4">
          <label className="block text-sm font-medium">Your Email</label>
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setErrors(prev => ({ ...prev, email: '' }))
            }}
            onBlur={() => {
              if (!isValidEmail(email)) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }))
              }
            }}
            className="w-full rounded border p-2"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={e => {
              setPhone(e.target.value)
              setErrors(prev => ({ ...prev, phone: '' }))
            }}
            onBlur={() => {
              if (!isValidPhone(phone)) {
                setErrors(prev => ({ ...prev, phone: 'Enter a valid 10-digit phone number.' }))
              }
            }}
            className="w-full rounded border p-2"
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}

          <div className="flex justify-between">
            <Button onClick={back} variant="outline">Back</Button>
            <Button
              onClick={() => {
                const validationErrors = validateEmailPhone({ email, phone })
                if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors)
                  return
                }
                setErrors({})
                next()
              }}
              disabled={!email || !phone}
            >
              Next
            </Button>
          </div>
        </motion.section>
      )}

      {step === 6 && (
        <motion.section layout className="space-y-4">
          <PhoneVerificationStep phone={phone} onVerified={handleSubmit} />
          <Button onClick={back} variant="outline" disabled={submitting}>Back</Button>
          {submitting && <p className="text-sm text-gray-500">Submitting your job…</p>}
        </motion.section>
      )}
    </div>
  )
}

export default QuickWizard

