// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'MXR Services'

export const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en'

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
] as const

export const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed',
  'refunded'
] as const

export const USER_ROLES = [
  'user',
  'admin',
  'vendor'
] as const

export const PRODUCT_STATUSES = [
  'active',
  'inactive',
  'draft'
] as const

export const PAGINATION_DEFAULT = {
  page: 1,
  limit: 20
}

export const CART_STORAGE_KEY = 'cart-storage'
export const AUTH_STORAGE_KEY = 'auth-storage'
export const CONFIG_STORAGE_KEY = 'config-storage'

