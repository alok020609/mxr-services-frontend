<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Payment Status</h2>
      
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <LoadingSpinner size="md" />
        <span class="ml-3 text-gray-600">Loading payment status...</span>
      </div>
      
      <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
        <p class="text-red-700">{{ error }}</p>
        <Button variant="secondary" size="sm" @click="loadPayment" class="mt-2">
          Retry
        </Button>
      </div>
      
      <div v-else-if="payment" class="space-y-4">
        <!-- Payment Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p class="text-sm text-gray-600 mb-1">Amount</p>
            <p class="text-2xl font-bold text-blue-700">{{ formatPrice(payment.amount) }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p class="text-sm text-gray-600 mb-1">Status</p>
            <span 
              class="px-3 py-1 text-sm font-semibold rounded-full"
              :class="getStatusClass(payment.status)"
            >
              {{ payment.status }}
            </span>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p class="text-sm text-gray-600 mb-1">Payment Method</p>
            <p class="text-lg font-bold text-purple-700">{{ payment.method || 'N/A' }}</p>
          </div>
        </div>
        
        <!-- Payment Details -->
        <div class="border rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-3">Payment Details</h3>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-gray-600">Transaction ID</dt>
              <dd class="text-sm font-medium text-gray-900">{{ payment.transactionId || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-600">Payment Gateway</dt>
              <dd class="text-sm font-medium text-gray-900">{{ payment.gateway || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-600">Currency</dt>
              <dd class="text-sm font-medium text-gray-900">{{ payment.currency || 'USD' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-600">Date</dt>
              <dd class="text-sm font-medium text-gray-900">
                {{ payment.timestamp ? new Date(payment.timestamp).toLocaleString() : 'N/A' }}
              </dd>
            </div>
          </dl>
        </div>
        
        <!-- Retry Payment Button (if failed) -->
        <div v-if="payment.status === 'failed' || payment.status === 'FAILED'">
          <Button variant="primary" @click="$emit('retry')">
            Retry Payment
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Payment History -->
    <div v-if="history && history.length > 0" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Payment History</h2>
      
      <div class="space-y-4">
        <div
          v-for="(item, index) in history"
          :key="index"
          class="border-l-4 pl-4 py-2"
          :class="getHistoryItemClass(item.status)"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium text-gray-900">{{ item.status }}</p>
              <p v-if="item.message" class="text-sm text-gray-600 mt-1">{{ item.message }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">
                {{ item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { paymentsApi } from '@/api/endpoints/payments'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()

interface Props {
  orderId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  retry: []
}>()

const isLoading = ref(false)
const error = ref<string | null>(null)
const payment = ref<any>(null)
const history = ref<any[]>([])

const getStatusClass = (status: string) => {
  const statusLower = status.toLowerCase()
  const classes: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    success: 'bg-green-100 text-green-800',
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return classes[statusLower] || 'bg-gray-100 text-gray-800'
}

const getHistoryItemClass = (status: string) => {
  const statusLower = status.toLowerCase()
  const classes: Record<string, string> = {
    completed: 'border-green-500 bg-green-50',
    success: 'border-green-500 bg-green-50',
    paid: 'border-green-500 bg-green-50',
    pending: 'border-yellow-500 bg-yellow-50',
    processing: 'border-blue-500 bg-blue-50',
    failed: 'border-red-500 bg-red-50',
    cancelled: 'border-gray-500 bg-gray-50'
  }
  return classes[statusLower] || 'border-gray-500 bg-gray-50'
}

const loadPayment = async () => {
  if (!props.orderId) return
  
  isLoading.value = true
  error.value = null
  
  try {
    const [paymentResponse, historyResponse] = await Promise.all([
      paymentsApi.getPayment(props.orderId),
      paymentsApi.getPaymentHistory(props.orderId)
    ])
    
    if (paymentResponse.success && paymentResponse.data) {
      payment.value = paymentResponse.data
    }
    
    if (historyResponse.success && historyResponse.data) {
      history.value = Array.isArray(historyResponse.data) ? historyResponse.data : []
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load payment status'
  } finally {
    isLoading.value = false
  }
}

watch(() => props.orderId, () => {
  if (props.orderId) {
    loadPayment()
  }
}, { immediate: true })

onMounted(() => {
  if (props.orderId) {
    loadPayment()
  }
})
</script>

