import apiClient from '../client'
import type { ApiResponse, PaginatedResponse } from '../types'
import type { EmailService, EmailServiceCreatePayload } from '../types'

export const emailServicesApi = {
  getEmailServices: async (filters?: {
    isActive?: boolean
    type?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<EmailService> | EmailService[]>> => {
    const response = await apiClient.get('/admin/email-services', { params: filters })
    return response.data
  },

  getEmailService: async (id: string): Promise<ApiResponse<EmailService>> => {
    const response = await apiClient.get(`/admin/email-services/${id}`)
    return response.data
  },

  createEmailService: async (data: EmailServiceCreatePayload): Promise<ApiResponse<EmailService>> => {
    const response = await apiClient.post('/admin/email-services', data)
    return response.data
  },

  updateEmailService: async (
    id: string,
    data: Partial<EmailServiceCreatePayload>
  ): Promise<ApiResponse<EmailService>> => {
    const response = await apiClient.put(`/admin/email-services/${id}`, data)
    return response.data
  },

  toggleEmailService: async (id: string, isActive: boolean): Promise<ApiResponse<EmailService>> => {
    const response = await apiClient.patch(`/admin/email-services/${id}/toggle`, { isActive })
    return response.data
  },

  setDefaultEmailService: async (id: string): Promise<ApiResponse<EmailService>> => {
    const response = await apiClient.patch(`/admin/email-services/${id}/set-default`)
    return response.data
  },

  deleteEmailService: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/email-services/${id}`)
    return response.data
  }
}
