import apiClient from '../client'
import type { ApiResponse, Product } from '../types'

export interface FeaturedProducts {
  products: Product[]
  updatedAt: string
}

export interface ProductCollection {
  id: string
  name: string
  description?: string
  products: Product[]
  isActive: boolean
  createdAt: string
}

export interface ProductSpecification {
  key: string
  value: string | number | boolean
  unit?: string
}

export const productManagementApi = {
  getFeaturedProducts: async (): Promise<ApiResponse<FeaturedProducts>> => {
    const response = await apiClient.get('/product-management/featured')
    return response.data
  },
  
  setFeaturedProducts: async (productIds: string[]): Promise<ApiResponse<FeaturedProducts>> => {
    const response = await apiClient.put('/product-management/featured', { productIds })
    return response.data
  },
  
  getCollections: async (): Promise<ApiResponse<ProductCollection[]>> => {
    const response = await apiClient.get('/product-management/collections')
    return response.data
  },
  
  getProductSpecifications: async (productId: string): Promise<ApiResponse<ProductSpecification[]>> => {
    const response = await apiClient.get(`/product-management/${productId}/specifications`)
    return response.data
  },
  
  updateProductSpecifications: async (productId: string, specs: ProductSpecification[]): Promise<ApiResponse<ProductSpecification[]>> => {
    const response = await apiClient.put(`/product-management/${productId}/specifications`, { specifications: specs })
    return response.data
  }
}

