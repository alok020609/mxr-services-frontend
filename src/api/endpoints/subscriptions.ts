import apiClient from '../client'
import type { ApiResponse, Subscription } from '../types'

export const subscriptionsApi = {
  pauseSubscription: async (subscriptionId: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/pause`)
    return response.data
  },
  
  resumeSubscription: async (subscriptionId: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/resume`)
    return response.data
  },
  
  skipNextDelivery: async (subscriptionId: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/skip`)
    return response.data
  },
  
  changeFrequency: async (subscriptionId: string, frequency: string): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.put(`/subscriptions/${subscriptionId}/frequency`, { frequency })
    return response.data
  },
  
  cancelSubscription: async (subscriptionId: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/subscriptions/${subscriptionId}/cancel`)
    return response.data
  }
}
