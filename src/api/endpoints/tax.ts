import apiClient from '../client'
import type { ApiResponse, TaxCalculationRequest, TaxCalculationResponse } from '../types'

export interface TaxRate {
  id: string
  region: string
  country: string
  state?: string
  city?: string
  rate: number
  type: 'sales' | 'vat' | 'gst' | 'custom'
  isActive: boolean
}

export const taxApi = {
  calculateTax: async (request: TaxCalculationRequest): Promise<ApiResponse<TaxCalculationResponse>> => {
    const response = await apiClient.post('/tax/calculate', request)
    return response.data
  },
  
  getTaxRates: async (region?: string): Promise<ApiResponse<TaxRate[]>> => {
    const response = await apiClient.get('/tax/rates', { params: { region } })
    return response.data
  }
}
