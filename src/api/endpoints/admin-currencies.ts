import apiClient from '../client'
import type { ApiResponse, Currency } from '../types'

function normalizeCurrency(item: Record<string, unknown>): Currency {
  const c = item as Record<string, unknown>
  return {
    id: c.id as string | undefined,
    code: c.code as string,
    name: c.name as string,
    symbol: c.symbol as string,
    exchangeRate: c.exchangeRate != null ? Number(c.exchangeRate) : undefined,
    rate: c.exchangeRate != null ? Number(c.exchangeRate) : (c.rate != null ? Number(c.rate) : undefined),
    isActive: c.isActive as boolean | undefined,
    isDefault: c.isDefault as boolean | undefined,
    updatedAt: c.updatedAt as string | undefined
  }
}

export interface CreateCurrencyBody {
  code: string
  name: string
  symbol: string
  exchangeRate?: number
  isDefault?: boolean
  isActive?: boolean
}

export interface UpdateCurrencyBody {
  name?: string
  symbol?: string
  exchangeRate?: number
  isDefault?: boolean
  isActive?: boolean
}

export const adminCurrenciesApi = {
  list: async (activeOnly?: boolean): Promise<ApiResponse<Currency[]>> => {
    const response = await apiClient.get('/admin/currencies', {
      params: activeOnly !== undefined ? { activeOnly: String(activeOnly) } : undefined
    })
    if (response.data.success && Array.isArray((response.data as { data?: unknown[] }).data)) {
      ;(response.data as ApiResponse<Currency[]>).data = ((response.data as ApiResponse<Currency[]>).data ?? []).map(
        (item) => normalizeCurrency(item as Record<string, unknown>)
      )
    }
    return response.data as ApiResponse<Currency[]>
  },

  getByCode: async (code: string): Promise<ApiResponse<Currency>> => {
    const response = await apiClient.get(`/admin/currencies/${code}`)
    if (response.data.success && (response.data as ApiResponse<Currency>).data) {
      ;(response.data as ApiResponse<Currency>).data = normalizeCurrency(
        (response.data as ApiResponse<Currency>).data as Record<string, unknown>
      )
    }
    return response.data as ApiResponse<Currency>
  },

  create: async (body: CreateCurrencyBody): Promise<ApiResponse<Currency>> => {
    const response = await apiClient.post('/admin/currencies', body)
    if (response.data.success && (response.data as ApiResponse<Currency>).data) {
      ;(response.data as ApiResponse<Currency>).data = normalizeCurrency(
        (response.data as ApiResponse<Currency>).data as Record<string, unknown>
      )
    }
    return response.data as ApiResponse<Currency>
  },

  update: async (code: string, body: UpdateCurrencyBody): Promise<ApiResponse<Currency>> => {
    const response = await apiClient.put(`/admin/currencies/${code}`, body)
    if (response.data.success && (response.data as ApiResponse<Currency>).data) {
      ;(response.data as ApiResponse<Currency>).data = normalizeCurrency(
        (response.data as ApiResponse<Currency>).data as Record<string, unknown>
      )
    }
    return response.data as ApiResponse<Currency>
  },

  deactivate: async (code: string): Promise<ApiResponse<{ message?: string }>> => {
    const response = await apiClient.delete(`/admin/currencies/${code}`)
    return response.data as ApiResponse<{ message?: string }>
  }
}
