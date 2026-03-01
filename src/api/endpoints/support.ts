import apiClient from '../client'
import type { ApiResponse, PaginatedResponse } from '../types'

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  views?: number
  helpful?: number
  createdAt: string
}

export interface SupportTicket {
  id: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  messages: TicketMessage[]
  createdAt: string
  updatedAt?: string
}

export interface TicketMessage {
  id: string
  ticketId: string
  message: string
  sender: string
  senderName?: string
  isInternal: boolean
  attachments?: string[]
  createdAt: string
}

export const supportApi = {
  getFAQs: async (category?: string): Promise<ApiResponse<FAQ[]>> => {
    const response = await apiClient.get('/support/faqs', { params: { category } })
    return response.data
  },
  
  createTicket: async (ticket: Partial<SupportTicket>): Promise<ApiResponse<SupportTicket>> => {
    const response = await apiClient.post('/support/tickets', ticket)
    return response.data
  },
  
  getTickets: async (): Promise<ApiResponse<PaginatedResponse<SupportTicket>>> => {
    const response = await apiClient.get('/support/tickets')
    return response.data
  },
  
  getTicket: async (id: string): Promise<ApiResponse<SupportTicket>> => {
    const response = await apiClient.get(`/support/tickets/${id}`)
    return response.data
  },
  
  addTicketMessage: async (ticketId: string, message: string, attachments?: File[]): Promise<ApiResponse<TicketMessage>> => {
    const formData = new FormData()
    formData.append('message', message)
    if (attachments) {
      attachments.forEach(file => formData.append('attachments', file))
    }
    const response = await apiClient.post(`/support/tickets/${ticketId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  
  closeTicket: async (ticketId: string): Promise<ApiResponse<SupportTicket>> => {
    const response = await apiClient.put(`/support/tickets/${ticketId}/close`)
    return response.data
  },

  submitContact: async (body: {
    name: string
    email: string
    message: string
    phone?: string
    freeSiteVisit?: boolean
  }): Promise<ApiResponse<{ id: string; createdAt: string }>> => {
    const payload: Record<string, unknown> = {
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim()
    }
    if (body.phone != null && body.phone !== '') {
      payload.phone = body.phone.trim()
    }
    if (body.freeSiteVisit === true) {
      payload.freeSiteVisit = true
    }
    const response = await apiClient.post('/support/contact', payload)
    return response.data
  }
}
