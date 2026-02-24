import apiClient from '../client'
import type { ApiResponse, PaginatedResponse } from '../types'
import type { PaymentGateway, PaymentGatewayConfig, PaymentGatewayConfigSchema } from '../types'

export const paymentGatewaysApi = {
  // Get config schema for a gateway type (fields, labels, required, etc.)
  getConfigSchema: async (type: string): Promise<ApiResponse<PaymentGatewayConfigSchema>> => {
    const response = await apiClient.get('/admin/payment-gateways/config-schema', { params: { type } })
    return response.data
  },

  // Get all payment gateways
  getPaymentGateways: async (filters?: {
    isActive?: boolean
    type?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<PaymentGateway> | PaymentGateway[]>> => {
    const response = await apiClient.get('/admin/payment-gateways', { params: filters })
    return response.data
  },

  // Get single payment gateway
  getPaymentGateway: async (id: string): Promise<ApiResponse<PaymentGateway>> => {
    const response = await apiClient.get(`/admin/payment-gateways/${id}`)
    return response.data
  },

  // Create payment gateway
  createPaymentGateway: async (data: PaymentGatewayConfig): Promise<ApiResponse<PaymentGateway>> => {
    const response = await apiClient.post('/admin/payment-gateways', data)
    return response.data
  },

  // Update payment gateway
  updatePaymentGateway: async (id: string, data: Partial<PaymentGatewayConfig>): Promise<ApiResponse<PaymentGateway>> => {
    const response = await apiClient.put(`/admin/payment-gateways/${id}`, data)
    return response.data
  },

  // Toggle payment gateway status
  togglePaymentGateway: async (id: string, isActive: boolean): Promise<ApiResponse<PaymentGateway>> => {
    const response = await apiClient.patch(`/admin/payment-gateways/${id}/toggle`, { isActive })
    return response.data
  },

  // Delete payment gateway
  deletePaymentGateway: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/payment-gateways/${id}`)
    return response.data
  }
}

