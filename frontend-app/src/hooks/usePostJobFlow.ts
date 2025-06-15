// src/hooks/usePostJobFlow.ts
import { useCallback, useState } from 'react'
import http from '../api/httpClient'
import { CreateJobRequest } from '../services/jobService'
import { AddressForm, toCreatePropertyRequest } from '../utils/serializers'

interface UsePostJobFlowResult {
  postJobFlow: (input: {
    job: Omit<CreateJobRequest, 'customerProfileId' | 'propertyId'>
    address: AddressForm
  }) => Promise<{ success: true, jobId: string } | { success: false; error: string }>
  loading: boolean
}

export const usePostJobFlow = (): UsePostJobFlowResult => {
  const [loading, setLoading] = useState(false)

  const postJobFlow = useCallback(
    async ({ job, address }) => {
      setLoading(true)
      try {
        // Step 1: Get Customer Profile ID
        const enrichedRes = await http.get('/api/identity/me')
        const customerProfileId = enrichedRes.data?.customerProfileId

        if (!customerProfileId) {
          throw new Error('Customer profile not found')
        }

        // Step 2: Create Property
        const createReq = toCreatePropertyRequest(customerProfileId,address)
        const propertyRes = await http.post('/api/identity/properties', createReq)
        const propertyId = propertyRes.data?.propertyId

        if (!propertyId) {
          throw new Error('Property creation failed')
        }

        // Step 3: Post the Job
        await http.post('/api/lead-gen/jobs', {
          ...job,
          customerProfileId,
          propertyId,
        })

        return { success: true }
      } catch (error: any) {
        console.error('Job flow failed', error)
        return { success: false, error: error.message || 'Unknown error' }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { postJobFlow, loading }
}

