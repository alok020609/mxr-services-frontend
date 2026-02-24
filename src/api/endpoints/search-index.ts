import apiClient from '../client'
import type { ApiResponse, Product, PaginatedResponse } from '../types'

export interface SearchIndexStatus {
  totalProducts: number
  indexedProducts: number
  lastIndexedAt?: string
  isIndexing: boolean
}

export interface IndexResult {
  success: boolean
  indexed: number
  failed: number
  errors?: string[]
}

export const searchIndexApi = {
  search: async (query: string, filters?: any): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const response = await apiClient.get('/search-index/search', { params: { q: query, ...filters } })
    return response.data
  },
  
  indexProduct: async (productId: string): Promise<ApiResponse<IndexResult>> => {
    const response = await apiClient.post(`/search-index/index/${productId}`)
    return response.data
  },
  
  batchIndexProducts: async (productIds: string[]): Promise<ApiResponse<IndexResult>> => {
    const response = await apiClient.post('/search-index/index/batch', { productIds })
    return response.data
  },
  
  reindexAll: async (): Promise<ApiResponse<IndexResult>> => {
    const response = await apiClient.post('/search-index/reindex/all')
    return response.data
  },
  
  reindexCategory: async (categoryId: string): Promise<ApiResponse<IndexResult>> => {
    const response = await apiClient.post(`/search-index/reindex/category/${categoryId}`)
    return response.data
  }
}
