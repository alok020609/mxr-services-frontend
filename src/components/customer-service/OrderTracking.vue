<template>
  <div class="order-tracking">
    <h3 class="text-lg font-bold mb-4">Track Your Order</h3>
    
    <div class="space-y-4">
      <div>
        <Input
          v-model="orderNumber"
          label="Order Number"
          placeholder="Enter order number"
          required
        />
      </div>
      
      <div>
        <Input
          v-model="email"
          type="email"
          label="Email (Optional)"
          placeholder="Enter email for verification"
        />
      </div>
      
      <Button
        variant="primary"
        @click="trackOrder"
        :loading="isLoading"
        :disabled="!orderNumber.trim()"
      >
        Track Order
      </Button>
    </div>
    
    <div v-if="trackingData" class="mt-6 card">
      <h4 class="font-semibold mb-4">Order Status: {{ trackingData.status }}</h4>
      
      <div v-if="trackingData.estimatedDelivery" class="mb-4">
        <p class="text-sm text-gray-600">Estimated Delivery:</p>
        <p class="font-semibold">{{ formatDate(trackingData.estimatedDelivery) }}</p>
      </div>
      
      <div v-if="trackingData.currentLocation" class="mb-4">
        <p class="text-sm text-gray-600">Current Location:</p>
        <p class="font-semibold">{{ trackingData.currentLocation }}</p>
      </div>
      
      <div v-if="trackingData.trackingEvents && trackingData.trackingEvents.length > 0" class="mt-4">
        <h5 class="font-semibold mb-2">Tracking History</h5>
        <div class="space-y-3">
          <div
            v-for="(event, index) in trackingData.trackingEvents"
            :key="index"
            class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
            <div class="flex-1">
              <p class="font-medium">{{ event.status }}</p>
              <p class="text-sm text-gray-600">{{ event.description }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatDate(event.date) }} - {{ event.location }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { customerServiceEnhancedApi } from '@/api/endpoints/customer-service-enhanced'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { OrderTracking } from '@/api/types'

const uiStore = useUIStore()
const orderNumber = ref('')
const email = ref('')
const isLoading = ref(false)
const trackingData = ref<OrderTracking | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const trackOrder = async () => {
  if (!orderNumber.value.trim()) return
  
  isLoading.value = true
  try {
    const response = await customerServiceEnhancedApi.trackOrder(orderNumber.value.trim(), email.value || undefined)
    if (response.success && response.data) {
      trackingData.value = response.data
    } else {
      uiStore.showNotification('error', response.error || 'Order not found')
      trackingData.value = null
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to track order')
    trackingData.value = null
  } finally {
    isLoading.value = false
  }
}
</script>

