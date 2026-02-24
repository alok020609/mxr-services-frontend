<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Create Payment Link</h2>
      <p class="text-gray-600 mb-6">Create a shareable payment link for invoices or orders</p>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Order ID (Optional)
          </label>
          <input
            v-model="form.orderId"
            type="text"
            placeholder="Enter order ID if applicable"
            class="input"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Amount <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            class="input"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            v-model="form.description"
            class="input"
            rows="3"
            placeholder="Payment description..."
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Expiration Date (Optional)
          </label>
          <input
            v-model="form.expiresAt"
            type="datetime-local"
            class="input"
          />
        </div>
        
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700">{{ error }}</p>
        </div>
        
        <div class="flex justify-end space-x-4">
          <Button type="button" variant="secondary" @click="resetForm">Reset</Button>
          <Button type="submit" variant="primary" :loading="isSubmitting">
            Create Link
          </Button>
        </div>
      </form>
    </div>
    
    <!-- Created Link Display -->
    <div v-if="createdLink" class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold mb-4">Payment Link Created</h3>
      
      <div class="space-y-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Link</label>
          <div class="flex items-center space-x-2">
            <input
              :value="createdLink.link"
              readonly
              class="input flex-1 font-mono text-sm"
            />
            <Button variant="secondary" size="sm" @click="copyLink">
              {{ copied ? 'Copied!' : 'Copy' }}
            </Button>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-600">Amount</p>
            <p class="font-medium">{{ formatPrice(createdLink.amount) }}</p>
          </div>
          <div>
            <p class="text-gray-600">Status</p>
            <span 
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="getStatusClass(createdLink.status)"
            >
              {{ createdLink.status }}
            </span>
          </div>
          <div v-if="createdLink.expiresAt">
            <p class="text-gray-600">Expires</p>
            <p class="font-medium">{{ new Date(createdLink.expiresAt).toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-gray-600">Created</p>
            <p class="font-medium">{{ new Date(createdLink.createdAt).toLocaleString() }}</p>
          </div>
        </div>
        
        <div class="flex justify-end">
          <Button variant="secondary" @click="resetForm">Create Another Link</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { paymentsAdvancedApi } from '@/api/endpoints/payments-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import Button from '@/components/common/Button.vue'
import type { PaymentLink } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()

const uiStore = useUIStore()
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const createdLink = ref<PaymentLink | null>(null)
const copied = ref(false)

const form = ref({
  orderId: '',
  amount: 0,
  description: '',
  expiresAt: ''
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    used: 'bg-gray-100 text-gray-800'
  }
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const copyLink = async () => {
  if (createdLink.value?.link) {
    try {
      await navigator.clipboard.writeText(createdLink.value.link)
      copied.value = true
      uiStore.showNotification('success', 'Link copied to clipboard')
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (err) {
      uiStore.showNotification('error', 'Failed to copy link')
    }
  }
}

const resetForm = () => {
  form.value = {
    orderId: '',
    amount: 0,
    description: '',
    expiresAt: ''
  }
  error.value = null
  createdLink.value = null
  copied.value = false
}

const handleSubmit = async () => {
  error.value = null
  createdLink.value = null
  isSubmitting.value = true
  
  try {
    const response = await paymentsAdvancedApi.createPaymentLink({
      orderId: form.value.orderId || undefined,
      amount: form.value.amount,
      description: form.value.description || undefined,
      expiresAt: form.value.expiresAt || undefined
    })
    
    if (response.success && response.data) {
      createdLink.value = response.data
      uiStore.showNotification('success', 'Payment link created successfully')
      sendToTerminal('log', '[PaymentLinkCreator] Success:', response.data)
    } else {
      error.value = response.error || 'Failed to create payment link'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to create payment link'
    uiStore.showNotification('error', error.value)
    sendToTerminal('error', '[PaymentLinkCreator] Error:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

