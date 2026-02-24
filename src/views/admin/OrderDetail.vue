<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <router-link to="/admin/orders" class="text-gray-600 hover:text-gray-800">
            ← Back to Orders
          </router-link>
          <h1 class="text-3xl font-bold">Order Details</h1>
        </div>
        <div class="flex items-center space-x-4" v-if="order">
          <Button 
            v-if="order.status !== 'cancelled'"
            @click="cancelOrder"
            variant="danger"
          >
            Cancel Order
          </Button>
          <Button 
            v-if="order.status === 'delivered' && order.paymentStatus === 'paid'"
            @click="showRefundModal = true"
            variant="secondary"
          >
            Refund Order
          </Button>
        </div>
      </div>

      <!-- Order actions bar -->
      <div v-if="order" class="flex flex-wrap items-center gap-3 py-3 border-b border-gray-200">
        <Button variant="secondary" size="sm" @click="openPaymentModal">
          Payment details
        </Button>
        <Button variant="secondary" size="sm" @click="openTrackingModal">
          Tracking / Shipments
        </Button>
        <span class="text-gray-400">|</span>
        <a href="#order-summary" class="text-sm text-primary-600 hover:underline">Summary</a>
        <a href="#order-items" class="text-sm text-primary-600 hover:underline">Items</a>
        <a href="#order-totals" class="text-sm text-primary-600 hover:underline">Totals</a>
        <a href="#order-addresses" class="text-sm text-primary-600 hover:underline">Addresses</a>
        <a href="#order-notes" class="text-sm text-primary-600 hover:underline">Notes</a>
        <a href="#order-state" class="text-sm text-primary-600 hover:underline">State</a>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="loadOrder" variant="primary">Retry</Button>
      </div>

      <div v-else-if="!order" class="text-center py-12">
        <p class="text-gray-600 mb-4">Order not found.</p>
        <router-link to="/admin/orders">
          <Button variant="primary">Back to Orders</Button>
        </router-link>
      </div>
      
      <div v-else class="max-w-6xl space-y-6">
        <!-- Order Summary -->
        <div id="order-summary" class="card">
          <h2 class="text-xl font-bold mb-4">Order Summary</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600">Order Number</label>
              <p class="font-semibold">{{ order.orderNumber }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Status</label>
              <p class="font-semibold">
                <select
                  :value="order.status || ''"
                  @change="updateStatus(($event.target as HTMLSelectElement).value)"
                  :class="getStatusClass(order.status)"
                  class="px-2 py-1 rounded text-xs border-0 cursor-pointer"
                >
                  <option value="">—</option>
                  <option value="created">Created</option>
                  <option value="payment_pending">Payment Pending</option>
                  <option value="paid">Paid</option>
                  <option value="packed">Packed</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Payment Status</label>
              <p class="font-semibold">
                <span :class="(order.paymentStatus || 'pending') === 'paid' ? 'text-green-600' : 'text-red-600'">
                  {{ order.paymentStatus || 'pending' }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Payment Method</label>
              <p class="font-semibold">{{ order.paymentMethod ? order.paymentMethod : 'Not set' }}</p>
              <p v-if="!order.paymentMethod" class="text-xs text-gray-500 mt-0.5">Shown when the API returns paymentMethod on the order or in payments. For COD, backend may need to persist it from create or add a payment record.</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Total Amount</label>
              <p class="font-semibold text-lg">{{ formatPrice(order.total) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Created At</label>
              <p class="font-semibold">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Updated At</label>
              <p class="font-semibold">{{ formatDate(order.updatedAt) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Order Items -->
        <div id="order-items" class="card">
          <h2 class="text-xl font-bold mb-4">Order Items</h2>
          <div v-if="order.items && order.items.length > 0" class="space-y-4">
            <div
              v-for="(item, index) in order.items"
              :key="index"
              class="flex justify-between items-center border-b pb-4 gap-4"
            >
              <img
                v-if="item.product"
                :src="item.product?.images?.[0] || '/placeholder.jpg'"
                :alt="item.product?.name"
                class="w-12 h-12 object-cover rounded flex-shrink-0"
                @error="($event.target as HTMLImageElement).src = '/placeholder.jpg'"
              />
              <img
                v-else-if="item.service"
                :src="item.service?.image || '/placeholder.jpg'"
                :alt="item.service?.name"
                class="w-12 h-12 object-cover rounded flex-shrink-0"
                @error="($event.target as HTMLImageElement).src = '/placeholder.jpg'"
              />
              <img
                v-else
                src="/placeholder.jpg"
                alt="Item"
                class="w-12 h-12 object-cover rounded flex-shrink-0"
                @error="($event.target as HTMLImageElement).src = '/placeholder.jpg'"
              />
              <div class="flex-1 min-w-0">
                <p class="font-semibold">{{ item.product?.name || item.service?.name || item.name || item.productName || 'Item' }}</p>
                <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                <p class="text-sm text-gray-600" v-if="item.product?.sku || item.sku">SKU: {{ item.product?.sku || item.sku }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">{{ formatPrice(item.price || 0) }}</p>
                <p class="text-sm text-gray-600">Total: {{ formatPrice((item.price || 0) * (item.quantity || 1)) }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No items found</p>
        </div>
        
        <!-- Order Totals -->
        <div id="order-totals" class="card">
          <h2 class="text-xl font-bold mb-4">Order Totals</h2>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span>{{ formatPrice(order.subtotal || 0) }}</span>
            </div>
            <div class="flex justify-between" v-if="order.tax">
              <span>Tax:</span>
              <span>{{ formatPrice(order.tax) }}</span>
            </div>
            <div class="flex justify-between" v-if="order.shipping">
              <span>Shipping:</span>
              <span>{{ formatPrice(order.shipping) }}</span>
            </div>
            <div class="flex justify-between" v-if="order.discount">
              <span>Discount:</span>
              <span class="text-red-600">-{{ formatPrice(order.discount) }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total:</span>
              <span>{{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Shipping Address -->
        <div id="order-addresses" class="card" v-if="order.shippingAddress">
          <h2 class="text-xl font-bold mb-4">Shipping Address</h2>
          <div class="text-gray-700">
            <p>{{ order.shippingAddress.street || '' }}</p>
            <p>{{ order.shippingAddress.city || '' }}, {{ order.shippingAddress.state || '' }} {{ order.shippingAddress.zipCode || order.shippingAddress.zip || '' }}</p>
            <p>{{ order.shippingAddress.country || '' }}</p>
          </div>
        </div>
        
        <!-- Billing Address -->
        <div class="card" v-if="order.billingAddress">
          <h2 class="text-xl font-bold mb-4">Billing Address</h2>
          <div class="text-gray-700">
            <p>{{ order.billingAddress.street || '' }}</p>
            <p>{{ order.billingAddress.city || '' }}, {{ order.billingAddress.state || '' }} {{ order.billingAddress.zipCode || order.billingAddress.zip || '' }}</p>
            <p>{{ order.billingAddress.country || '' }}</p>
          </div>
        </div>

        <!-- Order Notes -->
        <div id="order-notes" class="card">
          <OrderNotes :order-id="order.id" @note-added="loadOrder" @note-updated="loadOrder" @note-deleted="loadOrder" />
        </div>

        <!-- Task Assignment -->
        <div class="card">
          <OrderTaskAssignment :order-id="order.id" @task-assigned="loadOrder" />
        </div>
      </div>
      
      <!-- Refund Modal -->
      <div
        v-if="showRefundModal && order"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showRefundModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">Refund Order</h2>
          <p class="mb-4">Order Total: {{ formatPrice(order.total) }}</p>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Refund Amount (leave empty for full refund)</label>
            <input
              v-model.number="refundAmount"
              type="number"
              :max="order.total"
              :min="0"
              step="0.01"
              class="input"
              placeholder="Full refund"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Reason <span class="text-red-500">*</span></label>
            <textarea
              v-model="refundReason"
              rows="3"
              class="input w-full"
              placeholder="Enter reason for refund..."
              required
            />
          </div>
          <div class="flex justify-end space-x-4">
            <Button variant="secondary" @click="showRefundModal = false">Cancel</Button>
            <Button
              variant="primary"
              @click="processRefund"
              :loading="isProcessing"
              :disabled="!refundReason.trim()"
            >
              Process Refund
            </Button>
          </div>
        </div>
      </div>

      <!-- Payment details modal -->
      <div
        v-if="showPaymentModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showPaymentModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
          <h2 class="text-xl font-bold mb-4">Payment details</h2>
          <div v-if="paymentLoading" class="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
          <div v-else-if="paymentError" class="text-red-600 py-4">{{ paymentError }}</div>
          <div v-else class="space-y-4">
            <div v-if="paymentData" class="rounded border p-4 space-y-2 text-sm">
              <p><span class="font-medium text-gray-600">Status:</span> {{ paymentData.status ?? '—' }}</p>
              <p><span class="font-medium text-gray-600">Method:</span> {{ paymentData.method ?? paymentData.paymentMethod ?? '—' }}</p>
              <p v-if="paymentData.amount != null"><span class="font-medium text-gray-600">Amount:</span> {{ formatPrice(paymentData.amount) }}</p>
              <p v-if="paymentData.gatewayReference"><span class="font-medium text-gray-600">Gateway ref:</span> {{ paymentData.gatewayReference }}</p>
            </div>
            <div v-else class="text-gray-500">No payment data for this order.</div>
            <div v-if="paymentHistory && paymentHistory.length">
              <h3 class="font-semibold mb-2">History</h3>
              <ul class="space-y-1 text-sm">
                <li v-for="(entry, i) in paymentHistory" :key="i" class="flex justify-between border-b pb-1">
                  <span>{{ formatDate(entry.createdAt || entry.date) }} — {{ entry.status ?? entry.type ?? '—' }}</span>
                  <span v-if="entry.amount != null">{{ formatPrice(entry.amount) }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <Button variant="secondary" @click="showPaymentModal = false">Close</Button>
          </div>
        </div>
      </div>

      <!-- Tracking / Shipments modal -->
      <div
        v-if="showTrackingModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showTrackingModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
          <h2 class="text-xl font-bold mb-4">Tracking / Shipments</h2>
          <div v-if="trackingLoading" class="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
          <div v-else-if="trackingError" class="text-red-600 py-4">{{ trackingError }}</div>
          <div v-else-if="shipments && shipments.length" class="space-y-4">
            <div
              v-for="(s, i) in shipments"
              :key="s.id || i"
              class="rounded border p-4 text-sm space-y-2"
            >
              <p><span class="font-medium text-gray-600">Tracking:</span> {{ s.trackingNumber ?? s.awbNumber ?? '—' }}</p>
              <p><span class="font-medium text-gray-600">Status:</span> {{ s.status ?? '—' }}</p>
              <p v-if="s.estimatedDelivery"><span class="font-medium text-gray-600">Est. delivery:</span> {{ formatDate(s.estimatedDelivery) }}</p>
              <a v-if="s.labelUrl" :href="s.labelUrl" target="_blank" rel="noopener" class="text-primary-600 hover:underline">Download label</a>
            </div>
          </div>
          <div v-else class="text-gray-500">No shipments for this order.</div>
          <div class="mt-4 flex justify-end">
            <Button variant="secondary" @click="showTrackingModal = false">Close</Button>
          </div>
        </div>
      </div>
      
      <!-- Order State Management -->
      <div id="order-state" v-if="order" class="card mt-6">
        <h2 class="text-xl font-bold mb-4">Order State Management</h2>
        <OrderStateManager :order-id="order.id" :current-state="order.status" @state-changed="loadOrder" />
        <div class="mt-6">
          <OrderStateHistory :order-id="order.id" />
        </div>
        <!-- State history from API (when order load includes stateHistory) -->
        <div v-if="order.stateHistory?.length" class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-semibold mb-3">State history (from order)</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="text-left text-gray-600 border-b border-gray-200">
                  <th class="py-2 pr-4">From</th>
                  <th class="py-2 pr-4">To</th>
                  <th class="py-2 pr-4">Performed by</th>
                  <th class="py-2 pr-4">Date</th>
                  <th class="py-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="entry in order.stateHistory"
                  :key="entry.id || (entry.fromState + entry.toState + entry.createdAt)"
                  class="border-b border-gray-100"
                >
                  <td class="py-2 pr-4">{{ entry.fromState ?? '—' }}</td>
                  <td class="py-2 pr-4">{{ entry.toState ?? '—' }}</td>
                  <td class="py-2 pr-4">{{ formatStateHistoryUser(entry.user) }}</td>
                  <td class="py-2 pr-4">{{ entry.createdAt ? formatDate(entry.createdAt) : '—' }}</td>
                  <td class="py-2">{{ entry.reason ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminApi } from '@/api/endpoints/admin'
import { paymentsApi } from '@/api/endpoints/payments'
import { logisticsApi } from '@/api/endpoints/logistics'
import { useUIStore } from '@/stores/ui'
import { normalizeOrder } from '@/utils/dataNormalizer'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import { extractErrorMessage } from '@/utils/errorHandler'

const { formatPrice } = usePriceFormatter()
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import OrderNotes from '@/components/admin/OrderNotes.vue'
import OrderTaskAssignment from '@/components/admin/OrderTaskAssignment.vue'
import OrderStateManager from '@/components/orders/OrderStateManager.vue'
import OrderStateHistory from '@/components/orders/OrderStateHistory.vue'
import type { Order, OrderStateHistoryEntry } from '@/api/types'

const route = useRoute()
const router = useRouter()
const uiStore = useUIStore()
const orderId = route.params.id as string

const isLoading = ref(false)
const isProcessing = ref(false)
const order = ref<Order | null>(null)
const error = ref<string | null>(null)
const showRefundModal = ref(false)
const refundAmount = ref<number | null>(null)
const refundReason = ref('')
const showPaymentModal = ref(false)
const showTrackingModal = ref(false)
const paymentData = ref<Record<string, any> | null>(null)
const paymentHistory = ref<any[]>([])
const paymentLoading = ref(false)
const paymentError = ref<string | null>(null)
const shipments = ref<any[]>([])
const trackingLoading = ref(false)
const trackingError = ref<string | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStateHistoryUser = (user: OrderStateHistoryEntry['user']) => {
  if (!user) return '—'
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return name || user.email || '—'
}

const openPaymentModal = () => {
  showPaymentModal.value = true
  paymentData.value = null
  paymentHistory.value = []
  paymentError.value = null
  if (order.value?.id) loadPaymentDetails()
}

const loadPaymentDetails = async () => {
  if (!order.value?.id) return
  paymentLoading.value = true
  paymentError.value = null
  try {
    const [payRes, histRes] = await Promise.all([
      paymentsApi.getPayment(order.value.id),
      paymentsApi.getPaymentHistory(order.value.id)
    ])
    const pay = payRes as { success?: boolean; data?: any }
    const hist = histRes as { success?: boolean; data?: any[] }
    paymentData.value = pay.success && pay.data != null ? pay.data : null
    paymentHistory.value = (hist.success && Array.isArray(hist.data) ? hist.data : []) as any[]
  } catch (err: any) {
    paymentError.value = err?.message ?? String(err)
  } finally {
    paymentLoading.value = false
  }
}

const openTrackingModal = () => {
  showTrackingModal.value = true
  shipments.value = []
  trackingError.value = null
  if (order.value?.id) loadTracking()
}

const loadTracking = async () => {
  if (!order.value?.id) return
  trackingLoading.value = true
  trackingError.value = null
  try {
    const res = await logisticsApi.getShipment(order.value.id) as { success?: boolean; data?: any[] }
    shipments.value = res.success && Array.isArray(res.data) ? res.data : []
  } catch (err: any) {
    const status = err?.response?.status
    trackingError.value = status === 404
      ? 'No shipments for this order.'
      : extractErrorMessage(err)
  } finally {
    trackingLoading.value = false
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    created: 'bg-gray-100 text-gray-800',
    payment_pending: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    packed: 'bg-indigo-100 text-indigo-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
    returned: 'bg-orange-100 text-orange-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const loadOrder = async () => {
  if (!orderId) {
    error.value = 'Invalid order ID'
    return
  }
  isLoading.value = true
  error.value = null
  order.value = null

  try {
    const response = await adminApi.getOrder(orderId)
    const res = response as { success?: boolean; data?: { order?: unknown; status?: string; [k: string]: unknown }; order?: unknown; id?: string; orderNumber?: string }
    const raw = res.data ?? res.order ?? (res.success && (res.id ?? res.orderNumber) ? res : null)
    const orderPayload = raw && typeof raw === 'object' && 'order' in raw && raw.order != null ? raw.order : raw

    if (response.success && orderPayload) {
      order.value = normalizeOrder(orderPayload)
    } else {
      error.value = (response as { error?: string }).error || 'Order not found'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = extractErrorMessage(err)
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const updateStatus = async (newStatus: string) => {
  if (!order.value) return
  
  try {
    const response = await adminApi.updateOrderStatus(order.value.id, newStatus)
    if (response.success) {
      uiStore.showNotification('success', 'Order status updated successfully')
      await loadOrder()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to update order status')
    }
  } catch (err: any) {
    uiStore.showNotification('error', extractErrorMessage(err))
  }
}

const cancelOrder = async () => {
  if (!order.value) return
  if (!confirm('Are you sure you want to cancel this order?')) return
  
  try {
    const response = await adminApi.cancelOrder(order.value.id)
    if (response.success) {
      uiStore.showNotification('success', 'Order cancelled successfully')
      await loadOrder()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to cancel order')
    }
  } catch (err: any) {
    uiStore.showNotification('error', extractErrorMessage(err))
  }
}

const processRefund = async () => {
  if (!order.value || !refundReason.value.trim()) return
  
  isProcessing.value = true
  try {
    const amount = refundAmount.value ?? order.value.total
    const response = await adminApi.refundOrder(order.value.id, amount, refundReason.value.trim())
    if (response.success) {
      uiStore.showNotification('success', `Refund of ${formatPrice(amount)} processed successfully`)
      showRefundModal.value = false
      refundAmount.value = null
      refundReason.value = ''
      await loadOrder()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to process refund')
    }
  } catch (err: any) {
    uiStore.showNotification('error', extractErrorMessage(err))
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  loadOrder()
})
</script>

