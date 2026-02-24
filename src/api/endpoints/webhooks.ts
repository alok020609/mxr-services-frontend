import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface WebhookEvent {
  id: string
  type: string
  payload: any
  status: 'pending' | 'processed' | 'failed'
  attempts: number
  createdAt: string
  processedAt?: string
}

export const webhooksApi = {
  // Note: Webhook endpoints are typically backend-only
  // These methods are for admin monitoring/logs if needed
  getWebhookEvents: async (filters?: any): Promise<ApiResponse<WebhookEvent[]>> => {
    const response = await apiClient.get('/webhooks/events', { params: filters })
    return response.data
  }
}
