import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface ReorderPointParams {
  leadTime?: number
  averageDailyDemand?: number
  safetyStock?: number
}

export interface StockTransferData {
  productId: string
  fromLocation: string
  toLocation: string
  quantity: number
  reason?: string
}

export interface CycleCountData {
  productId: string
  countedQuantity: number
  location?: string
  notes?: string
}

export interface ShrinkageData {
  productId: string
  quantity: number
  reason: string
  notes?: string
}

export const inventoryAdvancedApi = {
  calculateReorderPoint: async (productId: string, params?: ReorderPointParams): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/inventory/advanced/${productId}/reorder-point`, params || {})
    return response.data
  },

  transferStock: async (data: StockTransferData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/inventory/advanced/transfer', data)
    return response.data
  },

  recordCycleCount: async (data: CycleCountData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/inventory/advanced/cycle-count', data)
    return response.data
  },

  getAgingReport: async (filters?: { categoryId?: string; minAge?: number; maxAge?: number }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/inventory/advanced/aging-report', { params: filters })
    return response.data
  },

  recordShrinkage: async (data: ShrinkageData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/inventory/advanced/shrinkage', data)
    return response.data
  }
}

