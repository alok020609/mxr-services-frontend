import apiClient from '../client'
import type { ApiResponse, Currency, CurrencyConversion } from '../types'

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

export const currenciesApi = {
  getCurrencies: async (): Promise<ApiResponse<Currency[]>> => {
    const response = await apiClient.get('/currencies/')
    if (response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(normalizeCurrency)
    }
    return response.data
  },

  getDefault: async (): Promise<ApiResponse<Currency>> => {
    const response = await apiClient.get('/currencies/default')
    if (response.data.success && response.data.data) {
      response.data.data = normalizeCurrency(response.data.data as Record<string, unknown>)
    }
    return response.data
  },

  getCurrency: async (code: string): Promise<ApiResponse<Currency>> => {
    const response = await apiClient.get(`/currencies/${code}`)
    if (response.data.success && response.data.data) {
      response.data.data = normalizeCurrency(response.data.data as Record<string, unknown>)
    }
    return response.data
  },

  convert: async (amount: number, from: string, to: string): Promise<ApiResponse<CurrencyConversion>> => {
    const response = await apiClient.get('/currencies/convert', { params: { amount, from, to } })
    const data = response.data as { success: boolean; data?: { from?: { code: string; amount: number }; to?: { code: string; amount: number }; rate?: number }; error?: string }
    if (data.success && data.data) {
      const fromData = data.data.from ?? { code: from, amount }
      const toData = data.data.to ?? { code: to, amount: amount }
      const rate = data.data.rate ?? 1
      ;(response.data as ApiResponse<CurrencyConversion>).data = {
        amount: fromData.amount,
        rate,
        fromCurrency: fromData.code,
        toCurrency: toData.code,
        convertedAmount: toData.amount
      }
    }
    return response.data as ApiResponse<CurrencyConversion>
  },

  updateRates: async (rates: Record<string, number>): Promise<ApiResponse> => {
    const response = await apiClient.put('/currencies/rates', { rates })
    return response.data
  }
}

