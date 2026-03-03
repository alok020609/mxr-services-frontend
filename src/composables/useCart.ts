import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { cartApi } from '@/api/endpoints/cart'
import { useUIStore } from '@/stores/ui'
import type { AddToCartRequest } from '@/api/types'
import type { AxiosError } from 'axios'

export const useCart = () => {
  const cartStore = useCartStore()
  const uiStore = useUIStore()

  const cart = computed(() => cartStore.cart)
  const itemCount = computed(() => {
    return (cart.value?.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
  })
  const total = computed(() => cart.value?.total || 0)
  const isLoading = computed(() => cartStore.isLoading)

  const loadCart = async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      cartStore.setLoading(true)
    }
    try {
      const response = await cartApi.getCart()
      if (response.success && response.data) {
        cartStore.setCart(response.data)
      } else if (response.error) {
        uiStore.showApiError({ response: { status: 400 } } as AxiosError, response.error)
      }
    } catch (error) {
      const axiosError = error as AxiosError
      uiStore.showApiError(axiosError)
    } finally {
      if (!options?.silent) {
        cartStore.setLoading(false)
      }
    }
  }

  const addToCart = async (item: AddToCartRequest) => {
    cartStore.setLoading(true)
    try {
      const response = await cartApi.addItem(item)
      if (response.success) {
        const hasItems = Array.isArray(response.data?.items) && response.data.items.length > 0
        if (hasItems) {
          cartStore.setCart(response.data!)
        } else {
          const getRes = await cartApi.getCart()
          if (getRes.success && getRes.data) cartStore.setCart(getRes.data)
        }
        uiStore.showNotification('success', item.serviceId ? 'Service added to cart!' : 'Product added to cart!')
        return { success: true }
      }
      if (response.error) {
        uiStore.showApiError({ response: { status: 400 } } as AxiosError, response.error)
      }
      return { success: false }
    } catch (error: any) {
      const axiosError = error as AxiosError
      uiStore.showApiError(axiosError)
      return { success: false }
    } finally {
      cartStore.setLoading(false)
    }
  }

  /**
   * Add a service to cart or update its quantity if already in cart (one line per service).
   * Returns { success, updated } where updated is true when an existing line was updated.
   */
  const addOrUpdateServiceInCart = async (
    serviceId: string,
    quantity: number
  ): Promise<{ success: boolean; updated?: boolean }> => {
    const existing = (cart.value?.items ?? []).find((i) => i.serviceId === serviceId)
    if (existing) {
      await updateItem(existing.id, Math.max(1, quantity))
      uiStore.showNotification('success', 'Service quantity updated')
      return { success: true, updated: true }
    }
    const result = await addToCart({ serviceId, quantity: Math.max(1, quantity) })
    return { success: !!result?.success, updated: false }
  }

  const updateItem = async (itemId: string, quantity: number) => {
    // Optimistic update: apply new quantity locally first so the cart row never disappears
    if (cart.value) {
      cartStore.updateItem(itemId, quantity)
    }
    try {
      const response = await cartApi.updateItem(itemId, quantity)
      if (response.success) {
        const serverCart = response.data
        const serverHasItems = Array.isArray(serverCart?.items) && serverCart.items.length > 0
        const currentHasItems = (cart.value?.items?.length ?? 0) > 0
        // Only accept server cart if it has items, or we currently have no items (avoid overwriting with empty)
        if (serverCart && (serverHasItems || !currentHasItems)) {
          cartStore.setCart(serverCart)
        }
      } else {
        if (response.error) {
          uiStore.showApiError({ response: { status: 400 } } as AxiosError, response.error)
        }
        await loadCart({ silent: true })
      }
    } catch (error) {
      const axiosError = error as AxiosError
      uiStore.showApiError(axiosError)
      await loadCart({ silent: true })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const response = await cartApi.removeItem(itemId)
      if (response.success) {
        if (response.data) {
          cartStore.setCart(response.data)
        } else {
          // Backend may return success without cart body; refetch to sync UI (silent = no full-page loading)
          await loadCart({ silent: true })
        }
        uiStore.showNotification('success', 'Item removed from cart')
      } else if (response.error) {
        uiStore.showApiError({ response: { status: 400 } } as AxiosError, response.error)
      }
    } catch (error) {
      const axiosError = error as AxiosError
      uiStore.showApiError(axiosError)
    }
  }

  const clearCart = async () => {
    try {
      const response = await cartApi.clearCart()
      if (response.success) {
        cartStore.clearCart()
        uiStore.showNotification('success', 'Cart cleared')
      } else if (response.error) {
        uiStore.showApiError({ response: { status: 400 } } as AxiosError, response.error)
      }
    } catch (error) {
      const axiosError = error as AxiosError
      uiStore.showApiError(axiosError)
    }
  }

  const calculateCart = async () => {
    cartStore.setLoading(true)
    try {
      const response = await cartApi.calculate()
      if (response.success && response.data) {
        const serverCart = response.data
        const serverHasItems = Array.isArray(serverCart?.items) && serverCart.items.length > 0
        const currentHasItems = (cart.value?.items?.length ?? 0) > 0
        if (serverHasItems || !currentHasItems) {
          cartStore.setCart(serverCart)
          uiStore.showNotification('success', 'Cart totals recalculated')
        }
        return { success: true }
      } else if (response.error) {
        uiStore.showApiError({ response: { status: 400 } } as AxiosError, response.error)
      }
      return { success: false }
    } catch (error) {
      const axiosError = error as AxiosError
      uiStore.showApiError(axiosError)
      return { success: false }
    } finally {
      cartStore.setLoading(false)
    }
  }

  return {
    cart,
    itemCount,
    total,
    isLoading,
    loadCart,
    addToCart,
    addOrUpdateServiceInCart,
    updateItem,
    removeItem,
    clearCart,
    calculateCart
  }
}

