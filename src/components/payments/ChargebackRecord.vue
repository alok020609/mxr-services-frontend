<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Record Chargeback</h2>
      <p class="text-gray-600 mb-6">Record a chargeback for a payment</p>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Payment ID <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.paymentId"
            type="text"
            placeholder="Enter payment ID"
            class="input"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Reason <span class="text-red-500">*</span>
          </label>
          <select v-model="form.reason" class="input" required>
            <option value="">Select reason</option>
            <option value="fraud">Fraud</option>
            <option value="unauthorized">Unauthorized Transaction</option>
            <option value="duplicate">Duplicate Charge</option>
            <option value="product_not_received">Product Not Received</option>
            <option value="product_unacceptable">Product Unacceptable</option>
            <option value="subscription_cancelled">Subscription Cancelled</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Amount (Optional)
          </label>
          <input
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            class="input"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            v-model="form.notes"
            class="input"
            rows="4"
            placeholder="Additional notes about the chargeback..."
          ></textarea>
        </div>
        
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700">{{ error }}</p>
        </div>
        
        <div v-if="result" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 font-medium mb-2">Chargeback recorded successfully</p>
          <div class="text-sm text-green-600">
            <p><strong>Chargeback ID:</strong> {{ result.id }}</p>
            <p><strong>Payment ID:</strong> {{ result.paymentId }}</p>
            <p><strong>Reason:</strong> {{ result.reason }}</p>
            <p v-if="result.amount"><strong>Amount:</strong> {{ formatPrice(result.amount) }}</p>
            <p><strong>Status:</strong> {{ result.status }}</p>
            <p><strong>Created At:</strong> {{ new Date(result.createdAt).toLocaleString() }}</p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4">
          <Button type="button" variant="secondary" @click="resetForm">Reset</Button>
          <Button type="submit" variant="primary" :loading="isSubmitting">
            Record Chargeback
          </Button>
        </div>
      </form>
    </div>
    
    <!-- Chargeback History -->
    <div v-if="history.length > 0" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Recent Chargebacks</h2>
      <DataTable
        :columns="historyColumns"
        :data="history"
        :actions="false"
        row-key="id"
      >
        <template #cell-amount="{ row }">
          <span v-if="row.amount" class="font-medium">{{ formatPrice(row.amount) }}</span>
          <span v-else class="text-gray-400">-</span>
        </template>
        <template #cell-status="{ row }">
          <span 
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(row.status)"
          >
            {{ row.status }}
          </span>
        </template>
        <template #cell-createdAt="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { paymentsAdvancedApi } from '@/api/endpoints/payments-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import DataTable from '@/components/admin/DataTable.vue'
import Button from '@/components/common/Button.vue'
import type { Chargeback } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()

const uiStore = useUIStore()
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const result = ref<Chargeback | null>(null)
const history = ref<Chargeback[]>([])

const form = ref({
  paymentId: '',
  reason: '',
  amount: undefined as number | undefined,
  notes: ''
})

const historyColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'paymentId', label: 'Payment ID', sortable: true },
  { key: 'reason', label: 'Reason', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    disputed: 'bg-red-100 text-red-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const resetForm = () => {
  form.value = {
    paymentId: '',
    reason: '',
    amount: undefined,
    notes: ''
  }
  error.value = null
  result.value = null
}

const handleSubmit = async () => {
  error.value = null
  result.value = null
  isSubmitting.value = true
  
  try {
    const response = await paymentsAdvancedApi.recordChargeback(form.value.paymentId, {
      reason: form.value.reason,
      amount: form.value.amount,
      notes: form.value.notes || undefined
    })
    
    if (response.success && response.data) {
      result.value = response.data
      uiStore.showNotification('success', 'Chargeback recorded successfully')
      sendToTerminal('log', '[ChargebackRecord] Success:', response.data)
      // Add to history
      history.value.unshift(response.data)
      // Keep only last 10
      if (history.value.length > 10) {
        history.value = history.value.slice(0, 10)
      }
      resetForm()
    } else {
      error.value = response.error || 'Failed to record chargeback'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to record chargeback'
    uiStore.showNotification('error', error.value)
    sendToTerminal('error', '[ChargebackRecord] Error:', err)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // In a real app, you'd load chargeback history from an API
  // For now, we'll just initialize an empty array
  history.value = []
})
</script>

