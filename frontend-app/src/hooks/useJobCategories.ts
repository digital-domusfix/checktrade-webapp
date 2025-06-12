import { useEffect, useState } from 'react'
import jobService, { JobCategory } from '../services/jobService'

export function useJobCategories() {
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    jobService
      .getJobCategories()
      .then((res) => {
        if (!cancelled) setCategories(res.data.categories)
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
  }, [])

  return { categories, loading, error }
}
