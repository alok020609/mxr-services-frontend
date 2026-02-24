import apiClient from '../client'
import type { ApiResponse, Customer360, RFMAnalysis, CustomerSegment } from '../types'

export const crmApi = {
  getCustomer360: async (userId: string): Promise<ApiResponse<Customer360>> => {
    const response = await apiClient.get(`/crm/customers/${userId}/360`)
    return response.data
  },
  
  getRFM: async (userId: string): Promise<ApiResponse<RFMAnalysis>> => {
    const response = await apiClient.get(`/crm/customers/${userId}/rfm`)
    return response.data
  },
  
  addTag: async (userId: string, tag: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/crm/customers/${userId}/tags`, { tag })
    return response.data
  },
  
  addNote: async (userId: string, note: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/crm/customers/${userId}/notes`, { note })
    return response.data
  },
  
  getSegments: async (): Promise<ApiResponse<CustomerSegment[]>> => {
    const response = await apiClient.get('/crm/segments')
    return response.data
  }
}

