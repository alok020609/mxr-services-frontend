import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface ShippingMethod {
  id: string
  name: string
  carrier: string
  estimatedDays: number
  cost: number
  currency: string
  isActive: boolean
}

export interface ShippingCalculation {
  methods: ShippingMethod[]
  total: number
  currency: string
}

export const shippingApi = {
  getShippingMethods: async (): Promise<ApiResponse<ShippingMethod[]>> => {
    const response = await apiClient.get('/shipping/methods')
    return response.data
  },
  
  calculateShipping: async (request: {
    address: any
    items: Array<{ weight: number; dimensions?: any }>
  }): Promise<ApiResponse<ShippingCalculation>> => {
    const response = await apiClient.post('/shipping/calculate', request)
    return response.data
  }
}
