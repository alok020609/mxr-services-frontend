<template>
  <div class="callback-scheduler">
    <h3 class="text-lg font-bold mb-4">Schedule a Callback</h3>
    
    <form @submit.prevent="scheduleCallback" class="space-y-4">
      <Input
        v-model="form.name"
        label="Name"
        required
        placeholder="Enter your name"
      />
      
      <Input
        v-model="form.phone"
        label="Phone Number"
        type="tel"
        required
        placeholder="Enter your phone number"
      />
      
      <Input
        v-model="form.email"
        label="Email (Optional)"
        type="email"
        placeholder="Enter your email"
      />
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
        <input
          v-model="form.preferredTime"
          type="datetime-local"
          class="input w-full"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
        <select v-model="form.reason" class="input w-full">
          <option value="">Select a reason</option>
          <option value="order_issue">Order Issue</option>
          <option value="product_question">Product Question</option>
          <option value="technical_support">Technical Support</option>
          <option value="billing">Billing</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <Input
        v-model="form.orderNumber"
        label="Order Number (Optional)"
        placeholder="If related to an order"
      />
      
      <Button
        type="submit"
        variant="primary"
        class="w-full"
        :loading="isSubmitting"
      >
        Schedule Callback
      </Button>
    </form>
    
    <div v-if="success" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-green-800 font-medium">Callback scheduled successfully!</p>
      <p class="text-sm text-green-600 mt-1">We'll call you at your preferred time.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { customerServiceEnhancedApi } from '@/api/endpoints/customer-service-enhanced'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { CallbackRequest } from '@/api/types'

const uiStore = useUIStore()
const isSubmitting = ref(false)
const success = ref(false)

const form = ref<CallbackRequest>({
  name: '',
  phone: '',
  email: '',
  preferredTime: '',
  reason: '',
  orderNumber: ''
})

const scheduleCallback = async () => {
  isSubmitting.value = true
  success.value = false
  
  try {
    const response = await customerServiceEnhancedApi.scheduleCallback(form.value)
    if (response.success) {
      success.value = true
      uiStore.showNotification('success', 'Callback scheduled successfully!')
      // Reset form
      form.value = {
        name: '',
        phone: '',
        email: '',
        preferredTime: '',
        reason: '',
        orderNumber: ''
      }
    } else {
      uiStore.showNotification('error', response.error || 'Failed to schedule callback')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to schedule callback')
  } finally {
    isSubmitting.value = false
  }
}
</script>

