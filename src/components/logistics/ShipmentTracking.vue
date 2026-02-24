<template>
  <div class="space-y-6">
    <div class="card p-6">
      <h2 class="text-xl font-bold mb-4">Track Shipment</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
          <Input
            v-model="trackingParams.orderId"
            type="text"
            placeholder="Enter order ID"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
          <Input
            v-model="trackingParams.trackingNumber"
            type="text"
            placeholder="Enter tracking number or AWB"
          />
        </div>
      </div>

      <Button
        @click="trackShipment"
        variant="primary"
        :loading="isLoading"
        :disabled="!trackingParams.orderId && !trackingParams.trackingNumber"
      >
        Track
      </Button>
    </div>

    <!-- Tracking Results -->
    <div v-if="trackingData" class="card p-6">
      <h3 class="text-lg font-bold mb-4">Tracking Information</h3>
      
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Tracking Number:</span>
          <span class="font-semibold">{{ trackingData.trackingNumber }}</span>
        </div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Status:</span>
          <span
            :class="getStatusClass(trackingData.status)"
            class="px-3 py-1 rounded-full text-sm font-semibold"
          >
            {{ trackingData.status }}
          </span>
        </div>
        <div v-if="trackingData.estimatedDelivery" class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Estimated Delivery:</span>
          <span class="font-semibold">{{ formatDate(trackingData.estimatedDelivery) }}</span>
        </div>
        <div v-if="trackingData.currentLocation" class="flex items-center justify-between">
          <span class="text-sm text-gray-600">Current Location:</span>
          <span class="font-semibold">
            {{ trackingData.currentLocation.city }}, {{ trackingData.currentLocation.state }}
          </span>
        </div>
      </div>

      <!-- Timeline -->
      <div v-if="trackingData.events && trackingData.events.length > 0">
        <h4 class="text-md font-semibold mb-4">Tracking Timeline</h4>
        <div class="space-y-4">
          <div
            v-for="(event, index) in trackingData.events"
            :key="index"
            class="flex items-start space-x-4"
          >
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-3 h-3 rounded-full',
                  index === 0 ? 'bg-primary-600' : 'bg-gray-300'
                ]"
              ></div>
              <div
                v-if="index < trackingData.events.length - 1"
                class="w-0.5 h-12 bg-gray-300 mt-2"
              ></div>
            </div>
            <div class="flex-1 pb-4">
              <div class="flex items-center justify-between">
                <span class="font-semibold">{{ event.status }}</span>
                <span class="text-sm text-gray-500">{{ formatDate(event.timestamp) }}</span>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ event.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="card p-6 bg-red-50">
      <p class="text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logisticsApi } from '@/api/endpoints/logistics'
import { useUIStore } from '@/stores/ui'
import { extractErrorMessage } from '@/utils/errorHandler'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import type { ShipmentTracking } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref('')
const trackingData = ref<ShipmentTracking | null>(null)
const trackingParams = ref({
  orderId: '',
  trackingNumber: '',
  providerType: ''
})

const trackShipment = async () => {
  if (!trackingParams.value.orderId && !trackingParams.value.trackingNumber) {
    uiStore.showNotification('error', 'Please enter either Order ID or Tracking Number')
    return
  }

  isLoading.value = true
  error.value = ''
  trackingData.value = null

  try {
    const response = await logisticsApi.trackShipment(trackingParams.value)
    if (response.success && response.data) {
      trackingData.value = response.data
    } else {
      error.value = response.error || 'Failed to track shipment'
      uiStore.showNotification('error', error.value)
    }
  } catch (err: any) {
    const status = err?.response?.status
    error.value = status === 404
      ? 'Shipment not found.'
      : status === 400
        ? (err?.response?.data?.error || 'Either order ID or tracking number is required.')
        : status === 403
          ? "You don't have permission to perform this action."
          : extractErrorMessage(err)
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    created: 'bg-blue-100 text-blue-800',
    ready: 'bg-yellow-100 text-yellow-800',
    picked_up: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>
