import apiClient from '../client'
import type { Service, ApiResponse } from '../types'

export interface GetServicesParams {
  page?: number
  limit?: number
  type?: 'CONSULTING' | 'REPAIR' | 'INSTALLATION'
  productId?: string
  categoryId?: string
  isActive?: boolean
}

export interface ServicesListResponse {
  success: boolean
  data: Service[]
  pagination: { page: number; limit: number; total: number; pages: number }
  error?: string
}

export const servicesApi = {
  getServices: async (params?: GetServicesParams): Promise<ApiResponse<Service[]> & { pagination?: ServicesListResponse['pagination'] }> => {
    const query: Record<string, string | number | boolean | undefined> = {}
    if (params?.page != null) query.page = params.page
    if (params?.limit != null) query.limit = params.limit
    if (params?.type) query.type = params.type
    if (params?.productId) query.productId = params.productId
    if (params?.categoryId) query.categoryId = params.categoryId
    if (params?.isActive !== undefined) query.isActive = params.isActive
    const response = await apiClient.get('/services', { params: query })
    const body = response.data as ServicesListResponse
    return {
      success: body.success !== false,
      data: Array.isArray(body.data) ? body.data : [],
      pagination: body.pagination,
      error: body.error
    }
  },

  getService: async (id: string): Promise<ApiResponse<Service>> => {
    const response = await apiClient.get(`/services/${id}`)
    const body = response.data as { success?: boolean; data?: Service; error?: string }
    return {
      success: body.success !== false,
      data: body.data,
      error: body.error
    }
  }
}
