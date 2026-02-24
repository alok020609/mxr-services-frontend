<template>
  <div class="space-y-6">
    <div class="card p-6">
      <h2 class="text-xl font-bold mb-4">Shipments</h2>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Search by Order ID</label>
        <div class="flex gap-2">
          <Input
            v-model="orderIdSearch"
            type="text"
            placeholder="Enter order ID"
            @keyup.enter="searchShipments"
          />
          <Button @click="searchShipments" variant="primary">Search</Button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="shipments.length === 0" class="text-center py-12 border rounded-lg">
      <p class="text-gray-500">No shipments found</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="shipment in shipments"
        :key="shipment.id"
        class="card p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold">Shipment {{ shipment.trackingNumber }}</h3>
            <p class="text-sm text-gray-600">Order: {{ shipment.orderId }}</p>
          </div>
          <span
            :class="getStatusClass(shipment.status)"
            class="px-3 py-1 rounded-full text-sm font-semibold"
          >
            {{ shipment.status }}
          </span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p class="text-sm text-gray-600">AWB Number</p>
            <p class="font-semibold">{{ shipment.awbNumber }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Rate</p>
            <p class="font-semibold">₹{{ shipment.rate.toFixed(2) }}</p>
          </div>
          <div v-if="shipment.estimatedDelivery">
            <p class="text-sm text-gray-600">Estimated Delivery</p>
            <p class="font-semibold">{{ formatDate(shipment.estimatedDelivery) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Created</p>
            <p class="font-semibold">{{ formatDate(shipment.createdAt) }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <Button
            v-if="shipment.labelUrl"
            @click="window.open(shipment.labelUrl, '_blank')"
            variant="secondary"
            size="sm"
          >
            View Label
          </Button>
          <Button
            @click="generateLabel(shipment.id)"
            variant="secondary"
            size="sm"
            :loading="generatingLabel === shipment.id"
          >
            Generate Label
          </Button>
          <Button
            @click="schedulePickup(shipment.id)"
            variant="secondary"
            size="sm"
          >
            Schedule Pickup
          </Button>
          <Button
            v-if="shipment.status !== 'delivered' && shipment.status !== 'cancelled'"
            @click="cancelShipment(shipment.id)"
            variant="danger"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </div>
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { LogisticsShipment } from '@/api/types'

const uiStore = useUIStore()
const isLoading = ref(false)
const shipments = ref<LogisticsShipment[]>([])
const orderIdSearch = ref('')
const generatingLabel = ref<string | null>(null)

const searchShipments = async () => {
  if (!orderIdSearch.value.trim()) {
    uiStore.showNotification('error', 'Please enter an order ID')
    return
  }

  isLoading.value = true
  try {
    const response = await logisticsApi.getShipment(orderIdSearch.value.trim())
    if (response.success && response.data) {
      shipments.value = response.data
      if (shipments.value.length === 0) {
        uiStore.showNotification('info', 'No shipments found for this order')
      }
    } else {
      uiStore.showNotification('error', response.error || 'Failed to load shipments')
    }
  } catch (err: any) {
    const status = err?.response?.status
    const message = status === 404
      ? 'No shipments for this order.'
      : status === 403
        ? "You don't have permission to perform this action."
        : extractErrorMessage(err)
    uiStore.showNotification('error', message)
  } finally {
    isLoading.value = false
  }
}

const generateLabel = async (shipmentId: string) => {
  generatingLabel.value = shipmentId
  try {
    const response = await logisticsApi.generateLabel(shipmentId)
    if (response.success && response.data) {
      uiStore.showNotification('success', 'Label generated successfully')
      await searchShipments()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to generate label')
    }
  } catch (err: any) {
    const status = err?.response?.status
    const message = status === 403
      ? "You don't have permission to perform this action."
      : status === 404
        ? 'Shipment not found.'
        : extractErrorMessage(err)
    uiStore.showNotification('error', message)
  } finally {
    generatingLabel.value = null
  }
}

const schedulePickup = (shipmentId: string) => {
  // This would open a modal or navigate to pickup scheduler
  uiStore.showNotification('info', 'Pickup scheduling feature coming soon')
}

const cancelShipment = async (shipmentId: string) => {
  if (!confirm('Are you sure you want to cancel this shipment?')) {
    return
  }

  try {
    const response = await logisticsApi.cancelShipment(shipmentId, {
      reason: 'Cancelled by admin'
    })
    if (response.success) {
      uiStore.showNotification('success', 'Shipment cancelled successfully')
      await searchShipments()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to cancel shipment')
    }
  } catch (err: any) {
    const status = err?.response?.status
    const message = status === 403
      ? "You don't have permission to perform this action."
      : status === 404
        ? 'Shipment not found.'
        : status === 400
          ? (err?.response?.data?.error || 'Cannot cancel this shipment.')
          : extractErrorMessage(err)
    uiStore.showNotification('error', message)
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
