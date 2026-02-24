import apiClient from '../client'
import { handleApiCall } from '../helpers'
import type { PaymentGateway, PaymentIntentCreateResult, ApiResponse } from '../types'

export const paymentsApi = {
  // Get payment gateways
  getGateways: async (): Promise<ApiResponse<PaymentGateway[]>> => {
    const response = await apiClient.get('/payments/gateways')
    return response.data
  },
  
  // Create payment intent (orderId + gateway required; amount/currency/redirect URLs optional per backend)
  createIntent: async (
    orderId: string,
    gateway: string,
    options?: {
      amount?: number
      currency?: string
      successRedirectUrl?: string
      failureRedirectUrl?: string
    }
  ): Promise<ApiResponse<PaymentIntentCreateResult>> => {
    const body = { orderId, gateway, ...options }
    const response = await apiClient.post('/payments/create-intent', body)
    return response.data
  },
  
  // Confirm payment
  confirmPayment: async (paymentIntentId: string, paymentMethod: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/payments/confirm', { paymentIntentId, paymentMethod })
    return response.data
  },
  
  // Get payment details
  getPayment: async (orderId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/payments/${orderId}`)
    return response.data
  },
  
  // Get payment history
  getPaymentHistory: async (orderId: string): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/payments/${orderId}/history`)
    return response.data
  }
}

