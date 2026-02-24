import apiClient from '../client'
import type { ApiResponse } from '../types'

export interface WalletBalance {
  balance: number
  currency: string
  pendingBalance?: number
  availableBalance: number
}

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  description: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

export interface StoreCredit {
  id: string
  amount: number
  currency: string
  balance: number
  expiresAt?: string
  source: string
  createdAt: string
}

export interface Invoice {
  id: string
  orderId?: string
  invoiceNumber: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  issueDate: string
  dueDate?: string
  items: Array<{
    description: string
    quantity: number
    price: number
  }>
}

export const walletApi = {
  getWalletBalance: async (): Promise<ApiResponse<WalletBalance>> => {
    const response = await apiClient.get('/wallet')
    return response.data
  },
  
  addFunds: async (amount: number, paymentMethod: string): Promise<ApiResponse<WalletTransaction>> => {
    const response = await apiClient.post('/wallet/add', { amount, paymentMethod })
    return response.data
  },
  
  getStoreCredits: async (): Promise<ApiResponse<StoreCredit[]>> => {
    const response = await apiClient.get('/wallet/store-credits')
    return response.data
  },
  
  getInvoices: async (): Promise<ApiResponse<Invoice[]>> => {
    const response = await apiClient.get('/wallet/invoices')
    return response.data
  },
  
  getInvoice: async (id: string): Promise<ApiResponse<Invoice>> => {
    const response = await apiClient.get(`/wallet/invoices/${id}`)
    return response.data
  },
  
  downloadInvoice: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/wallet/invoices/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  }
}
