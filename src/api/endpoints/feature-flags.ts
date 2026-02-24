import apiClient from '../client'
import type { ApiResponse, FeatureFlag, FeatureFlagRule, FeatureFlagOverride, FeatureFlagStats } from '../types'

export const featureFlagsApi = {
  evaluateFlag: async (flagKey: string): Promise<ApiResponse<{ enabled: boolean; value: any }>> => {
    const response = await apiClient.get(`/feature-flags/${flagKey}/evaluate`)
    return response.data
  },
  
  getAllFlags: async (): Promise<ApiResponse<FeatureFlag[]>> => {
    const response = await apiClient.get('/feature-flags')
    return response.data
  },
  
  createFlag: async (flag: Partial<FeatureFlag>): Promise<ApiResponse<FeatureFlag>> => {
    const response = await apiClient.post('/feature-flags', flag)
    return response.data
  },
  
  getFlag: async (flagKey: string): Promise<ApiResponse<FeatureFlag>> => {
    const response = await apiClient.get(`/feature-flags/${flagKey}`)
    return response.data
  },
  
  updateFlag: async (flagKey: string, flag: Partial<FeatureFlag>): Promise<ApiResponse<FeatureFlag>> => {
    const response = await apiClient.put(`/feature-flags/${flagKey}`, flag)
    return response.data
  },
  
  getFlagStats: async (flagKey: string): Promise<ApiResponse<FeatureFlagStats>> => {
    const response = await apiClient.get(`/feature-flags/${flagKey}/stats`)
    return response.data
  },
  
  createRule: async (flagKey: string, rule: Partial<FeatureFlagRule>): Promise<ApiResponse<FeatureFlagRule>> => {
    const response = await apiClient.post(`/feature-flags/${flagKey}/rules`, rule)
    return response.data
  },
  
  createOverride: async (flagKey: string, override: Partial<FeatureFlagOverride>): Promise<ApiResponse<FeatureFlagOverride>> => {
    const response = await apiClient.post(`/feature-flags/${flagKey}/overrides`, override)
    return response.data
  }
}
