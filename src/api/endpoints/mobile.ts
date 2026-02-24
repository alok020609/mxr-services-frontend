import apiClient from '../client'
import type { ApiResponse, AppVersion, DeviceRegistration, DeepLink, MobilePayment, PushNotification } from '../types'

export const mobileApi = {
  getAppVersion: async (): Promise<ApiResponse<AppVersion>> => {
    const response = await apiClient.get('/mobile/version')
    return response.data
  },
  
  registerDevice: async (deviceData: DeviceRegistration): Promise<ApiResponse> => {
    const response = await apiClient.post('/mobile/device/register', deviceData)
    return response.data
  },
  
  createDeepLink: async (target: string): Promise<ApiResponse<DeepLink>> => {
    const response = await apiClient.post('/mobile/deep-link', { target })
    return response.data
  },
  
  processMobilePayment: async (payment: MobilePayment): Promise<ApiResponse> => {
    const response = await apiClient.post('/mobile/payment', payment)
    return response.data
  },
  
  sendPushNotification: async (notification: PushNotification): Promise<ApiResponse> => {
    const response = await apiClient.post('/mobile/push', notification)
    return response.data
  }
}

