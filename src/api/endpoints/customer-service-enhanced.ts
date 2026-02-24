import apiClient from '../client'
import type { ApiResponse, OrderTracking, KnowledgeBaseArticle, TroubleshootingGuide, VideoTutorial, CallbackRequest } from '../types'

export const customerServiceEnhancedApi = {
  trackOrder: async (orderNumber: string, email?: string): Promise<ApiResponse<OrderTracking>> => {
    const response = await apiClient.post('/customer-service/track-order', { orderNumber, email })
    return response.data
  },
  
  getKnowledgeBase: async (category?: string): Promise<ApiResponse<KnowledgeBaseArticle[]>> => {
    const response = await apiClient.get('/customer-service/knowledge-base', { params: { category } })
    return response.data
  },
  
  getTroubleshootingGuides: async (category?: string): Promise<ApiResponse<TroubleshootingGuide[]>> => {
    const response = await apiClient.get('/customer-service/troubleshooting', { params: { category } })
    return response.data
  },
  
  getVideoTutorials: async (category?: string): Promise<ApiResponse<VideoTutorial[]>> => {
    const response = await apiClient.get('/customer-service/video-tutorials', { params: { category } })
    return response.data
  },
  
  scheduleCallback: async (request: CallbackRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/customer-service/callback', request)
    return response.data
  }
}
