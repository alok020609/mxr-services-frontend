import apiClient from '../client'
import type { Cart, CartItem, AddToCartRequest, ApiResponse, Service } from '../types'

function parsePrice(value: unknown): number {
  if (value == null) return 0
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  const n = Number(value)
  return Number.isNaN(n) ? 0 : n
}

function normalizeCartItem(raw: Record<string, unknown>): CartItem {
  const qty = Number(raw?.quantity ?? 0) || 0
  const variant = raw?.variant as CartItem['variant'] | undefined
  const product = raw?.product as CartItem['product'] | undefined
  const service = raw?.service as Service | undefined
  const priceFromVariant = variant != null && typeof variant === 'object' ? parsePrice((variant as { price?: unknown }).price) : 0
  const priceFromProduct = product != null && typeof product === 'object' ? parsePrice((product as { price?: unknown }).price) : 0
  const priceFromService = service != null && typeof service === 'object' && service.price != null
    ? parsePrice(service.price)
    : 0
  const price = parsePrice(raw?.price ?? raw?.unitPrice)
    || priceFromVariant
    || priceFromProduct
    || priceFromService
  const subtotal = Number(
    raw?.subtotal ?? raw?.itemTotal ?? raw?.lineTotal ?? (price * qty)
  ) || 0
  return {
    id: String(raw?.id ?? ''),
    productId: raw?.productId != null ? String(raw.productId) : undefined,
    variantId: raw?.variantId != null ? String(raw.variantId) : undefined,
    serviceId: raw?.serviceId != null ? String(raw.serviceId) : undefined,
    product: product ?? undefined,
    variant: variant ?? undefined,
    service: service ?? undefined,
    quantity: qty,
    price,
    subtotal
  }
}

function normalizeCart(data: Record<string, unknown> | null | undefined): Cart {
  if (!data || typeof data !== 'object') {
    return {
      id: '',
      userId: '',
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      updatedAt: new Date().toISOString()
    }
  }
  const rawItems = Array.isArray(data.items) ? data.items : []
  const items: CartItem[] = rawItems.map((item: unknown) =>
    normalizeCartItem(typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {})
  )
  const subtotal = Number(data.subtotal) || 0
  const tax = Number(data.tax) || 0
  const shipping = Number(data.shipping) || 0
  const discount = Number(data.discount) || 0
  const total = Number(data.total) ?? (subtotal + tax + shipping - discount)
  return {
    id: String(data.id ?? ''),
    userId: String(data.userId ?? ''),
    items,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    updatedAt: String(data.updatedAt ?? new Date().toISOString())
  }
}

/** Extract cart payload from response body (handles both { data } and { cart } and raw cart). */
function extractCartPayload(body: Record<string, unknown> | null | undefined): Record<string, unknown> | null | undefined {
  if (!body || typeof body !== 'object') return body
  const cart = body.data ?? body.cart ?? body
  return cart != null && typeof cart === 'object' ? (cart as Record<string, unknown>) : undefined
}

function toCartResponse(body: Record<string, unknown> | null | undefined): ApiResponse<Cart> {
  const payload = extractCartPayload(body ?? undefined)
  const success = (body as { success?: boolean })?.success !== false
  const error = (body as { error?: string })?.error
  const data = payload != null ? normalizeCart(payload) : undefined
  return { success, data, error } as ApiResponse<Cart>
}

export const cartApi = {
  // Get cart
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.get('/cart/')
    return toCartResponse((response.data as Record<string, unknown>) ?? undefined)
  },

  // Add item to cart
  addItem: async (item: AddToCartRequest): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.post('/cart/add', item)
    return toCartResponse((response.data as Record<string, unknown>) ?? undefined)
  },

  // Update cart item
  updateItem: async (itemId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.put(`/cart/update/${itemId}`, { quantity })
    return toCartResponse((response.data as Record<string, unknown>) ?? undefined)
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.delete(`/cart/remove/${itemId}`)
    return toCartResponse((response.data as Record<string, unknown>) ?? undefined)
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse> => {
    const response = await apiClient.delete('/cart/clear')
    return response.data
  },

  // Calculate cart totals
  calculate: async (): Promise<ApiResponse<Cart>> => {
    const response = await apiClient.get('/cart/calculate')
    return toCartResponse((response.data as Record<string, unknown>) ?? undefined)
  }
}

