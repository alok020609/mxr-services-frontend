import apiClient from '../client'
import type { ApiResponse, BatchRequest, BatchResponse, BatchRequestPayload } from '../types'

export const batchApi = {
  executeBatch: async (requests: BatchRequest[]): Promise<ApiResponse<BatchResponse[]>> => {
    const payload: BatchRequestPayload = { requests }
    const response = await apiClient.post('/batch', payload)
    return response.data
  }
}

