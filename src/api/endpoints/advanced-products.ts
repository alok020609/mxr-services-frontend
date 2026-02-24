import apiClient from '../client'
import type {
  ApiResponse,
  DigitalProduct,
  Subscription,
  CreateSubscriptionRequest,
  PreOrder,
  CreatePreOrderRequest,
  GiftCard,
  PurchaseGiftCardRequest,
  RedeemGiftCardRequest
} from '../types'

export const advancedProductsApi = {
  getDigitalProduct: async (productId: string): Promise<ApiResponse<DigitalProduct>> => {
    const response = await apiClient.get(`/advanced-products/digital/${productId}`)
    return response.data
  },
  
  downloadDigitalProduct: async (productId: string, orderId: string): Promise<Blob> => {
    const response = await apiClient.get(`/advanced-products/digital/${productId}/download/${orderId}`, {
      responseType: 'blob'
    })
    return response.data
  },
  
  getSubscriptions: async (): Promise<ApiResponse<Subscription[]>> => {
    const response = await apiClient.get('/advanced-products/subscriptions')
    return response.data
  },
  
  createSubscription: async (subscription: CreateSubscriptionRequest): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post('/advanced-products/subscriptions', subscription)
    return response.data
  },
  
  createPreOrder: async (preOrder: CreatePreOrderRequest): Promise<ApiResponse<PreOrder>> => {
    const response = await apiClient.post('/advanced-products/pre-orders', preOrder)
    return response.data
  },
  
  getPreOrders: async (): Promise<ApiResponse<PreOrder[]>> => {
    const response = await apiClient.get('/advanced-products/pre-orders')
    return response.data
  },
  
  getGiftCards: async (): Promise<ApiResponse<GiftCard[]>> => {
    const response = await apiClient.get('/advanced-products/gift-cards')
    return response.data
  },
  
  purchaseGiftCard: async (request: PurchaseGiftCardRequest): Promise<ApiResponse<GiftCard>> => {
    const response = await apiClient.post('/advanced-products/gift-cards/purchase', request)
    return response.data
  },
  
  redeemGiftCard: async (request: RedeemGiftCardRequest): Promise<ApiResponse<{ amount: number; balance?: number }>> => {
    const response = await apiClient.post('/advanced-products/gift-cards/redeem', request)
    return response.data
  }
}

