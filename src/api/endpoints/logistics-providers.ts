import apiClient from '../client'
import type { ApiResponse, LogisticsProvider, PaginatedResponse } from '../types'

export const logisticsProvidersApi = {
  getProviders: async (filters?: {
    isActive?: boolean
    type?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<LogisticsProvider> | LogisticsProvider[]>> => {
    const response = await apiClient.get('/admin/logistics-providers', { params: filters })
    return response.data
  },

  getProvider: async (id: string): Promise<ApiResponse<LogisticsProvider>> => {
    const response = await apiClient.get(`/admin/logistics-providers/${id}`)
    return response.data
  },

  createProvider: async (data: Partial<LogisticsProvider>): Promise<ApiResponse<LogisticsProvider>> => {
    const response = await apiClient.post('/admin/logistics-providers', data)
    return response.data
  },

  updateProvider: async (id: string, data: Partial<LogisticsProvider>): Promise<ApiResponse<LogisticsProvider>> => {
    const response = await apiClient.put(`/admin/logistics-providers/${id}`, data)
    return response.data
  },

  toggleProvider: async (id: string): Promise<ApiResponse<LogisticsProvider>> => {
    const response = await apiClient.patch(`/admin/logistics-providers/${id}/toggle`)
    return response.data
  },

  setDefaultProvider: async (id: string): Promise<ApiResponse<LogisticsProvider>> => {
    const response = await apiClient.patch(`/admin/logistics-providers/${id}/set-default`)
    return response.data
  },

  deleteProvider: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/logistics-providers/${id}`)
    return response.data
  }
}
