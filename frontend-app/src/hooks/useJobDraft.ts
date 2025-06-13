// src/hooks/useJobDraft.ts
import { useEffect, useState, useCallback } from 'react'
import http from '../api/httpClient'
import { JobAttachmentDto } from '../services/jobService'

export function useJobDraft() {
  const [draftToken, setDraftToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const createDraft = useCallback(async () => {
  const response = await http.post('/api/lead-gen/job-drafts')
  const { draftId, userId } = response.data

        setDraftToken(draftId)
        setUserId(userId)

        return { token: draftId, userId }
        }, [])


  const updateDraft = useCallback(async (payload: any) => {
    if (!draftToken) return
    await http.patch(`/api/lead-gen/job-drafts/${draftToken}`, payload)
  }, [draftToken])

  const uploadAttachments = useCallback(async (files: File[]) => {
    if (!draftToken || !userId) return []
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    formData.append('userId', userId) // 👈 send this explicitly if your API expects it
    const response = await http.post(`/api/lead-gen/job-drafts/${draftToken}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data as JobAttachmentDto[]
  }, [draftToken, userId])

  return {
    draftToken,
    userId,
    initializing: draftToken === null,
    createDraft,
    updateDraft,
    uploadAttachments,
  }
}
