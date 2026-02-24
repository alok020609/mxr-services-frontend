import apiClient from '../client'
import type { WishlistItem, ApiResponse } from '../types'

export const wishlistApi = {
  getWishlist: async (): Promise<ApiResponse<WishlistItem[]>> => {
    const response = await apiClient.get('/wishlist/')
    return response.data
  },
  
  addToWishlist: async (productId: string): Promise<ApiResponse<WishlistItem>> => {
    const response = await apiClient.post('/wishlist/add', { productId })
    return response.data
  },
  
  removeFromWishlist: async (productId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/wishlist/remove/${productId}`)
    return response.data
  },
  
  checkWishlist: async (productId: string): Promise<ApiResponse<{ inWishlist: boolean }>> => {
    const response = await apiClient.get(`/wishlist/check/${productId}`)
    return response.data
  }
}

