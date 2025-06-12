// src/hooks/useJobSubcategories.ts
import { useEffect, useState } from 'react'
import jobService, { JobSubcategory } from '../services/jobService'

export function useJobSubcategories(categoryId: string | null) {
  const [subcategories, setSubcategories] = useState<JobSubcategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!categoryId) return
    let cancelled = false
    setLoading(true)
    jobService
      .getJobSubcategories(categoryId)
      .then((res) => {
        if (!cancelled) setSubcategories(res.data)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [categoryId])

  return { subcategories, loading, error }
}
