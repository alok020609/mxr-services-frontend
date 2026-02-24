import apiClient from '../client'
import type { ApiResponse, Product } from '../types'

export interface UserGeneratedContent {
  id: string
  productId?: string
  userId: string
  type: 'image' | 'video' | 'review'
  url: string
  caption?: string
  approved: boolean
  createdAt: string
}

export interface SocialShare {
  id: string
  productId: string
  platform: string
  sharedAt: string
}

export interface Influencer {
  id: string
  name: string
  platform: string
  followers: number
  engagementRate: number
  products: Product[]
}

export const socialApi = {
  getUGC: async (productId?: string): Promise<ApiResponse<UserGeneratedContent[]>> => {
    const response = await apiClient.get('/social/ugc', { params: { productId } })
    return response.data
  },
  
  submitUGC: async (content: Partial<UserGeneratedContent>): Promise<ApiResponse<UserGeneratedContent>> => {
    const response = await apiClient.post('/social/ugc', content)
    return response.data
  },
  
  socialLogin: async (provider: string, token: string): Promise<ApiResponse<{ token: string; user: any }>> => {
    const response = await apiClient.post('/social/login', { provider, token })
    return response.data
  },
  
  shareProduct: async (productId: string, platform: string): Promise<ApiResponse<SocialShare>> => {
    const response = await apiClient.post(`/social/products/${productId}/share`, { platform })
    return response.data
  },
  
  getInfluencers: async (): Promise<ApiResponse<Influencer[]>> => {
    const response = await apiClient.get('/social/influencers')
    return response.data
  }
}

