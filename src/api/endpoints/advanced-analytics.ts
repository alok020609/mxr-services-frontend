import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export const advancedAnalyticsApi = {
  trackUTM: async (orderId: string, utmParams: UTMParams): Promise<ApiResponse> => {
    const response = await apiClient.post(`/analytics/advanced/orders/${orderId}/utm`, utmParams)
    return response.data
  },

  getUserChurn: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/analytics/advanced/users/${userId}/churn`)
    return response.data
  },

  getProductAffinity: async (userId: string, productId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/analytics/advanced/users/${userId}/affinity/${productId}`)
    return response.data
  },

  getNextProduct: async (userId: string): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/analytics/advanced/users/${userId}/next-product`)
    return response.data
  },

  getAttribution: async (userId: string, startDate?: string, endDate?: string): Promise<ApiResponse<any>> => {
    const params: Record<string, string> = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const response = await apiClient.get(`/analytics/advanced/users/${userId}/attribution`, { params })
    return response.data
  },

  getRealtimeDashboard: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/analytics/advanced/dashboard/realtime')
    return response.data
  },

  getLiveOrders: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/analytics/advanced/orders/live')
    return response.data
  },

  getConversionFunnel: async (startDate?: string, endDate?: string): Promise<ApiResponse<any>> => {
    const params: Record<string, string> = {}
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    const response = await apiClient.get('/analytics/advanced/funnel', { params })
    return response.data
  }
}

