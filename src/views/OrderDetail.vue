<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Order Details</h1>

      <div v-if="loadError" class="card p-6 text-center">
        <p class="text-red-600 mb-4">{{ loadError }}</p>
        <router-link to="/orders" class="btn btn-primary">Back to orders</router-link>
      </div>
      
      <div v-else-if="order" class="space-y-6">
        <div class="card">
          <div class="mb-6">
            <h2 class="text-xl font-bold mb-2">Order #{{ order.orderNumber }}</h2>
            <p class="text-gray-600">Placed on {{ new Date(order.createdAt).toLocaleDateString() }}</p>
            <div v-if="order.status || order.paymentStatus" class="mt-2 flex flex-wrap gap-2">
              <span v-if="order.status" class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
              <span v-if="order.paymentStatus" class="px-2 py-1 text-xs font-medium rounded-full" :class="getPaymentStatusClass(order.paymentStatus)">
                Payment: {{ order.paymentStatus }}
              </span>
            </div>
          </div>

          <!-- Pending payment: Complete payment or Cancel order -->
          <div
            v-if="showPendingPaymentActions"
            class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <p class="text-amber-800 mb-3">
              Payment for this order is pending. Complete payment to confirm your order, or cancel if you no longer want it.
            </p>
            <div class="flex flex-wrap gap-3">
              <Button
                variant="primary"
                :loading="paymentLoading"
                :disabled="cancelLoading"
                @click="handleCompletePayment"
              >
                Complete payment
              </Button>
              <Button
                variant="danger"
                :loading="cancelLoading"
                :disabled="paymentLoading"
                @click="handleCancelOrder"
              >
                Cancel order
              </Button>
            </div>
          </div>

          <!-- Cancel order for normal (non-pending-payment) cancellable orders -->
          <div
            v-if="isOrderCancellable && !showPendingPaymentActions"
            class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <p class="text-gray-700 mb-3">
              You can cancel this order if you no longer need it.
            </p>
            <Button
              variant="danger"
              :loading="cancelLoading"
              @click="handleCancelOrder"
            >
              Cancel order
            </Button>
          </div>
          
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4 border-b pb-4">
              <img
                v-if="item.product"
                :src="item.product?.images?.[0] || '/placeholder.jpg'"
                :alt="item.product?.name"
                class="w-20 h-20 object-cover rounded flex-shrink-0"
              />
              <img
                v-else-if="item.service"
                :src="item.service?.image || '/placeholder.jpg'"
                :alt="item.service?.name"
                class="w-20 h-20 object-cover rounded flex-shrink-0"
                @error="($event.target as HTMLImageElement).src = '/placeholder.jpg'"
              />
              <div
                v-else
                class="w-20 h-20 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center"
              >
                <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold">{{ item.product?.name ?? item.service?.name ?? 'Item' }}</h3>
                <p v-if="item.service" class="text-sm text-gray-500">
                  {{ item.service.type }}{{ item.service.category ? ` (${item.service.category.name})` : '' }}
                </p>
                <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
              </div>
              <p class="font-semibold flex-shrink-0">{{ formatPrice(item.subtotal ?? item.total ?? item.price * item.quantity) }}</p>
            </div>
          </div>
          
          <div class="mt-6 pt-6 border-t">
            <div class="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Order Enhancements Tabs -->
        <div class="card">
          <div class="border-b mb-6">
            <div class="flex space-x-1 overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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

    <Footer />
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
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
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
const sidebarOpen = ref(false)
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

/** Show Complete payment / Cancel order when payment is pending and not COD. Do not show for cancelled orders. */
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

/** Order can be cancelled when not in a terminal state (cancelled, shipped, delivered, refunded). */
const isOrderCancellable = computed(() => {
  const o = order.value
  if (!o) return false
  const status = (o.status || '').toLowerCase()
  const nonCancellable = ['cancelled', 'shipped', 'delivered', 'refunded']
  return !nonCancellable.includes(status)
})

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    CREATED: 'bg-yellow-100 text-yellow-800',
    PAYMENT_PENDING: 'bg-amber-100 text-amber-800',
    PAID: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return classes[status] ?? 'bg-gray-100 text-gray-800'
}

function getPaymentStatusClass(paymentStatus: string) {
  const classes: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return classes[paymentStatus] ?? 'bg-gray-100 text-gray-800'
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

