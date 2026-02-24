import apiClient from '../client'
import type {
  ApiResponse,
  ShipmentTracking,
  ShippingRate,
  RateComparisonResponse,
  LogisticsShipment,
  CreateShipmentRequest,
  CreateReturnRequest,
  SchedulePickupRequest,
  CancelShipmentRequest
} from '../types'

export const logisticsApi = {
  trackShipment: async (params: {
    orderId?: string
    trackingNumber?: string
    providerType?: string
  }): Promise<ApiResponse<ShipmentTracking>> => {
    const response = await apiClient.get('/logistics/track', { params })
    return response.data
  },

  calculateRates: async (
    data: {
      pickup: {
        pincode: string
        city?: string
        state?: string
      }
      delivery: {
        pincode: string
        city?: string
        state?: string
      }
      weight: number
      dimensions?: {
        length: number
        width: number
        height: number
      }
      codAmount?: number
    },
    compareAll?: boolean,
    providerType?: string
  ): Promise<ApiResponse<ShippingRate[] | RateComparisonResponse>> => {
    const response = await apiClient.post('/logistics/rates', data, {
      params: { compareAll, providerType }
    })
    return response.data
  },

  createShipment: async (
    data: CreateShipmentRequest,
    providerId?: string
  ): Promise<ApiResponse<LogisticsShipment>> => {
    const response = await apiClient.post('/logistics/shipments', data, {
      params: { providerId }
    })
    return response.data
  },

  getShipment: async (orderId: string): Promise<ApiResponse<LogisticsShipment[]>> => {
    const response = await apiClient.get(`/logistics/shipments/${orderId}`)
    return response.data
  },

  generateLabel: async (shipmentId: string): Promise<ApiResponse<{ labelUrl: string; awbNumber: string }>> => {
    const response = await apiClient.post(`/logistics/shipments/${shipmentId}/label`)
    return response.data
  },

  schedulePickup: async (
    shipmentId: string,
    data: SchedulePickupRequest
  ): Promise<ApiResponse<{ success: boolean; pickupDate: string }>> => {
    const response = await apiClient.post(`/logistics/shipments/${shipmentId}/pickup`, data)
    return response.data
  },

  cancelShipment: async (
    shipmentId: string,
    data?: CancelShipmentRequest
  ): Promise<ApiResponse<LogisticsShipment>> => {
    const response = await apiClient.delete(`/logistics/shipments/${shipmentId}`, { data })
    return response.data
  },

  createReturn: async (data: CreateReturnRequest): Promise<ApiResponse<{
    id: string
    awbNumber: string
    trackingNumber: string
  }>> => {
    const response = await apiClient.post('/logistics/returns', data)
    return response.data
  }
}
