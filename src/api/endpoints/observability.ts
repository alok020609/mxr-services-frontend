import apiClient from '../client'
import type { ApiResponse, SLADefinition, SLODefinition, SLOStatus, AlertThreshold, SLOReport } from '../types'

export const observabilityApi = {
  getSLADefinitions: async (): Promise<ApiResponse<SLADefinition[]>> => {
    const response = await apiClient.get('/observability/sla')
    return response.data
  },
  
  getSLODefinitions: async (): Promise<ApiResponse<SLODefinition[]>> => {
    const response = await apiClient.get('/observability/slo')
    return response.data
  },
  
  getSLOStatus: async (service: string): Promise<ApiResponse<SLOStatus>> => {
    const response = await apiClient.get(`/observability/slo/${service}/status`)
    return response.data
  },
  
  getAlertThresholds: async (): Promise<ApiResponse<AlertThreshold[]>> => {
    const response = await apiClient.get('/observability/alerts/thresholds')
    return response.data
  },
  
  checkAlertConditions: async (service: string): Promise<ApiResponse<{ triggered: boolean; alerts: any[] }>> => {
    const response = await apiClient.get(`/observability/alerts/${service}/check`)
    return response.data
  },
  
  generateSLOReport: async (service: string): Promise<ApiResponse<SLOReport>> => {
    const response = await apiClient.get(`/observability/slo/${service}/report`)
    return response.data
  }
}
