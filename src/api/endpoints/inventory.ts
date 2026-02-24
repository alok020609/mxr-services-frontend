import apiClient from '../client'
import type { ApiResponse, InventoryItem, InventoryMovement, PaginatedResponse } from '../types'

export const inventoryApi = {
  getInventory: async (filters?: any): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> => {
    const response = await apiClient.get('/inventory', { params: filters })
    return response.data
  },
  
  updateInventory: async (productId: string, stock: number): Promise<ApiResponse<InventoryItem>> => {
    const response = await apiClient.put(`/inventory/${productId}`, { stock })
    return response.data
  },
  
  getInventoryMovements: async (productId: string): Promise<ApiResponse<InventoryMovement[]>> => {
    const response = await apiClient.get(`/inventory/${productId}/movements`)
    return response.data
  }
}
