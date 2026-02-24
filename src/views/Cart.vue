<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="!cart || cart.items.length === 0" class="text-center py-12">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-600 mb-4 text-lg">Your cart is empty</p>
        <router-link to="/products" class="btn btn-primary inline-flex items-center">
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Continue Shopping
        </router-link>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-4 pb-4 border-b flex-wrap gap-2">
              <h2 class="text-xl font-bold">Cart Items ({{ itemCount }})</h2>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="text-sm text-gray-600 hover:text-gray-900 underline"
                  @click="selectAll"
                >
                  Select all
                </button>
                <button
                  type="button"
                  class="text-sm text-gray-600 hover:text-gray-900 underline"
                  @click="deselectAll"
                >
                  Deselect all
                </button>
              </div>
              <button
                @click="handleClearCart"
                :disabled="isLoading"
                class="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {{ showClearConfirm ? 'Confirm Clear' : 'Clear Cart' }}
              </button>
            </div>
            
            <div class="space-y-4">
              <div
                v-for="item in cart.items"
                :key="item.id"
                class="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4 last:border-b-0"
              >
                <label class="flex items-center gap-2 cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    :checked="selectedItemIds.includes(item.id)"
                    :disabled="isPreparingCheckout"
                    class="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                    @change="toggleSelection(item.id)"
                  />
                  <span class="sr-only">Select for checkout</span>
                </label>
                <img
                  v-if="item.product"
                  :src="item.product?.images?.[0] || '/placeholder.jpg'"
                  :alt="item.product?.name"
                  class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <img
                  v-else-if="item.service"
                  :src="item.service?.image || '/placeholder.jpg'"
                  :alt="item.service?.name"
                  class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  @error="($event.target as HTMLImageElement).src = '/placeholder.jpg'"
                />
                <div
                  v-else
                  class="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center"
                  title="Item"
                >
                  <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-lg mb-1 truncate">
                    {{ item.product?.name || item.service?.name || 'Item' }}
                  </h3>
                  <p v-if="item.service" class="text-xs text-gray-500 mb-1">
                    {{ item.service.type }}{{ item.service.category ? ` (${item.service.category.name})` : '' }}
                  </p>
                  <p class="text-gray-600 mb-2">{{ formatPrice(item.price) }}</p>
                  <div v-if="item.service && isScopedService(item.service)" class="flex items-center gap-2">
                    <span class="text-sm text-gray-700">Quantity: {{ getDerivedQtyForItem(item) }} (from cart)</span>
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <button
                      @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                      :disabled="isLoading || item.quantity <= 1"
                      class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      :value="item.quantity"
                      @change="handleQuantityInput(item.id, $event)"
                      min="1"
                      :max="item.product?.stock ?? 999"
                      class="w-16 text-center border rounded px-2 py-1"
                      :disabled="isLoading"
                    />
                    <button
                      @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                      :disabled="isLoading || (item.product?.stock != null && item.quantity >= item.product.stock)"
                      class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                    <span v-if="item.product?.stock != null" class="text-xs text-gray-500 ml-2">
                      ({{ item.product.stock }} available)
                    </span>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="font-semibold text-lg mb-2">{{ formatPrice(item.subtotal) }}</p>
                  <button
                    @click="handleRemoveItem(item.id)"
                    :disabled="isLoading"
                    class="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-1">
          <div class="card sticky top-4">
            <h2 class="text-xl font-bold mb-4">Order Summary</h2>
            <p v-if="selectedCount < itemCount" class="text-sm text-gray-600 mb-2">
              {{ selectedCount }} of {{ itemCount }} items selected for checkout. Unselected items will remain in your cart.
            </p>
            
            <!-- Coupon Input -->
            <div class="mb-4 pb-4 border-b">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Have a coupon code?</h3>
              <CouponInput
                v-model="appliedCoupon"
                :cart-total="selectionSubtotal"
                @applied="handleCouponApplied"
                @removed="handleCouponRemoved"
              />
            </div>
            
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal{{ selectedCount < itemCount ? ' (selected)' : '' }}</span>
                <span class="font-semibold">{{ formatPrice(selectionSubtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax</span>
                <span class="font-semibold">{{ formatPrice(cart.tax) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Shipping</span>
                <span class="font-semibold">{{ formatPrice(cart.shipping) }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span class="font-semibold">-{{ formatPrice(couponDiscount) }}</span>
              </div>
              <div v-if="cart.discount > 0" class="flex justify-between text-green-600">
                <span>Discount</span>
                <span class="font-semibold">-{{ formatPrice(cart.discount) }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg pt-4 border-t">
                <span>Total</span>
                <span>{{ formatPrice(selectionSubtotal + cart.tax + cart.shipping - cart.discount - couponDiscount) }}</span>
              </div>
            </div>
            
            <div class="space-y-3">
              <button
                type="button"
                @click="handleCalculateCart"
                :disabled="isLoading || isPreparingCheckout"
                class="w-full btn btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Recalculate Totals
              </button>
              <button
                type="button"
                :disabled="isLoading || isPreparingCheckout || selectedCount === 0"
                class="btn btn-primary w-full text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleProceedToCheckout"
              >
                <svg v-if="!isPreparingCheckout" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <LoadingSpinner v-else size="sm" />
                {{ isPreparingCheckout ? 'Preparing checkout...' : selectedCount === itemCount ? 'Proceed to Checkout' : `Proceed with selected (${selectedCount})` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Clear Cart Confirmation Modal -->
    <div
      v-if="showClearConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showClearConfirm = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Clear Cart?</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to remove all items from your cart? This action cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showClearConfirm = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleClearCart"
            :disabled="isLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading ? 'Clearing...' : 'Clear Cart' }}
          </button>
        </div>
      </div>
    </div>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { getDerivedServiceQuantity, isScopedService } from '@/composables/useServiceQuantity'
import { useUIStore } from '@/stores/ui'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import CouponInput from '@/components/coupons/CouponInput.vue'
import type { Coupon } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const router = useRouter()
const {
  cart,
  itemCount,
  isLoading,
  loadCart,
  updateItem,
  removeItem,
  clearCart,
  calculateCart
} = useCart()

const uiStore = useUIStore()
const sidebarOpen = ref(false)
const showClearConfirm = ref(false)
const appliedCoupon = ref<Coupon | null>(null)
const couponDiscount = ref(0)
const selectedItemIds = ref<string[]>([])
const isPreparingCheckout = ref(false)

const itemIds = computed(() => (cart.value?.items ?? []).map((i) => i.id))

watch(
  itemIds,
  (ids) => {
    if (ids.length === 0) {
      selectedItemIds.value = []
      return
    }
    const set = new Set(ids)
    selectedItemIds.value = selectedItemIds.value.filter((id) => set.has(id))
    if (selectedItemIds.value.length === 0) selectedItemIds.value = [...ids]
  },
  { immediate: true }
)

const selectedItems = computed(() =>
  (cart.value?.items ?? []).filter((i) => selectedItemIds.value.includes(i.id))
)

function getDerivedQtyForItem(item: { service?: { productId?: string | null; categoryId?: string | null } | null }): number {
  if (!item.service) return 0
  const items = cart.value?.items ?? []
  const d = getDerivedServiceQuantity(items, item.service)
  return d !== null ? Math.max(0, d) : 0
}
/** Selected item count as total quantity (same basis as itemCount), not number of product lines */
const selectedCount = computed(() =>
  selectedItems.value.reduce((sum, i) => sum + i.quantity, 0)
)
const selectionSubtotal = computed(() =>
  selectedItems.value.reduce((sum, i) => sum + i.subtotal, 0)
)

function toggleSelection(itemId: string) {
  const idx = selectedItemIds.value.indexOf(itemId)
  if (idx === -1) selectedItemIds.value = [...selectedItemIds.value, itemId]
  else selectedItemIds.value = selectedItemIds.value.filter((id) => id !== itemId)
}

function selectAll() {
  selectedItemIds.value = [...(cart.value?.items ?? []).map((i) => i.id)]
}

function deselectAll() {
  selectedItemIds.value = []
}

async function handleProceedToCheckout() {
  if (selectedCount.value === 0) {
    uiStore.showNotification('warning', 'Select at least one item to checkout')
    return
  }
  const items = cart.value?.items ?? []
  const toRemove = items.filter((i) => !selectedItemIds.value.includes(i.id))
  if (toRemove.length === 0) {
    router.push({ name: 'Checkout' })
    return
  }
  isPreparingCheckout.value = true
  try {
    for (const item of toRemove) {
      await removeItem(item.id)
    }
    router.push({ name: 'Checkout' })
  } catch {
    uiStore.showNotification('error', 'Could not prepare checkout. Please try again.')
  } finally {
    isPreparingCheckout.value = false
  }
}

async function syncScopedServiceQuantities() {
  const items = cart.value?.items ?? []
  for (const item of items) {
    if (!item.serviceId || !item.service || !isScopedService(item.service)) continue
    const derived = getDerivedServiceQuantity(items, item.service)
    if (derived === null) continue
    if (derived === 0) {
      await removeItem(item.id)
      continue
    }
    if (item.quantity !== derived) {
      await updateItem(item.id, Math.max(1, derived))
    }
  }
}

onMounted(async () => {
  await loadCart()
  await syncScopedServiceQuantities()
})

const handleUpdateQuantity = async (itemId: string, quantity: number) => {
  if (quantity < 1) {
    uiStore.showNotification('warning', 'Quantity must be at least 1')
    return
  }

  const item = cart.value?.items.find(i => i.id === itemId)
  if (item?.product?.stock && quantity > item.product.stock) {
    uiStore.showNotification('warning', `Only ${item.product.stock} items available`)
    return
  }

  await updateItem(itemId, quantity)
  if (item?.productId) await syncScopedServiceQuantities()
}

const handleQuantityInput = async (itemId: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const quantity = parseInt(target.value, 10)
  
  if (isNaN(quantity) || quantity < 1) {
    // Reset to current quantity
    const item = cart.value?.items.find(i => i.id === itemId)
    if (item) {
      target.value = item.quantity.toString()
    }
    return
  }
  
  await handleUpdateQuantity(itemId, quantity)
}

const handleRemoveItem = async (itemId: string) => {
  const item = cart.value?.items.find(i => i.id === itemId)
  await removeItem(itemId)
  if (item?.productId) await syncScopedServiceQuantities()
}

const handleClearCart = async () => {
  if (!showClearConfirm.value) {
    showClearConfirm.value = true
    // Auto-reset confirmation after 5 seconds
    setTimeout(() => {
      if (showClearConfirm.value) {
        showClearConfirm.value = false
      }
    }, 5000)
    return
  }
  
  showClearConfirm.value = false
  await clearCart()
}

const handleCalculateCart = async () => {
  await calculateCart()
}

const handleCouponApplied = (coupon: Coupon, discount: number) => {
  couponDiscount.value = discount
  uiStore.showNotification('success', `Coupon "${coupon.code}" applied successfully!`)
}

const handleCouponRemoved = () => {
  couponDiscount.value = 0
  uiStore.showNotification('info', 'Coupon removed')
}
</script>

