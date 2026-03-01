import apiClient from '../client'
import type { ApiResponse } from '../types'

export type ContactSubmissionStatus = 'NEW' | 'WAITING_FOR_CONFIRMATION' | 'DONE'

export interface ContactSubmissionUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  freeSiteVisit: boolean
  userId: string | null
  status: ContactSubmissionStatus
  visitAddress: string | null
  proposedQuoteAmount: number | null
  proposedQuoteDescription: string | null
  visitScheduledAt: string | null
  quoteSentAt: string | null
  adminNotes: string | null
  createdAt: string
  user?: ContactSubmissionUser | null
}

export interface ContactSubmissionListResponse {
  data: ContactSubmission[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

/** Backend returns { success, data: ContactSubmission[], pagination } */
export interface ContactSubmissionsApiResponse {
  success: boolean
  data?: ContactSubmission[]
  pagination?: { page: number; limit: number; total: number; pages: number }
  error?: string
}

export interface ContactSubmissionUpdatePayload {
  status?: ContactSubmissionStatus
  visitAddress?: string | null
  proposedQuoteAmount?: number | null
  proposedQuoteDescription?: string | null
  visitScheduledAt?: string | null
  quoteSentAt?: string | null
  adminNotes?: string | null
}

export const adminContactApi = {
  getContactSubmissions: async (params?: {
    page?: number
    limit?: number
    status?: ContactSubmissionStatus
    hasUser?: boolean
  }): Promise<ContactSubmissionsApiResponse> => {
    const response = await apiClient.get('/admin/contact-submissions', { params })
    return response.data
  },

  updateContactSubmission: async (
    id: string,
    body: ContactSubmissionUpdatePayload
  ): Promise<ApiResponse<ContactSubmission>> => {
    const response = await apiClient.patch(`/admin/contact-submissions/${id}`, body)
    return response.data
  }
}
