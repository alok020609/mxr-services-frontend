import apiClient from '../client'
import type { AnalyticsDashboard, ApiResponse } from '../types'

export const analyticsApi = {
  getDashboard: async (): Promise<ApiResponse<AnalyticsDashboard>> => {
    const response = await apiClient.get('/analytics/dashboard')
    return response.data
  },
  
  getCLV: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/analytics/clv/${userId}`)
    return response.data
  },
  
  getCohort: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/analytics/cohort')
    return response.data
  },
  
  getFunnel: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/analytics/funnel')
    return response.data
  },
  
  getSegments: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/analytics/segments')
    return response.data
  }
}

