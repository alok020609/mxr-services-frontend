import type { CartItem } from '@/api/types'

export type ServiceScope = {
  productId?: string | null
  categoryId?: string | null
}

/**
 * Derives the service quantity from cart items based on the service's product/category scope.
 * - If service.productId is set: sum of quantities of cart items with that productId.
 * - Else if service.categoryId is set: sum of quantities of product items in that category.
 *   (Cart product items must include product.categoryId or product.category.id for this to work.)
 * - Else (standalone): returns null; caller should use 1 or user input.
 */
export function getDerivedServiceQuantity(
  cartItems: CartItem[],
  service: ServiceScope
): number | null {
  if (!cartItems?.length) return service.productId != null || service.categoryId != null ? 0 : null

  if (service.productId != null && service.productId !== '') {
    const sum = cartItems
      .filter((item) => item.productId === service.productId)
      .reduce((acc, item) => acc + (item.quantity ?? 0), 0)
    return sum
  }

  if (service.categoryId != null && service.categoryId !== '') {
    const sum = cartItems
      .filter((item) => {
        if (!item.productId || !item.product) return false
        const catId = item.product.categoryId ?? (item.product as { category?: { id?: string } }).category?.id
        return catId === service.categoryId
      })
      .reduce((acc, item) => acc + (item.quantity ?? 0), 0)
    return sum
  }

  return null
}

/**
 * Whether the service has a product or category scope (quantity is derived, not user-chosen).
 */
export function isScopedService(service: ServiceScope): boolean {
  return (
    (service.productId != null && service.productId !== '') ||
    (service.categoryId != null && service.categoryId !== '')
  )
}
