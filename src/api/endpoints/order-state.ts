import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface OrderStateTransition {
  orderId: string
  transition: string
  reason?: string
}

export interface OrderStateHistory {
  id: string
  orderId: string
  fromState: string
  toState: string
  transition: string
  performedBy: string
  reason?: string
  createdAt: string
}

export interface AvailableTransition {
  transition: string
  toState: string
  description?: string
  requiresReason?: boolean
}

export const orderStateApi = {
  transitionOrderState: async (orderId: string, newState: string, reason?: string): Promise<ApiResponse> => {
    const body = {
      newState,
      ...(reason ? { metadata: { reason } } : {})
    }
    const response = await apiClient.post(`/order-state/${orderId}/transition`, body)
    return response.data
  },
  
  rollbackOrderState: async (orderId: string, previousState: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/order-state/${orderId}/rollback`, { previousState })
    return response.data
  },
  
  getOrderStateHistory: async (orderId: string): Promise<ApiResponse<OrderStateHistory[]>> => {
    const response = await apiClient.get(`/order-state/${orderId}/history`)
    return response.data
  },
  
  /** Backend returns { data: { currentState, availableTransitions: string[] } } per API spec */
  getAvailableTransitions: async (orderId: string): Promise<ApiResponse<{ currentState?: string; availableTransitions: string[] } | AvailableTransition[]>> => {
    const response = await apiClient.get(`/order-state/${orderId}/transitions`)
    return response.data
  }
}
