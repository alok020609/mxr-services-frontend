<template>
  <div>
    <HeaderTemp4 />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-slate-900 dark:text-white font-display">Shopping Cart</h1>

      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="!cart || cart.items.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500 mb-4 block">shopping_cart</span>
        <p class="text-slate-600 dark:text-slate-400 mb-4 text-lg">Your cart is empty</p>
        <router-link
          to="/products"
          class="inline-flex items-center gap-2 rounded-lg bg-sgPrimary px-6 py-3 text-white font-bold hover:opacity-90 transition-opacity"
        >
          <span class="material-symbols-outlined text-xl">storefront</span>
          Continue Shopping
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-sgBgDark p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-2">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Cart Items ({{ itemCount }})</h2>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="text-sm text-slate-600 dark:text-slate-400 hover:text-sgPrimary underline"
                  @click="selectAll"
                >
                  Select all
                </button>
                <button
                  type="button"
                  class="text-sm text-slate-600 dark:text-slate-400 hover:text-sgPrimary underline"
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
                <span class="material-symbols-outlined text-lg">delete_sweep</span>
                {{ showClearConfirm ? 'Confirm Clear' : 'Clear Cart' }}
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="item in cart.items"
                :key="item.id"
                class="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 last:border-b-0"
              >
                <label class="flex items-center gap-2 cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    :checked="selectedItemIds.includes(item.id)"
                    :disabled="isPreparingCheckout"
                    class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary w-4 h-4"
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
                  class="w-24 h-24 flex-shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                  title="Item"
                >
                  <span class="material-symbols-outlined text-slate-400 text-3xl">inventory_2</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-lg mb-1 truncate text-slate-900 dark:text-white">
                    {{ item.product?.name || item.service?.name || 'Item' }}
                  </h3>
                  <p v-if="item.service" class="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {{ item.service.type }}{{ item.service.category ? ` (${item.service.category.name})` : '' }}
                  </p>
                  <p class="text-slate-600 dark:text-slate-400 mb-2">{{ formatPrice(item.price) }}</p>
                  <div v-if="item.service && isScopedService(item.service)" class="flex items-center gap-2">
                    <span class="text-sm text-slate-700 dark:text-slate-300">Quantity: {{ getDerivedQtyForItem(item) }} (from cart)</span>
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <button
                      @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                      :disabled="isLoading || item.quantity <= 1"
                      class="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-900 dark:text-white"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      :value="item.quantity"
                      @change="handleQuantityInput(item.id, $event)"
                      min="1"
                      :max="item.product?.stock ?? 999"
                      class="w-16 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-slate-900 dark:text-white"
                      :disabled="isLoading"
                    />
                    <button
                      @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                      :disabled="isLoading || (item.product?.stock != null && item.quantity >= item.product.stock)"
                      class="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-900 dark:text-white"
                    >
                      +
                    </button>
                    <span v-if="item.product?.stock != null" class="text-xs text-slate-500 dark:text-slate-400 ml-2">
                      ({{ item.product.stock }} available)
                    </span>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{{ formatPrice(item.subtotal) }}</p>
                  <button
                    @click="handleRemoveItem(item.id)"
                    :disabled="isLoading"
                    class="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <span class="material-symbols-outlined text-lg">remove_shopping_cart</span>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-sgBgDark p-6 shadow-sm sticky top-24">
            <h2 class="text-xl font-bold mb-4 text-slate-900 dark:text-white">Order Summary</h2>
            <p v-if="selectedCount < itemCount" class="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {{ selectedCount }} of {{ itemCount }} items selected for checkout. Unselected items will remain in your cart.
            </p>

            <div class="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Have a coupon code?</h3>
              <CouponInput
                v-model="appliedCoupon"
                :cart-total="selectionSubtotal"
                @applied="handleCouponApplied"
                @removed="handleCouponRemoved"
              />
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal{{ selectedCount < itemCount ? ' (selected)' : '' }}</span>
                <span class="font-semibold text-slate-900 dark:text-white">{{ formatPrice(selectionSubtotal) }}</span>
              </div>
              <div class="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax</span>
                <span class="font-semibold text-slate-900 dark:text-white">{{ formatPrice(cart.tax) }}</span>
              </div>
              <div class="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span class="font-semibold text-slate-900 dark:text-white">{{ formatPrice(cart.shipping) }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="flex justify-between text-green-600 dark:text-green-400">
                <span>Coupon Discount</span>
                <span class="font-semibold">-{{ formatPrice(couponDiscount) }}</span>
              </div>
              <div v-if="cart.discount > 0" class="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount</span>
                <span class="font-semibold">-{{ formatPrice(cart.discount) }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Total</span>
                <span>{{ formatPrice(selectionSubtotal + cart.tax + cart.shipping - cart.discount - couponDiscount) }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <button
                type="button"
                @click="handleCalculateCart"
                :disabled="isLoading || isPreparingCheckout"
                class="w-full rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="material-symbols-outlined">calculate</span>
                Recalculate Totals
              </button>
              <button
                type="button"
                :disabled="isLoading || isPreparingCheckout || selectedCount === 0"
                class="w-full rounded-lg bg-sgPrimary px-4 py-3 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="handleProceedToCheckout"
              >
                <LoadingSpinner v-if="isPreparingCheckout" size="sm" />
                <span v-else class="material-symbols-outlined">shopping_bag</span>
                {{ isPreparingCheckout ? 'Preparing checkout...' : selectedCount === itemCount ? 'Proceed to Checkout' : `Proceed with selected (${selectedCount})` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="showClearConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showClearConfirm = false"
    >
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-sgBgDark shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4 text-slate-900 dark:text-white">Clear Cart?</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Are you sure you want to remove all items from your cart? This action cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showClearConfirm = false"
            class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleClearCart"
            :disabled="isLoading"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading ? 'Clearing...' : 'Clear Cart' }}
          </button>
        </div>
      </div>
    </div>

    <FooterTemp4 />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { getDerivedServiceQuantity, isScopedService } from '@/composables/useServiceQuantity'
import { useUIStore } from '@/stores/ui'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
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
    router.push({ name: 'Checkout', query: { returnTo: 'temp4' } })
    return
  }
  isPreparingCheckout.value = true
  try {
    for (const item of toRemove) {
      await removeItem(item.id)
    }
    router.push({ name: 'Checkout', query: { returnTo: 'temp4' } })
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
