import apiClient from '../client'
import type { ApiResponse, Product } from '../types'

export interface AdvancedSearchRequest {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  rating?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface AdvancedSearchResult {
  products: Product[]
  total: number
  page: number
  limit: number
  filters?: any
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters?: any
  createdAt: string
}

export interface ProductRecommendation {
  product: Product
  reason: string
  score?: number
}

export const searchApi = {
  advancedSearch: async (filters: AdvancedSearchRequest): Promise<ApiResponse<AdvancedSearchResult>> => {
    const response = await apiClient.get('/search/advanced', { params: filters })
    return response.data
  },
  
  getRecommendations: async (productId?: string): Promise<ApiResponse<ProductRecommendation[]>> => {
    const response = await apiClient.get('/search/recommendations', { params: { productId } })
    return response.data
  },
  
  getRecentlyViewed: async (): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get('/search/recently-viewed')
    return response.data
  },
  
  saveSearch: async (search: Partial<SavedSearch>): Promise<ApiResponse<SavedSearch>> => {
    const response = await apiClient.post('/search/saved', search)
    return response.data
  },
  
  getSavedSearches: async (): Promise<ApiResponse<SavedSearch[]>> => {
    const response = await apiClient.get('/search/saved')
    return response.data
  },
  
  deleteSavedSearch: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/search/saved/${id}`)
    return response.data
  }
}
