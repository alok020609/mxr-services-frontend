<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Split Payment</h2>
      <p class="text-gray-600 mb-6">Split a payment among multiple recipients</p>
      
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
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">
              Recipients <span class="text-red-500">*</span>
            </label>
            <Button type="button" variant="secondary" size="sm" @click="addRecipient">
              + Add Recipient
            </Button>
          </div>
          
          <div v-for="(split, index) in form.splits" :key="index" class="mb-4 p-4 border rounded-lg bg-gray-50">
            <div class="flex justify-between items-start mb-2">
              <span class="text-sm font-medium text-gray-700">Recipient {{ index + 1 }}</span>
              <button
                type="button"
                @click="removeRecipient(index)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">Recipient ID</label>
                <input
                  v-model="split.recipient"
                  type="text"
                  placeholder="Recipient ID"
                  class="input text-sm"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">Amount</label>
                <input
                  v-model.number="split.amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="input text-sm"
                  @input="updatePercentage(index)"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">Percentage (%)</label>
                <input
                  v-model.number="split.percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  class="input text-sm"
                  @input="updateAmount(index)"
                />
              </div>
            </div>
          </div>
          
          <div v-if="form.splits.length === 0" class="text-center py-8 border-2 border-dashed rounded-lg">
            <p class="text-gray-500 mb-2">No recipients added</p>
            <Button type="button" variant="secondary" size="sm" @click="addRecipient">
              Add First Recipient
            </Button>
          </div>
          
          <div v-if="totalAmount > 0" class="mt-4 p-4 bg-blue-50 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-700">Total Amount:</span>
              <span class="text-lg font-bold text-blue-700">{{ formatPrice(totalAmount) }}</span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="font-medium text-gray-700">Total Percentage:</span>
              <span class="text-lg font-bold" :class="totalPercentage === 100 ? 'text-green-700' : 'text-red-700'">
                {{ totalPercentage.toFixed(2) }}%
              </span>
            </div>
            <p v-if="totalPercentage !== 100" class="text-red-600 text-sm mt-2">
              Warning: Total percentage must equal 100%
            </p>
          </div>
        </div>
        
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700">{{ error }}</p>
        </div>
        
        <div v-if="result" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 font-medium mb-2">Payment split successfully</p>
          <div class="text-sm text-green-600">
            <p><strong>Payment ID:</strong> {{ result.paymentId }}</p>
            <p><strong>Total Amount:</strong> {{ formatPrice(result.totalAmount) }}</p>
            <p><strong>Status:</strong> {{ result.status }}</p>
            <p><strong>Recipients:</strong> {{ result.splits.length }}</p>
            <p><strong>Created At:</strong> {{ new Date(result.createdAt).toLocaleString() }}</p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4">
          <Button type="button" variant="secondary" @click="resetForm">Reset</Button>
          <Button 
            type="submit" 
            variant="primary" 
            :loading="isSubmitting"
            :disabled="form.splits.length === 0 || totalPercentage !== 100"
          >
            Split Payment
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { paymentsAdvancedApi } from '@/api/endpoints/payments-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import Button from '@/components/common/Button.vue'
import type { SplitPayment as SplitPaymentType } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()

const uiStore = useUIStore()
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const result = ref<SplitPaymentType | null>(null)

const form = ref({
  paymentId: '',
  splits: [] as Array<{ recipient: string; amount: number; percentage?: number }>
})

const totalAmount = computed(() => {
  return form.value.splits.reduce((sum, split) => sum + (split.amount || 0), 0)
})

const totalPercentage = computed(() => {
  return form.value.splits.reduce((sum, split) => sum + (split.percentage || 0), 0)
})

const addRecipient = () => {
  form.value.splits.push({
    recipient: '',
    amount: 0,
    percentage: 0
  })
}

const removeRecipient = (index: number) => {
  form.value.splits.splice(index, 1)
}

const updatePercentage = (index: number) => {
  // Calculate percentage based on amount (assuming total is known)
  // This is a simplified calculation - in real scenario, you'd need the payment total
  const split = form.value.splits[index]
  if (split.amount && totalAmount.value > 0) {
    split.percentage = (split.amount / totalAmount.value) * 100
  }
}

const updateAmount = (index: number) => {
  // Calculate amount based on percentage (assuming total is known)
  // This is a simplified calculation - in real scenario, you'd need the payment total
  const split = form.value.splits[index]
  if (split.percentage && totalAmount.value > 0) {
    split.amount = (split.percentage / 100) * totalAmount.value
  }
}

const resetForm = () => {
  form.value = {
    paymentId: '',
    splits: []
  }
  error.value = null
  result.value = null
}

const handleSubmit = async () => {
  error.value = null
  result.value = null
  
  if (form.value.splits.length === 0) {
    error.value = 'Please add at least one recipient'
    return
  }
  
  if (totalPercentage.value !== 100) {
    error.value = 'Total percentage must equal 100%'
    return
  }
  
  isSubmitting.value = true
  
  try {
    const response = await paymentsAdvancedApi.splitPayment({
      paymentId: form.value.paymentId,
      splits: form.value.splits.map(s => ({
        recipient: s.recipient,
        amount: s.amount,
        percentage: s.percentage
      }))
    })
    
    if (response.success && response.data) {
      result.value = response.data
      uiStore.showNotification('success', 'Payment split successfully')
      sendToTerminal('log', '[SplitPayment] Success:', response.data)
    } else {
      error.value = response.error || 'Failed to split payment'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to split payment'
    uiStore.showNotification('error', error.value)
    sendToTerminal('error', '[SplitPayment] Error:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

