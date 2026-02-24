import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface ShipmentTracking {
  trackingNumber: string
  carrier: string
  status: string
  currentLocation?: string
  estimatedDelivery?: string
  events: Array<{
    date: string
    location: string
    status: string
    description: string
  }>
}

export interface CarrierRate {
  carrier: string
  service: string
  rate: number
  currency: string
  estimatedDays: number
  trackingAvailable: boolean
}

export interface ShippingLabel {
  id: string
  trackingNumber: string
  carrier: string
  labelUrl: string
  createdAt: string
}

export const shippingCarriersApi = {
  trackShipment: async (trackingNumber: string): Promise<ApiResponse<ShipmentTracking>> => {
    const response = await apiClient.get(`/shipping/carriers/track/${trackingNumber}`)
    return response.data
  },
  
  getCarrierRates: async (request: {
    from: any
    to: any
    weight: number
    dimensions?: any
  }): Promise<ApiResponse<CarrierRate[]>> => {
    const response = await apiClient.post('/shipping/carriers/rates', request)
    return response.data
  },
  
  createShippingLabel: async (request: {
    orderId: string
    carrier: string
    service: string
    from: any
    to: any
  }): Promise<ApiResponse<ShippingLabel>> => {
    const response = await apiClient.post('/shipping/carriers/labels', request)
    return response.data
  }
}
