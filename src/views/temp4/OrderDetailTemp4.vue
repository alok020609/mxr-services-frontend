<template>
  <div>
    <HeaderTemp4 />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-slate-900 dark:text-white font-display">Order Details</h1>

      <div v-if="loadError" class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-sgBgDark p-6 text-center">
        <p class="text-red-600 dark:text-red-400 mb-4">{{ loadError }}</p>
        <router-link
          to="/orders"
          class="inline-flex items-center gap-2 rounded-lg bg-sgPrimary px-4 py-2 text-white font-bold hover:opacity-90 transition-opacity"
        >
          Back to orders
        </router-link>
      </div>

      <div v-else-if="order" class="space-y-6">
        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-sgBgDark p-6 shadow-sm">
          <div class="mb-6">
            <h2 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">Order #{{ order.orderNumber }}</h2>
            <p class="text-slate-600 dark:text-slate-400">Placed on {{ new Date(order.createdAt).toLocaleDateString() }}</p>
            <div v-if="order.status || order.paymentStatus" class="mt-2 flex flex-wrap gap-2">
              <span v-if="order.status" class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
              <span v-if="order.paymentStatus" class="px-2 py-1 text-xs font-medium rounded-full" :class="getPaymentStatusClass(order.paymentStatus)">
                Payment: {{ order.paymentStatus }}
              </span>
            </div>
          </div>

          <div
            v-if="showPendingPaymentActions"
            class="mb-6 p-4 rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20"
          >
            <p class="text-amber-800 dark:text-amber-200 mb-3">
              Payment for this order is pending. Complete payment to confirm your order, or cancel if you no longer want it.
            </p>
            <div class="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                :loading="paymentLoading"
                :disabled="cancelLoading"
                @click="handleCompletePayment"
              >
                Complete payment
              </Button>
              <Button
                variant="danger"
                size="sm"
                :loading="cancelLoading"
                :disabled="paymentLoading"
                @click="handleCancelOrder"
              >
                Cancel order
              </Button>
            </div>
          </div>

          <div
            v-if="isOrderCancellable && !showPendingPaymentActions"
            class="mb-6 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          >
            <p class="text-slate-700 dark:text-slate-300 mb-3">
              You can cancel this order if you no longer need it.
            </p>
            <Button
              variant="danger"
              size="sm"
              :loading="cancelLoading"
              @click="handleCancelOrder"
            >
              Cancel order
            </Button>
          </div>

          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id" class="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <img
                v-if="item.product"
                :src="item.product?.images?.[0] || '/placeholder.png'"
                :alt="item.product?.name"
                class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <img
                v-else-if="item.service"
                :src="item.service?.image || '/placeholder.png'"
                :alt="item.service?.name"
                class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                @error="($event.target as HTMLImageElement).src = '/placeholder.png'"
              />
              <div
                v-else
                class="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-slate-400 text-2xl">inventory_2</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-slate-900 dark:text-white">{{ item.product?.name ?? item.service?.name ?? 'Item' }}</h3>
                <p v-if="item.service" class="text-sm text-slate-500 dark:text-slate-400">
                  {{ item.service.type }}{{ item.service.category ? ` (${item.service.category.name})` : '' }}
                </p>
                <p class="text-slate-600 dark:text-slate-400">Quantity: {{ item.quantity }}</p>
              </div>
              <p class="font-semibold flex-shrink-0 text-slate-900 dark:text-white">{{ formatPrice(item.subtotal ?? item.total ?? item.price * item.quantity) }}</p>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div class="flex justify-between font-bold text-lg text-slate-900 dark:text-white">
              <span>Total</span>
              <span>{{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-sgBgDark p-6 shadow-sm">
          <div class="border-b border-slate-200 dark:border-slate-800 mb-6">
            <div class="flex space-x-1 overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-sgPrimary text-sgPrimary'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                ]"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'notes'">
            <OrderNotes :order-id="order.id" />
          </div>

          <div v-if="activeTab === 'delivery'">
            <ScheduledDelivery :order-id="order.id" />
          </div>

          <div v-if="activeTab === 'splits'">
            <OrderSplits :order-id="order.id" />
          </div>
        </div>
      </div>
    </main>

    <FooterTemp4 />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ordersApi } from '@/api/endpoints/orders'
import { paymentsApi } from '@/api/endpoints/payments'
import { submitPaymentRedirectForm } from '@/utils/paymentRedirect'
import { normalizeOrder } from '@/utils/dataNormalizer'
import { extractErrorMessage } from '@/utils/errorHandler'
import { useUIStore } from '@/stores/ui'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
import Toast from '@/components/common/Toast.vue'
import Button from '@/components/common/Button.vue'
import OrderNotes from '@/components/orders/OrderNotes.vue'
import ScheduledDelivery from '@/components/orders/ScheduledDelivery.vue'
import OrderSplits from '@/components/orders/OrderSplits.vue'
import type { Order } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()
const route = useRoute()
const uiStore = useUIStore()
const order = ref<Order | null>(null)
const loadError = ref<string | null>(null)
const activeTab = ref<'notes' | 'delivery' | 'splits'>('notes')
const paymentLoading = ref(false)
const cancelLoading = ref(false)

const tabs = [
  { id: 'notes', label: 'Notes' },
  { id: 'delivery', label: 'Scheduled Delivery' },
  { id: 'splits', label: 'Order Splits' }
]

const showPendingPaymentActions = computed(() => {
  const o = order.value
  if (!o) return false
  const status = (o.status || '').toUpperCase().replace(/-/g, '_')
  if (status === 'CANCELLED') return false
  const paymentStatus = (o.paymentStatus || '').toLowerCase()
  const isPaymentPending =
    paymentStatus === 'pending' ||
    status === 'PAYMENT_PENDING' ||
    status === 'CREATED'
  if (!isPaymentPending) return false
  const method = (o.paymentMethod || '').toLowerCase()
  return method !== 'cod'
})

const isOrderCancellable = computed(() => {
  const o = order.value
  if (!o) return false
  const status = (o.status || '').toLowerCase()
  const nonCancellable = ['cancelled', 'shipped', 'delivered', 'refunded']
  return !nonCancellable.includes(status)
})

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    CREATED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    PAYMENT_PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
  }
  return classes[status] ?? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
}

