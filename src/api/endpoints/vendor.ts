import apiClient from '../client'
import type { ApiResponse, Product, PaginatedResponse } from '../types'

export interface VendorDashboard {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  recentOrders: any[]
}

export interface VendorPayout {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  scheduledDate: string
  completedDate?: string
}

export const vendorApi = {
  registerAsVendor: async (data: any): Promise<ApiResponse> => {
    const response = await apiClient.post('/vendor/register', data)
    return response.data
  },
  
  getVendorDashboard: async (): Promise<ApiResponse<VendorDashboard>> => {
    const response = await apiClient.get('/vendor/dashboard')
    return response.data
  },
  
  getVendorProducts: async (filters?: any): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const response = await apiClient.get('/vendor/products', { params: filters })
    return response.data
  },
  
  addVendorProduct: async (product: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post('/vendor/products', product)
    return response.data
  },
  
  getVendorPayouts: async (): Promise<ApiResponse<VendorPayout[]>> => {
    const response = await apiClient.get('/vendor/payouts')
    return response.data
  }
}
