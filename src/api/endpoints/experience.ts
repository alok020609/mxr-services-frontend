import apiClient from '../client'
import type { ApiResponse, Product, ProductQuestion, SizeGuide, ProductVideo, SocialProof, WaitlistItem, ProductAlert, PaginatedResponse } from '../types'

export const experienceApi = {
  getProductQuestions: async (productId: string, answeredOnly?: boolean): Promise<ApiResponse<ProductQuestion[]>> => {
    const params = answeredOnly !== undefined ? { answeredOnly } : {}
    const response = await apiClient.get(`/experience/products/${productId}/questions`, { params })
    return response.data
  },
  
  getSizeGuide: async (productId: string): Promise<ApiResponse<SizeGuide>> => {
    const response = await apiClient.get(`/experience/products/${productId}/size-guide`)
    return response.data
  },
  
  getProductVideos: async (productId: string): Promise<ApiResponse<ProductVideo[]>> => {
    const response = await apiClient.get(`/experience/products/${productId}/videos`)
    return response.data
  },
  
  getSocialProof: async (productId: string): Promise<ApiResponse<SocialProof>> => {
    const response = await apiClient.get(`/experience/products/${productId}/social-proof`)
    return response.data
  },
  
  askQuestion: async (productId: string, question: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/experience/products/questions', { productId, question })
    return response.data
  },
  
  getRecentlyViewed: async (): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get('/experience/recently-viewed')
    return response.data
  },
  
  addToWaitlist: async (productId: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/experience/waitlist', { productId })
    return response.data
  },
  
  getWaitlist: async (): Promise<ApiResponse<WaitlistItem[]>> => {
    const response = await apiClient.get('/experience/waitlist')
    return response.data
  },
  
  createProductAlert: async (productId: string, type: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/experience/product-alerts', { productId, type })
    return response.data
  },
  
  getProductAlerts: async (): Promise<ApiResponse<ProductAlert[]>> => {
    const response = await apiClient.get('/experience/product-alerts')
    return response.data
  },
  
  // Admin endpoints for managing questions
  getAllQuestions: async (filters?: { productId?: string; answered?: boolean; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<ProductQuestion>>> => {
    const response = await apiClient.get('/admin/questions', { params: filters })
    return response.data
  },
  
  answerQuestion: async (questionId: string, answer: string): Promise<ApiResponse<ProductQuestion>> => {
    // Try different endpoint structures based on common REST patterns
    // First try: PUT /admin/questions/{id}/answer (most common)
    try {
      const response = await apiClient.put(`/admin/questions/${questionId}/answer`, { answer })
      return response.data
    } catch (putError: any) {
      // If PUT fails with 400 and the error suggests wrong method, try alternatives
      void (putError.response?.data?.error || putError.message || '')
      
      // Try POST (in case backend expects POST for creating answers)
      if (putError.response?.status === 400 || putError.response?.status === 405) {
        try {
          const response = await apiClient.post(`/admin/questions/${questionId}/answer`, { answer })
          return response.data
        } catch (postError: any) {
          // Try updating the question directly
          try {
            const response = await apiClient.put(`/admin/questions/${questionId}`, { answer })
            return response.data
          } catch (updateError: any) {
            // Try PATCH
            try {
              const response = await apiClient.patch(`/admin/questions/${questionId}`, { answer })
              return response.data
            } catch (patchError: any) {
              // Return the original PUT error with better context
              throw putError
            }
          }
        }
      }
      throw putError
    }
  },
  
  deleteQuestion: async (questionId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/admin/questions/${questionId}`)
    return response.data
  },
  
  updateAnswer: async (questionId: string, answer: string): Promise<ApiResponse<ProductQuestion>> => {
    // Try PUT first for updating
    try {
      const response = await apiClient.put(`/admin/questions/${questionId}/answer`, { answer })
      return response.data
    } catch (putError: any) {
      // If PUT fails, try PATCH
      if (putError.response?.status === 400 || putError.response?.status === 405) {
        try {
          const response = await apiClient.patch(`/admin/questions/${questionId}/answer`, { answer })
          return response.data
        } catch (patchError: any) {
          // Try updating the question directly
          try {
            const response = await apiClient.put(`/admin/questions/${questionId}`, { answer })
            return response.data
          } catch (updateError: any) {
            throw putError
          }
        }
      }
      throw putError
    }
  }
}

