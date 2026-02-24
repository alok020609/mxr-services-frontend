import apiClient from '../client'
import type { Order, CreateOrderRequest, ReturnOrderRequest, ApiResponse, PaginatedResponse } from '../types'
import { handleApiCall } from '../helpers'

export const ordersApi = {
  // Create order - explicit payload so paymentMethod is never dropped (default 'cod')
  createOrder: async (orderData: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const body = {
      shippingAddressId: orderData.shippingAddressId,
      paymentMethod: orderData.paymentMethod || 'cod',
      ...(orderData.billingAddressId != null && orderData.billingAddressId !== '' ? { billingAddressId: orderData.billingAddressId } : {}),
      ...(orderData.couponCode != null && orderData.couponCode !== '' ? { couponCode: orderData.couponCode } : {})
    }
    const response = await apiClient.post('/orders/', body)
    return response.data
  },
  
  // Get orders list
  getOrders: async (filters?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const response = await apiClient.get('/orders/', { params: filters })
    return response.data
  },
  
  // Get order by ID
  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get(`/orders/${id}`)
    return response.data
  },
  
  // Cancel order
  cancelOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.post(`/orders/${id}/cancel`)
    return response.data
  },
  
  // Return order - reason required; optional items (order item IDs) for partial return
  returnOrder: async (id: string, payload: ReturnOrderRequest): Promise<ApiResponse<Order>> => {
    const body = {
      reason: payload.reason,
      ...(payload.items?.length ? { items: payload.items } : {})
    }
    const response = await apiClient.post(`/orders/${id}/return`, body)
    return response.data
  },
  
  // Track order
  trackOrder: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/orders/${id}/tracking`)
    return response.data
  }
}

