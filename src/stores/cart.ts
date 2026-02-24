import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Cart, CartItem } from '@/api/types'

function ensureCartItemShape(item: CartItem): CartItem {
  const variantPrice = item?.variant != null && typeof item.variant === 'object' ? Number((item.variant as { price?: number }).price) : 0
  const productPrice = item?.product != null ? Number(item.product.price) : 0
  const servicePrice = item?.service != null ? Number(item.service.price) : 0
  const price = Number(item?.price) || variantPrice || productPrice || servicePrice || 0
  const quantity = Number(item?.quantity ?? 0) || 0
  const subtotal = Number(item?.subtotal ?? price * quantity) || 0
  return {
    ...item,
    id: item?.id ?? '',
    productId: item?.productId,
    variantId: item?.variantId,
    serviceId: item?.serviceId,
    product: item?.product,
    variant: item?.variant,
    service: item?.service,
    quantity,
    price,
    subtotal
  }
}

export const useCartStore = defineStore('cart', () => {
  // State
  const cart = ref<Cart | null>(null)
  const isLoading = ref<boolean>(false)

  // Actions
  function setCart(cartData: Cart) {
    const items = Array.isArray(cartData?.items) ? cartData.items : []
    const normalizedItems = items.map(ensureCartItemShape)
    cart.value = {
      ...cartData,
      items: normalizedItems,
      subtotal: Number(cartData?.subtotal) || 0,
      tax: Number(cartData?.tax) || 0,
      shipping: Number(cartData?.shipping) || 0,
      discount: Number(cartData?.discount) || 0,
      total: Number(cartData?.total) ?? 0,
      updatedAt: cartData?.updatedAt ?? new Date().toISOString()
    }
  }

  function addItem(item: CartItem) {
    if (!cart.value) {
      cart.value = {
        id: '',
        userId: '',
        items: [item],
        subtotal: item.subtotal,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: item.subtotal,
        updatedAt: new Date().toISOString(),
      }
      return
    }

    const items = cart.value.items ?? []
    const existingItemIndex = items.findIndex((i) =>
      item.serviceId
        ? i.serviceId === item.serviceId
        : (i.productId === item.productId && (i.variantId ?? '') === (item.variantId ?? ''))
    )

    let updatedItems: CartItem[]
    if (existingItemIndex >= 0) {
      updatedItems = [...items]
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        subtotal: updatedItems[existingItemIndex].price * (updatedItems[existingItemIndex].quantity + item.quantity),
      }
    } else {
      updatedItems = [...items, item]
    }

    const subtotal = updatedItems.reduce((sum, i) => sum + i.subtotal, 0)

    cart.value = {
      ...cart.value,
      items: updatedItems,
      subtotal,
      total: subtotal + cart.value.tax + cart.value.shipping - cart.value.discount,
      updatedAt: new Date().toISOString(),
    }
  }

  function updateItem(itemId: string, quantity: number) {
    if (!cart.value) return

    const updatedItems = (cart.value.items ?? []).map((item) =>
      item.id === itemId
        ? { ...item, quantity, subtotal: item.price * quantity }
        : item
    )

    const subtotal = updatedItems.reduce((sum, i) => sum + i.subtotal, 0)

    cart.value = {
      ...cart.value,
      items: updatedItems,
      subtotal,
      total: subtotal + cart.value.tax + cart.value.shipping - cart.value.discount,
      updatedAt: new Date().toISOString(),
    }
  }

  function removeItem(itemId: string) {
    if (!cart.value) return

    const updatedItems = (cart.value.items ?? []).filter((item) => item.id !== itemId)
    const subtotal = updatedItems.reduce((sum, i) => sum + i.subtotal, 0)

    cart.value = {
      ...cart.value,
      items: updatedItems,
      subtotal,
      total: subtotal + cart.value.tax + cart.value.shipping - cart.value.discount,
      updatedAt: new Date().toISOString(),
    }
  }

  function clearCart() {
    cart.value = null
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  return {
    // State
    cart,
    isLoading,
    // Actions
    setCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    setLoading,
  }
}, {
  persist: {
    key: 'cart-storage',
  },
})
