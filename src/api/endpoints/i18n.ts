import apiClient from '../client'
import type { ApiResponse, RegionalPrice, RegionalAvailability, RegionalPaymentMethod, RegionalShippingCarrier, RegionalCompliance, Store } from '../types'

export const i18nApi = {
  getRegionalPrice: async (productId: string, region: string): Promise<ApiResponse<RegionalPrice>> => {
    const response = await apiClient.get(`/i18n/products/${productId}/price`, { params: { region } })
    return response.data
  },
  
  getRegionalAvailability: async (productId: string, region: string): Promise<ApiResponse<RegionalAvailability>> => {
    const response = await apiClient.get(`/i18n/products/${productId}/availability`, { params: { region } })
    return response.data
  },
  
  getRegionalPaymentMethods: async (region: string): Promise<ApiResponse<RegionalPaymentMethod[]>> => {
    const response = await apiClient.get('/i18n/payment-methods', { params: { region } })
    return response.data
  },
  
  getRegionalShippingCarriers: async (region: string): Promise<ApiResponse<RegionalShippingCarrier[]>> => {
    const response = await apiClient.get('/i18n/shipping-carriers', { params: { region } })
    return response.data
  },
  
  getRegionalCompliance: async (region: string): Promise<ApiResponse<RegionalCompliance>> => {
    const response = await apiClient.get('/i18n/compliance', { params: { region } })
    return response.data
  },
  
  getStores: async (region?: string): Promise<ApiResponse<Store[]>> => {
    const response = await apiClient.get('/i18n/stores', { params: { region } })
    return response.data
  },
  
  createStore: async (store: Partial<Store>): Promise<ApiResponse<Store>> => {
    const response = await apiClient.post('/i18n/stores', store)
    return response.data
  },
  
  getStore: async (storeId: string): Promise<ApiResponse<Store>> => {
    const response = await apiClient.get(`/i18n/stores/${storeId}`)
    return response.data
  }
}
