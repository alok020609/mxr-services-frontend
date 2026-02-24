import apiClient from '../client'
import type { Service, ServiceType, ApiResponse } from '../types'

export interface AdminServicesListParams {
  page?: number
  limit?: number
  type?: ServiceType
  productId?: string
  categoryId?: string
  isActive?: 'true' | 'false'
}

export interface AdminServiceCreatePayload {
  name: string
  price: number
  type: ServiceType
  slug?: string
  description?: string
  productId?: string | null
  categoryId?: string | null
  durationMinutes?: number
  isActive?: boolean
  image?: string | null
  metadata?: Record<string, unknown>
}

export interface AdminServicesListResponse {
  success: boolean
  data: Service[]
  pagination: { page: number; limit: number; total: number; pages: number }
}

export const adminServicesApi = {
  list: async (
    params?: AdminServicesListParams
  ): Promise<ApiResponse<Service[]> & { pagination?: AdminServicesListResponse['pagination'] }> => {
    const query: Record<string, string | number | undefined> = {}
    if (params?.page != null) query.page = params.page
    if (params?.limit != null) query.limit = params.limit
    if (params?.type) query.type = params.type
    if (params?.productId) query.productId = params.productId
    if (params?.categoryId) query.categoryId = params.categoryId
    if (params?.isActive !== undefined) query.isActive = params.isActive
    const response = await apiClient.get('/admin/services', { params: query })
    const body = response.data as AdminServicesListResponse
    return {
      success: body.success !== false,
      data: Array.isArray(body.data) ? body.data : [],
      pagination: body.pagination,
      error: (body as { error?: string }).error
    }
  },

  get: async (id: string): Promise<ApiResponse<Service>> => {
    const response = await apiClient.get(`/admin/services/${id}`)
    const body = response.data as { success?: boolean; data?: Service; error?: string }
    return {
      success: body.success !== false,
      data: body.data,
      error: body.error
    }
  },

  create: async (data: AdminServiceCreatePayload): Promise<ApiResponse<Service>> => {
    const response = await apiClient.post('/admin/services', data)
    const body = response.data as { success?: boolean; data?: Service; error?: string }
    return {
      success: body.success !== false,
      data: body.data,
      error: body.error
    }
  },

  update: async (
    id: string,
    data: Partial<AdminServiceCreatePayload>
  ): Promise<ApiResponse<Service>> => {
    const response = await apiClient.put(`/admin/services/${id}`, data)
    const body = response.data as { success?: boolean; data?: Service; error?: string }
    return {
      success: body.success !== false,
      data: body.data,
      error: body.error
    }
  },

  delete: async (id: string): Promise<ApiResponse<{ message?: string }>> => {
    const response = await apiClient.delete(`/admin/services/${id}`)
    const body = response.data as { success?: boolean; message?: string; error?: string }
    return {
      success: body.success !== false,
      data: body.message != null ? { message: body.message } : undefined,
      error: body.error
    }
  }
}
