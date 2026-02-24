import apiClient from '../client'
import type { Coupon, ApiResponse } from '../types'

export const couponsApi = {
  getCoupons: async (): Promise<ApiResponse<Coupon[]>> => {
    const response = await apiClient.get('/coupons/')
    return response.data
  },
  
  getCoupon: async (code: string): Promise<ApiResponse<Coupon>> => {
    const response = await apiClient.get(`/coupons/${code}`)
    return response.data
  },
  
  validateCoupon: async (code: string, amount: number): Promise<ApiResponse<{ valid: boolean; discount: number }>> => {
    const response = await apiClient.post('/coupons/validate', { code, amount })
    return response.data
  },
  
  getMyCoupons: async (): Promise<ApiResponse<Coupon[]>> => {
    const response = await apiClient.get('/coupons/my-coupons')
    return response.data
  },
  
  // Admin operations
  createCoupon: async (couponData: any): Promise<ApiResponse<Coupon>> => {
    const response = await apiClient.post('/coupons/', couponData)
    return response.data
  },
  
  updateCoupon: async (code: string, couponData: Partial<Coupon>): Promise<ApiResponse<Coupon>> => {
    const response = await apiClient.put(`/coupons/${code}`, couponData)
    return response.data
  },
  
  deleteCoupon: async (code: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/coupons/${code}`)
    return response.data
  }
}

