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
import type { JobAttachmentDto, JobCategory, JobSubcategory } from '../../services/jobService'
import PhoneVerificationStep from './PhoneVerificationStep'
import { usePostJobFlow } from '../../hooks/usePostJobFlow'
import { PropertyForm } from '../../components/properties/PropertyForm'
import { AddressForm } from '../../utils/serializers'
import http from '../../api/httpClient'
import { useJobQuestionForm } from '../../hooks/useJobQuestionForm'
import FileUploader from '../../components/jobs/FileUploader'
import { useJobDraft } from '../../hooks/useJobDraft'


const QuickWizard: React.FC = () => {
   const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState<JobCategory | null>(null)
  const [subcategory, setSubcategory] = useState<JobSubcategory | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [propertyAddress, setPropertyAddress] = useState<AddressForm>({
    line1: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
  })
  const [attachments, setAttachments] = useState<JobAttachmentDto[]>([])

  const {
    draftToken,
    initializing: draftLoading,
    createDraft,
    uploadAttachments,
    updateDraft
  } = useJobDraft()

  const { postJobFlow, loading } = usePostJobFlow()
  const { categories, loading: loadingCats, error: errorCats } = useJobCategories()
  const { subcategories, loading: loadingSubs, error: errorSubs } = useJobSubcategories(category?.id.value ?? '')
  const { questions: subcategoryQuestions, loading: loadingQuestions } = useJobQuestionForm(subcategory?.id.value)

  useEffect(() => {
    if (subcategory && !draftToken) {
      createDraft()
    }
  }, [subcategory])

  const next = () => {
    logEvent('wizard_step', { step: step + 1 })
    setStep(s => s + 1)
  }

  const back = () => setStep(s => s - 1)

  const handleSubmit = async () => {
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
        attachments,
      },
    })

    if (result.success) {
      navigate('/job/success')
    } else {
      alert(`Something went wrong: ${result.error}`)
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
            <div key={q.id}>
              <label className="text-sm font-medium">{q.questionText}</label>
              <input
                type="text"
                className="w-full rounded border p-2"
                value={answers[q.id] || ''}
                onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
              />
            </div>
          ))}

          <label className="text-sm font-medium">Anything else?</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full rounded border p-2"
          />

          {draftToken && (
        <FileUploader
          draftToken={draftToken}
          uploadAttachments={uploadAttachments}
          onUploadComplete={async uploaded => {
            const newFiles = [...attachments, ...uploaded]
            setAttachments(newFiles)
          }}
        />
      )}


          <div className="flex justify-between">
            <Button onClick={back} variant="outline">Back</Button>
            <Button onClick={next}>Continue</Button>
          </div>
        </motion.section>
      )}

      {step === 3 && (
        <motion.section layout className="space-y-4">
          <h3 className="text-lg font-semibold">Where is the job located?</h3>
          <PropertyForm value={propertyAddress} onChange={setPropertyAddress} />
          <div className="flex justify-between">
            <Button onClick={back} variant="outline">Back</Button>
            <Button
              onClick={next}
              disabled={!propertyAddress.line1 || !propertyAddress.city || !propertyAddress.postalCode}
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
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded border p-2"
          />
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full rounded border p-2"
          />
          <div className="flex justify-between">
            <Button onClick={back} variant="outline">Back</Button>
            <Button onClick={next} disabled={!email}>Next</Button>
          </div>
        </motion.section>
      )}

      {step === 6 && (
        <motion.section layout className="space-y-4">
          <PhoneVerificationStep phone={phone} onVerified={handleSubmit} />
          <Button onClick={back} variant="outline">Back</Button>
        </motion.section>
      )}
    </div>
  )
}

export default QuickWizard