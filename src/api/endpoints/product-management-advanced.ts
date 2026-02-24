import apiClient from '../client'
import type { ApiResponse, Product } from '../types'

export const productManagementAdvancedApi = {
  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get('/product-management/featured')
    return response.data
  },
  
  getCollections: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get('/product-management/collections')
    return response.data
  },
  
  getSpecifications: async (productId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/product-management/${productId}/specifications`)
    return response.data
  },
  
  updateSpecifications: async (productId: string, specifications: any): Promise<ApiResponse> => {
    const response = await apiClient.put(`/product-management/${productId}/specifications`, specifications)
    return response.data
  },
  
  setFeatured: async (productIds: string[]): Promise<ApiResponse> => {
    const response = await apiClient.put('/product-management/featured', { productIds })
    return response.data
  }
}

