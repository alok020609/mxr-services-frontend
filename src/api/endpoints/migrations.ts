import apiClient from '../client'
import type { ApiResponse, Migration, CompatibilityCheck } from '../types'

export const migrationsApi = {
  executeMigration: async (migrationName: string): Promise<ApiResponse<Migration>> => {
    const response = await apiClient.post('/migrations/execute', { migrationName })
    return response.data
  },
  
  executeZeroDowntimeMigration: async (migrationName: string): Promise<ApiResponse<Migration>> => {
    const response = await apiClient.post('/migrations/zero-downtime', { migrationName })
    return response.data
  },
  
  rollbackMigration: async (migrationId: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/migrations/${migrationId}/rollback`)
    return response.data
  },
  
  gradualRollout: async (migrationId: string, percentage: number): Promise<ApiResponse> => {
    const response = await apiClient.post('/migrations/rollout', { migrationId, percentage })
    return response.data
  },
  
  checkCompatibility: async (migrationName: string): Promise<ApiResponse<CompatibilityCheck>> => {
    const response = await apiClient.post('/migrations/compatibility', { migrationName })
    return response.data
  }
}
