import apiClient from '../client'
import type {
  ApiResponse,
  ApiTier,
  ApiUsage,
  ApiVersionInfo,
  DeprecateVersionRequest
} from '../types'

export const apiGatewayApi = {
  getUserTier: async (): Promise<ApiResponse<ApiTier>> => {
    const response = await apiClient.get('/gateway/tier')
    return response.data
  },

  setUserTier: async (tier: ApiTier): Promise<ApiResponse<ApiTier>> => {
    const response = await apiClient.put('/gateway/tier', tier)
    return response.data
  },

  getApiUsage: async (): Promise<ApiResponse<ApiUsage>> => {
    const response = await apiClient.get('/gateway/usage')
    return response.data
  },

  getApiVersionInfo: async (version: string): Promise<ApiResponse<ApiVersionInfo>> => {
    const response = await apiClient.get(`/gateway/versions/${version}`)
    return response.data
  },

  deprecateApiVersion: async (
    request: DeprecateVersionRequest
  ): Promise<ApiResponse<ApiVersionInfo>> => {
    const response = await apiClient.post('/gateway/versions/deprecate', request)
    return response.data
  }
}
