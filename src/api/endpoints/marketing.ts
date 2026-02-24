import apiClient from '../client'
import type { ApiResponse, FlashSale, Deal, ProductBundle, AbandonedCart, Product } from '../types'

export const marketingApi = {
  getFlashSales: async (): Promise<ApiResponse<FlashSale[]>> => {
    const response = await apiClient.get('/marketing/flash-sales')
    return response.data
  },
  
  getDeals: async (): Promise<ApiResponse<Deal[]>> => {
    const response = await apiClient.get('/marketing/deals')
    return response.data
  },
  
  getBundles: async (): Promise<ApiResponse<ProductBundle[]>> => {
    const response = await apiClient.get('/marketing/bundles')
    return response.data
  },
  
  getRecommendations: async (productId?: string): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get('/marketing/recommendations', { params: { productId } })
    return response.data
  },
  
  getAbandonedCarts: async (): Promise<ApiResponse<AbandonedCart[]>> => {
    const response = await apiClient.get('/marketing/abandoned-carts')
    return response.data
  }
}
