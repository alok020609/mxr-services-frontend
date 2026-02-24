import apiClient from '../client'
import type { ApiResponse, GiftRegistry, GiftRegistryItem, GiftTracking } from '../types'

export const giftsApi = {
  createRegistry: async (registry: Partial<GiftRegistry>): Promise<ApiResponse<GiftRegistry>> => {
    const response = await apiClient.post('/gifts/registry', registry)
    return response.data
  },
  
  getRegistries: async (): Promise<ApiResponse<GiftRegistry[]>> => {
    const response = await apiClient.get('/gifts/registry')
    return response.data
  },
  
  addRegistryItem: async (registryId: string, item: Partial<GiftRegistryItem>): Promise<ApiResponse<GiftRegistryItem>> => {
    const response = await apiClient.post('/gifts/registry/items', { registryId, ...item })
    return response.data
  },
  
  sendAsGift: async (orderId: string, giftData: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/gifts/send', { orderId, ...giftData })
    return response.data
  },
  
  scheduleGiftDelivery: async (giftId: string, schedule: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/gifts/schedule', { giftId, ...schedule })
    return response.data
  },
  
  trackGift: async (trackingNumber: string): Promise<ApiResponse<GiftTracking>> => {
    const response = await apiClient.get(`/gifts/track/${trackingNumber}`)
    return response.data
  }
}
