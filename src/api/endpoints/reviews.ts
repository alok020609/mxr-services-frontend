import apiClient from '../client'
import type { Review, ApiResponse, PaginatedResponse } from '../types'

export const reviewsApi = {
  getProductReviews: async (productId: string): Promise<ApiResponse<PaginatedResponse<Review>>> => {
    const response = await apiClient.get(`/reviews/product/${productId}`)
    return response.data
  },
  
  createReview: async (review: Omit<Review, 'id' | 'userId' | 'user' | 'createdAt' | 'updatedAt' | 'helpfulCount'>): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post('/reviews/', review)
    return response.data
  },
  
  updateReview: async (id: string, review: Partial<Review>): Promise<ApiResponse<Review>> => {
    const response = await apiClient.put(`/reviews/${id}`, review)
    return response.data
  },
  
  deleteReview: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/reviews/${id}`)
    return response.data
  },
  
  markHelpful: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/reviews/${id}/helpful`)
    return response.data
  },
  
  reportReview: async (id: string, reason: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/reviews/${id}/report`, { reason })
    return response.data
  }
}

