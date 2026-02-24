import apiClient from '../client'
import type { ApiResponse, LoyaltyPoints, LoyaltyTier, LoyaltyReward, ReferralCode } from '../types'

export const loyaltyApi = {
  getPoints: async (): Promise<ApiResponse<LoyaltyPoints>> => {
    const response = await apiClient.get('/loyalty/points')
    return response.data
  },
  
  getTiers: async (): Promise<ApiResponse<LoyaltyTier[]>> => {
    const response = await apiClient.get('/loyalty/tiers')
    return response.data
  },
  
  getRewards: async (): Promise<ApiResponse<LoyaltyReward[]>> => {
    const response = await apiClient.get('/loyalty/rewards')
    return response.data
  },
  
  redeemReward: async (rewardId: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/loyalty/rewards/redeem', { rewardId })
    return response.data
  },
  
  getReferral: async (): Promise<ApiResponse<ReferralCode>> => {
    const response = await apiClient.get('/loyalty/referral')
    return response.data
  },
  
  applyReferral: async (code: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/loyalty/referral/apply', { code })
    return response.data
  }
}

