import apiClient from '../client'
import type { ApiResponse, SystemHealth, SystemMetrics } from '../types'

export const monitoringApi = {
  getSystemHealth: async (): Promise<ApiResponse<SystemHealth>> => {
    const response = await apiClient.get('/monitoring/health')
    return response.data
  },
  
  getSystemMetrics: async (): Promise<ApiResponse<SystemMetrics>> => {
    const response = await apiClient.get('/monitoring/metrics')
    return response.data
  }
}
