import apiClient from '../client'
import type { ApiResponse, Integration } from '../types'

export const integrationsApi = {
  // Note: Specific endpoints depend on backend_apis.md
  // This is a placeholder structure
  listIntegrations: async (): Promise<ApiResponse<Integration[]>> => {
    const response = await apiClient.get('/integrations')
    return response.data
  },
  
  getIntegration: async (id: string): Promise<ApiResponse<Integration>> => {
    const response = await apiClient.get(`/integrations/${id}`)
    return response.data
  },
  
  createIntegration: async (integration: Partial<Integration>): Promise<ApiResponse<Integration>> => {
    const response = await apiClient.post('/integrations', integration)
    return response.data
  },
  
  updateIntegration: async (id: string, integration: Partial<Integration>): Promise<ApiResponse<Integration>> => {
    const response = await apiClient.put(`/integrations/${id}`, integration)
    return response.data
  },
  
  deleteIntegration: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/integrations/${id}`)
    return response.data
  }
}
