import apiClient from '../client'
import type { ApiResponse, Tenant, TenantStats, PaginatedResponse } from '../types'

export const tenantsApi = {
  createTenant: async (tenant: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    const response = await apiClient.post('/tenants', tenant)
    return response.data
  },
  
  listTenants: async (filters?: any): Promise<ApiResponse<PaginatedResponse<Tenant>>> => {
    const response = await apiClient.get('/tenants', { params: filters })
    return response.data
  },
  
  getTenant: async (tenantId: string): Promise<ApiResponse<Tenant>> => {
    const response = await apiClient.get(`/tenants/${tenantId}`)
    return response.data
  },
  
  updateTenant: async (tenantId: string, tenant: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    const response = await apiClient.put(`/tenants/${tenantId}`, tenant)
    return response.data
  },
  
  getTenantStats: async (tenantId: string): Promise<ApiResponse<TenantStats>> => {
    const response = await apiClient.get(`/tenants/${tenantId}/stats`)
    return response.data
  }
}
