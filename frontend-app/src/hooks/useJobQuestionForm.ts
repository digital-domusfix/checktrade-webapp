import { useEffect, useState } from 'react'
import { getSubcategoryQuestions, JobSubcategoryQuestion } from '../services/jobService'

export const useJobQuestionForm = (subcategoryId?: string) => {
  const [questions, setQuestions] = useState<JobSubcategoryQuestion[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!subcategoryId) return
      setLoading(true)
      try {
        const data = await getSubcategoryQuestions(subcategoryId)
        setQuestions(data)
      } catch (e) {
        console.error('Failed to fetch questions', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [subcategoryId])

  return { questions, loading }
}
