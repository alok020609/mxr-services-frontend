import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface TwoFactorSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface TrustedDevice {
  id: string
  deviceName: string
  deviceType: string
  lastUsed: string
  ipAddress?: string
  location?: string
}

export interface ActiveSession {
  id: string
  deviceName: string
  deviceType: string
  ipAddress: string
  location?: string
  lastActivity: string
  current: boolean
}

export interface LoginAttempt {
  id: string
  ipAddress: string
  userAgent: string
  success: boolean
  attemptedAt: string
  location?: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  lastUsed?: string
  createdAt: string
  expiresAt?: string
}

export const securityApi = {
  setup2FA: async (): Promise<ApiResponse<TwoFactorSetup>> => {
    const response = await apiClient.post('/security/2fa/setup')
    return response.data
  },
  
  verify2FASetup: async (token: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/security/2fa/verify', { token })
    return response.data
  },
  
  disable2FA: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/security/2fa/disable')
    return response.data
  },
  
  getTrustedDevices: async (): Promise<ApiResponse<TrustedDevice[]>> => {
    const response = await apiClient.get('/security/devices')
    return response.data
  },
  
  removeTrustedDevice: async (deviceId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/security/devices/${deviceId}`)
    return response.data
  },
  
  getActiveSessions: async (): Promise<ApiResponse<ActiveSession[]>> => {
    const response = await apiClient.get('/security/sessions')
    return response.data
  },
  
  revokeAllSessions: async (): Promise<ApiResponse> => {
    const response = await apiClient.delete('/security/sessions')
    return response.data
  },
  
  revokeSession: async (sessionId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/security/sessions/${sessionId}`)
    return response.data
  },
  
  getLoginAttempts: async (): Promise<ApiResponse<LoginAttempt[]>> => {
    const response = await apiClient.get('/security/login-attempts')
    return response.data
  },
  
  getApiKeys: async (): Promise<ApiResponse<ApiKey[]>> => {
    const response = await apiClient.get('/security/api-keys')
    return response.data
  },
  
  createApiKey: async (name: string): Promise<ApiResponse<ApiKey>> => {
    const response = await apiClient.post('/security/api-keys', { name })
    return response.data
  },
  
  revokeApiKey: async (keyId: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/security/api-keys/${keyId}`)
    return response.data
  }
}
