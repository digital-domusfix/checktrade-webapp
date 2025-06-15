// src/components/jobs/JobQuestionRenderer.tsx
import React from 'react'

type Question = {
  id: { value: string }
  questionText: string
  type: { value: string }
  options?: string[] | null
  isRequired?: boolean
}

type Props = {
  question: Question
  value: string
  onChange: (newVal: string) => void
}

const JobQuestionRenderer: React.FC<Props> = ({ question, value, onChange }) => {
  const qid = question.id.value
  const qtype = question.type.value

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{question.questionText}</label>

      {qtype === 'text' && (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded border p-2"
        />
      )}

      {qtype === 'yes_no' && (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      )}

      {qtype === 'select' && question.options && (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="">Select</option>
          {question.options.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {qtype === 'multi_select' && question.options && (
        <div className="space-y-1">
          {question.options.map(opt => {
            const selected = (value?.split(',') ?? []).includes(opt)
            return (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={e => {
                    const current = value?.split(',') ?? []
                    const updated = e.target.checked
                      ? [...current, opt]
                      : current.filter(x => x !== opt)
                    onChange(updated.join(','))
                  }}
                />
                {opt}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default JobQuestionRenderer
