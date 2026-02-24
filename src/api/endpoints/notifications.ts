import apiClient from '../client'
import type { Notification, ApiResponse, PaginatedResponse, NotificationPreferences } from '../types'

export const notificationsApi = {
  getNotifications: async (): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    const response = await apiClient.get('/notifications/')
    return response.data
  },
  
  markRead: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.put(`/notifications/${id}/read`)
    return response.data
  },
  
  markAllRead: async (): Promise<ApiResponse> => {
    const response = await apiClient.put('/notifications/read-all')
    return response.data
  },
  
  deleteNotification: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/notifications/${id}`)
    return response.data
  },
  
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get('/notifications/unread-count')
    return response.data
  },
  
  updatePreferences: async (preferences: NotificationPreferences | Record<string, boolean>): Promise<ApiResponse> => {
    const response = await apiClient.put('/notifications/preferences', preferences)
    return response.data
  }
}

