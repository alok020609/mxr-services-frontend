import apiClient from '../client'
import type { ApiResponse } from '../types'
import type {
  PaymentLink,
  SavedPaymentMethod,
  PaymentRoute,
  PaymentRetry,
  SplitPayment,
  ReconciliationReport,
  Chargeback
} from '../types'

export const paymentsAdvancedApi = {
  // Create payment link
  createPaymentLink: async (data: {
    orderId?: string
    amount: number
    description?: string
    expiresAt?: string
  }): Promise<ApiResponse<PaymentLink>> => {
    const response = await apiClient.post('/payments/advanced/links', data)
    return response.data
  },

  // Save payment method
  savePaymentMethod: async (data: {
    type: string
    token: string
    metadata?: any
  }): Promise<ApiResponse<SavedPaymentMethod>> => {
    const response = await apiClient.post('/payments/advanced/methods', data)
    return response.data
  },

  // Get saved payment methods
  getSavedPaymentMethods: async (): Promise<ApiResponse<SavedPaymentMethod[]>> => {
    const response = await apiClient.get('/payments/advanced/methods')
    return response.data
  },

  // Route payment
  routePayment: async (data: {
    paymentId: string
    processor: string
    rules?: any
  }): Promise<ApiResponse<PaymentRoute>> => {
    const response = await apiClient.post('/payments/advanced/route', data)
    return response.data
  },

  // Retry payment
  retryPayment: async (paymentId: string, data?: { method?: string }): Promise<ApiResponse<PaymentRetry>> => {
    const response = await apiClient.post(`/payments/advanced/${paymentId}/retry`, data || {})
    return response.data
  },

  // Split payment
  splitPayment: async (data: {
    paymentId: string
    splits: Array<{ recipient: string; amount: number; percentage?: number }>
  }): Promise<ApiResponse<SplitPayment>> => {
    const response = await apiClient.post('/payments/advanced/split', data)
    return response.data
  },

  // Reconcile payments
  reconcilePayments: async (filters?: {
    startDate?: string
    endDate?: string
    status?: string
  }): Promise<ApiResponse<ReconciliationReport>> => {
    const response = await apiClient.get('/payments/advanced/reconcile', { params: filters })
    return response.data
  },

  // Record chargeback
  recordChargeback: async (paymentId: string, data: {
    reason: string
    amount?: number
    notes?: string
  }): Promise<ApiResponse<Chargeback>> => {
    const response = await apiClient.post(`/payments/advanced/${paymentId}/chargeback`, data)
    return response.data
  }
}

