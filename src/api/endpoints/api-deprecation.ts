import apiClient from '../client'
import type {
  ApiResponse,
  VersioningStrategy,
  DeprecationPolicy,
  DeprecationNotice,
  CreateDeprecationNoticeRequest,
  VersionLifecycle,
  CompatibilityGuarantees
} from '../types'

export const apiDeprecationApi = {
  getVersioningStrategy: async (): Promise<ApiResponse<VersioningStrategy>> => {
    const response = await apiClient.get('/deprecation/versioning-strategy')
    return response.data
  },

  getDeprecationPolicy: async (): Promise<ApiResponse<DeprecationPolicy>> => {
    const response = await apiClient.get('/deprecation/deprecation-policy')
    return response.data
  },

  getDeprecationNotices: async (): Promise<ApiResponse<DeprecationNotice[]>> => {
    const response = await apiClient.get('/deprecation/notices')
    return response.data
  },

  createDeprecationNotice: async (
    notice: CreateDeprecationNoticeRequest
  ): Promise<ApiResponse<DeprecationNotice>> => {
    const response = await apiClient.post('/deprecation/notices', notice)
    return response.data
  },

  getVersionLifecycle: async (version: string): Promise<ApiResponse<VersionLifecycle>> => {
    const response = await apiClient.get(`/deprecation/versions/${version}/lifecycle`)
    return response.data
  },

  getCompatibilityGuarantees: async (): Promise<ApiResponse<CompatibilityGuarantees>> => {
    const response = await apiClient.get('/deprecation/compatibility-guarantees')
    return response.data
  }
}

