import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface PackageSelectionPayload {
  category: string
  name: string
  price: string
  isPopular: boolean
  features: string[]
}

// Only the selection endpoint is wired for now.
// Backend handles lead saving + emailing.
export const packagesApi = {
  selectPackage: async (
    payload: PackageSelectionPayload
  ): Promise<ApiResponse<{ id: string; createdAt: string }>> => {
    const response = await apiClient.post('/packages/selection', payload)
    return response.data as ApiResponse<{ id: string; createdAt: string }>
  }
}

