import apiClient from '../client'
import type { ApiResponse } from '../types'

export const operationalApi = {
  bulkProducts: async (operation: string, data: any[]): Promise<ApiResponse> => {
    const response = await apiClient.post('/operational/bulk/products', { operation, data })
    return response.data
  },
  
  bulkOrders: async (operation: string, data: any[]): Promise<ApiResponse> => {
    const response = await apiClient.post('/operational/bulk/orders', { operation, data })
    return response.data
  },
  
  importData: async (file: File, type: string, options?: { skipHeader?: boolean; validate?: boolean }): Promise<ApiResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    if (options) {
      formData.append('options', JSON.stringify(options))
    }
    const response = await apiClient.post('/operational/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  
  getImportStatus: async (jobId?: string): Promise<ApiResponse<any>> => {
    if (jobId) {
      const response = await apiClient.get(`/operational/import/${jobId}/status`)
      return response.data
    }
    const response = await apiClient.get('/operational/import')
    return response.data
  },
  
  getImportResult: async (jobId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/operational/import/${jobId}/result`)
    return response.data
  },
  
  exportData: async (type: string, filters?: any): Promise<Blob> => {
    const response = await apiClient.post('/operational/export', { type, filters }, { responseType: 'blob' })
    return response.data
  },
  
  getExportStatus: async (jobId?: string): Promise<ApiResponse<any>> => {
    if (jobId) {
      const response = await apiClient.get(`/operational/export/${jobId}`)
      return response.data
    }
    const response = await apiClient.get('/operational/export')
    return response.data
  },
  
  getCronJobs: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/operational/cron')
    return response.data
  },
  
  updateCronJob: async (id: string, config: any): Promise<ApiResponse> => {
    const response = await apiClient.put(`/operational/cron/${id}`, config)
    return response.data
  },
  
  getWebhooks: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/operational/webhooks')
    return response.data
  },
  
  createWebhook: async (webhook: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/operational/webhooks', webhook)
    return response.data
  },
  
  getWebhookLogs: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/operational/webhooks/logs')
    return response.data
  },
  
  updateWebhook: async (id: string, webhook: any): Promise<ApiResponse> => {
    const response = await apiClient.put(`/operational/webhooks/${id}`, webhook)
    return response.data
  },
  
  deleteWebhook: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/operational/webhooks/${id}`)
    return response.data
  }
}

