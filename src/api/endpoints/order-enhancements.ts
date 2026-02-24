import apiClient from '../client'
import type { ApiResponse, OrderNote, ScheduledDelivery, OrderSplit } from '../types'

export const orderEnhancementsApi = {
  addOrderNote: async (note: Partial<OrderNote>): Promise<ApiResponse<OrderNote>> => {
    const response = await apiClient.post('/order-enhancements/notes', note)
    return response.data
  },
  
  getOrderNotes: async (orderId: string): Promise<ApiResponse<OrderNote[]>> => {
    const response = await apiClient.get(`/order-enhancements/${orderId}/notes`)
    return response.data
  },
  
  scheduleDelivery: async (request: ScheduledDelivery): Promise<ApiResponse> => {
    const response = await apiClient.post('/order-enhancements/schedule-delivery', request)
    return response.data
  },
  
  getOrderSplits: async (orderId: string): Promise<ApiResponse<OrderSplit[]>> => {
    const response = await apiClient.get(`/order-enhancements/${orderId}/splits`)
    return response.data
  }
}
