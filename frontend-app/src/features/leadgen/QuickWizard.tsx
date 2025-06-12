// src/features/leadgen/QuickWizard.tsx
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useJobCategories } from '../../hooks/useJobCategories'
import { useJobSubcategories } from '../../hooks/useJobSubcategories'
import { CategoryPicker } from '../../components/CategoryPicker'
import { CategoryIcons, DefaultCategoryIcon } from '../../icons/CategoryIcons'
import { logEvent } from '../../utils/analytics'
import { Button } from '../../components/Button'
import type { JobCategory, JobSubcategory } from '../../services/jobService'
import { LeadGenService } from '../../services/leadGenService'
import PhoneVerificationStep from './PhoneVerificationStep'

interface QuickWizardProps {
  onStart?: () => void
  onComplete?: (token: string) => void
}

const questions: Record<string, string[]> = {
  'Leaky faucet': [
    'Is the faucet dripping or spraying?',
    'Single handle or two knobs?',
  ],
  'Toilet issue': [
    'Does it flush?',
    'Is it leaking around the base?',
  ],
  Lighting: [
    'What kind of lights?',
    'Ceiling or wall-mounted?',
  ],
  'AC not working': [
    'Is the fan running?',
    'When did the issue start?',
  ],
  'Kitchen remodel': [
    'Full remodel or cosmetic?',
    'Include plumbing/electrical changes?',
  ],
}

const QuickWizard: React.FC<QuickWizardProps> = ({ onStart, onComplete }) => {
  const navigate = useNavigate()

  // === data hooks ===
  const {
    categories,
    loading: loadingCats,
    error: errorCats,
  } = useJobCategories()
  const [category, setCategory] = useState<JobCategory | null>(null)

  const {
    subcategories,
    loading: loadingSubs,
    error: errorSubs,
  } = useJobSubcategories(category?.id.value ?? '')

  // === wizard state ===
  const [step, setStep] = useState(0)
  const [subcategory, setSubcategory] = useState<JobSubcategory | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')
  const [postcode, setPostcode] = useState('')
  const [date, setDate] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // fire onStart at step 0
  useEffect(() => {
    if (step === 0) onStart?.()
  }, [step, onStart])

  const next = () => {
    logEvent('wizard_step', { step: step + 1 })
    setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    logEvent('wizard_complete')
    try {
      const { data } = await LeadGenService.createJobDraft({
        category: category?.id.value ?? '',
        subcategory: subcategory?.id ?? '',
        answers,
        notes,
        postcode,
        date,
        email,
        phone,
      })
      localStorage.setItem('draftToken', data.token)
      onComplete?.(data.token)
      navigate('/job/new')
    } catch (err) {
      console.error('Submission failed', err)
    }
  }

  if (loadingCats) return <div>Loading services…</div>
  if (errorCats)  return <div className="text-red-500">Failed to load services</div>

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded bg-white p-6 shadow-md sm:p-8">
      {/* STEP 0: Category */}
      {step === 0 && (
        <motion.section layout>
          <h3 className="mb-3 text-lg font-semibold">
            What kind of help do you need?
          </h3>
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

      {/* STEP 1: Subcategory */}
      {step === 1 && category && (
        <motion.section layout>
          <h3 className="mb-3 text-lg font-semibold">
            What best describes your job?
          </h3>
          {loadingSubs && <div>Loading options…</div>}
          {errorSubs && (
            <div className="text-red-500">Failed to load options</div>
          )}
          {!loadingSubs && (
            <div className="grid grid-cols-2 gap-4">
              {subcategories.map(sub => {
                const Icon =
                  CategoryIcons[sub.code] ?? DefaultCategoryIcon
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
        </motion.section>
      )}

      {/* STEP 2: Dynamic Questions */}
      {step === 2 && subcategory && (
        <motion.section layout className="space-y-4">
          <h3 className="mb-3 text-lg font-semibold">Just a few details</h3>
          {(questions[subcategory.name] || []).map((q, i) => (
            <div key={i} className="space-y-1">
              <label htmlFor={`q${i}`} className="text-sm font-medium">
                {q}
              </label>
              <input
                id={`q${i}`}
                type="text"
                value={answers[q] || ''}
                onChange={e =>
                  setAnswers(a => ({ ...a, [q]: e.target.value }))
                }
                className="w-full rounded border p-2"
              />
            </div>
          ))}
          <div>
            <label htmlFor="notes" className="text-sm font-medium">
              Anything else we should know?
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Optional — describe your situation"
              className="w-full rounded border p-2"
            />
          </div>
          <Button onClick={next}>Continue</Button>
        </motion.section>
      )}

      {/* STEP 3: Postcode */}
      {step === 3 && (
        <motion.section layout className="space-y-4">
          <label htmlFor="postcode" className="block text-sm font-medium">
            Your location (Postcode)
          </label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={e => setPostcode(e.target.value)}
            placeholder="e.g. B3J 2K9"
            className="w-full rounded border p-2"
          />
          <Button onClick={next} disabled={!postcode}>
            Continue
          </Button>
        </motion.section>
      )}

      {/* STEP 4: Preferred Date */}
      {step === 4 && (
        <motion.section layout className="space-y-4">
          <label htmlFor="needDate" className="block text-sm font-medium">
            When do you need the service?
          </label>
          <input
            id="needDate"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full rounded border p-2"
          />
          <div>
            <button
              onClick={() => {
                setDate('ASAP')
                next()
              }}
              className="text-sm text-primary underline"
            >
              ASAP
            </button>
          </div>
          {date && <Button onClick={next}>Next</Button>}
        </motion.section>
      )}

      {/* STEP 5: Contact Info */}
      {step === 5 && (
        <motion.section layout className="space-y-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded border p-2"
          />
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full rounded border p-2"
          />
          <Button onClick={next} disabled={!email}>
            Next
          </Button>
        </motion.section>
      )}
      {step === 6 && (
        <motion.section layout className="space-y-4">
          <PhoneVerificationStep
            phone={phone}
            onVerified={() => {
              handleSubmit() // ⬅️ Create draft + redirect
            }}
          />
        </motion.section>
      )}


      {/* STEP 6: Final—Register */}
      {step === 7 && (
        <motion.section layout className="space-y-4 text-center">
          <h4 className="text-lg font-semibold">
            One last step!
          </h4>
          <p className="text-sm text-gray-600">
            We’ve saved your job. Create a free account to message contractors
            and track your quotes.
          </p>
          <Button onClick={handleSubmit}>
            Register & View Quotes
          </Button>
          <p className="text-xs text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-primary underline">
              Sign in
            </a>
          </p>
        </motion.section>
      )}
    </div>
  )
}

export default QuickWizard
