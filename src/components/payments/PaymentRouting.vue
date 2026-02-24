<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4">Route Payment</h2>
      <p class="text-gray-600 mb-6">Route a payment to a different processor based on rules</p>
      
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
            Processor <span class="text-red-500">*</span>
          </label>
          <select v-model="form.processor" class="input" required>
            <option value="">Select processor</option>
            <option value="stripe">Stripe</option>
            <option value="razorpay">Razorpay</option>
            <option value="paypal">PayPal</option>
            <option value="phonepe">PhonePe</option>
            <option value="gpay">Google Pay</option>
            <option value="paytm">Paytm</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Routing Rules (JSON - Optional)
          </label>
          <textarea
            v-model="rulesJson"
            @input="updateRules"
            class="input font-mono text-sm"
            rows="4"
            placeholder='{"condition": "value"}'
          ></textarea>
          <p class="text-gray-500 text-xs mt-1">Enter routing rules as JSON object</p>
        </div>
        
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700">{{ error }}</p>
        </div>
        
        <div v-if="result" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 font-medium mb-2">Payment routed successfully</p>
          <div class="text-sm text-green-600">
            <p><strong>Payment ID:</strong> {{ result.paymentId }}</p>
            <p><strong>Processor:</strong> {{ result.processor }}</p>
            <p><strong>Status:</strong> {{ result.status }}</p>
            <p><strong>Routed At:</strong> {{ new Date(result.routedAt).toLocaleString() }}</p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4">
          <Button type="button" variant="secondary" @click="resetForm">Reset</Button>
          <Button type="submit" variant="primary" :loading="isSubmitting">
            Route Payment
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { paymentsAdvancedApi } from '@/api/endpoints/payments-advanced'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import Button from '@/components/common/Button.vue'
import type { PaymentRoute } from '@/api/types'

const uiStore = useUIStore()
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const result = ref<PaymentRoute | null>(null)

const form = ref({
  paymentId: '',
  processor: '',
  rules: {} as any
})

const rulesJson = ref('')

const updateRules = () => {
  try {
    if (rulesJson.value.trim()) {
      form.value.rules = JSON.parse(rulesJson.value)
    } else {
      form.value.rules = {}
    }
  } catch (e) {
    // Invalid JSON, ignore
  }
}

const resetForm = () => {
  form.value = {
    paymentId: '',
    processor: '',
    rules: {}
  }
  rulesJson.value = ''
  error.value = null
  result.value = null
}

const handleSubmit = async () => {
  error.value = null
  result.value = null
  isSubmitting.value = true
  
  try {
    const response = await paymentsAdvancedApi.routePayment({
      paymentId: form.value.paymentId,
      processor: form.value.processor,
      rules: Object.keys(form.value.rules).length > 0 ? form.value.rules : undefined
    })
    
    if (response.success && response.data) {
      result.value = response.data
      uiStore.showNotification('success', 'Payment routed successfully')
      sendToTerminal('log', '[PaymentRouting] Success:', response.data)
    } else {
      error.value = response.error || 'Failed to route payment'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to route payment'
    uiStore.showNotification('error', error.value)
    sendToTerminal('error', '[PaymentRouting] Error:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