function getPaymentStatusClass(paymentStatus: string) {
  const classes: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
  }
  return classes[paymentStatus] ?? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
}

async function loadOrder() {
  const orderId = route.params.id as string
  if (!orderId) return
  loadError.value = null
  try {
    const response = await ordersApi.getOrder(orderId)
    if (response.success && response.data) {
      order.value = normalizeOrder(response.data)
    } else {
      loadError.value = (response as { error?: string }).error || 'Order not found'
      uiStore.showNotification('error', loadError.value)
    }
  } catch (err) {
    loadError.value = extractErrorMessage(err as Error)
    uiStore.showNotification('error', loadError.value)
  }
}

async function handleCompletePayment() {
  const o = order.value
  if (!o || !showPendingPaymentActions.value) return
  paymentLoading.value = true
  try {
    const gatewayType = (o.paymentMethod || '').toUpperCase()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const intentRes = await paymentsApi.createIntent(o.id, gatewayType, {
      successRedirectUrl: `${origin}/order/success`,
      failureRedirectUrl: `${origin}/order/failure`
    })
    if (!intentRes.success || !intentRes.data) {
      uiStore.showNotification('error', intentRes.error || 'Could not start payment.')
      return
    }
    const data = intentRes.data
    if (data.redirectUrl && data.formData && Object.keys(data.formData).length > 0) {
      submitPaymentRedirectForm(data.redirectUrl, data.formData)
      return
    }
    uiStore.showNotification('info', 'Payment link generated. Complete payment in the next step.')
  } catch (err) {
    uiStore.showNotification('error', extractErrorMessage(err as Error))
  } finally {
    paymentLoading.value = false
  }
}

async function handleCancelOrder() {
  const o = order.value
  if (!o || !isOrderCancellable.value) return
  if (!confirm('Are you sure you want to cancel this order? You can place a new order later.')) return
  cancelLoading.value = true
  try {
    const response = await ordersApi.cancelOrder(o.id)
    if (response.success) {
      uiStore.showNotification('success', 'Order cancelled.')
      await loadOrder()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to cancel order.')
    }
  } catch (err) {
    uiStore.showNotification('error', extractErrorMessage(err as Error))
  } finally {
    cancelLoading.value = false
  }
}

onMounted(() => {
  loadOrder()
})
</script>
