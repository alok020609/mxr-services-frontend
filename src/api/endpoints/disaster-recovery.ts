import apiClient from '../client'
import type { ApiResponse, RPORTO, DisasterRecoveryPlan, Backup, BackupSchedule } from '../types'

export const disasterRecoveryApi = {
  getRPORTO: async (): Promise<ApiResponse<RPORTO>> => {
    const response = await apiClient.get('/disaster-recovery/rpo-rto')
    return response.data
  },
  
  getDRPlan: async (): Promise<ApiResponse<DisasterRecoveryPlan>> => {
    const response = await apiClient.get('/disaster-recovery/plan')
    return response.data
  },
  
  createBackup: async (type: string): Promise<ApiResponse<Backup>> => {
    const response = await apiClient.post('/disaster-recovery/backups', { type })
    return response.data
  },
  
  scheduleBackups: async (schedule: BackupSchedule): Promise<ApiResponse> => {
    const response = await apiClient.post('/disaster-recovery/backups/schedule', schedule)
    return response.data
  },
  
  restoreBackup: async (backupId: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/disaster-recovery/backups/${backupId}/restore`)
    return response.data
  },
  
  performRestoreDrill: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/disaster-recovery/drills')
    return response.data
  },
  
  handleFailover: async (region: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/disaster-recovery/failover', { region })
    return response.data
  }
}
