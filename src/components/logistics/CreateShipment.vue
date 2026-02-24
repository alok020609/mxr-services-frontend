<template>
  <div class="card p-6">
    <h2 class="text-xl font-bold mb-4">Create Shipment</h2>

    <form @submit.prevent="createShipment" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Order ID *</label>
        <Input
          v-model="formData.orderId"
          type="text"
          placeholder="order_123"
          required
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Pickup Address -->
        <div class="space-y-4">
          <h3 class="font-semibold">Pickup Address</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input v-model="formData.pickup.name" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <Input v-model="formData.pickup.address" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <Input v-model="formData.pickup.city" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <Input v-model="formData.pickup.state" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <Input v-model="formData.pickup.pincode" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <Input v-model="formData.pickup.phone" type="tel" required />
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="space-y-4">
          <h3 class="font-semibold">Delivery Address</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input v-model="formData.delivery.name" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <Input v-model="formData.delivery.address" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <Input v-model="formData.delivery.city" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <Input v-model="formData.delivery.state" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <Input v-model="formData.delivery.pincode" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <Input v-model="formData.delivery.phone" type="tel" required />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
          <Input
            v-model.number="formData.weight"
            type="number"
            step="0.1"
            min="0"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">COD Amount</label>
          <Input
            v-model.number="formData.codAmount"
            type="number"
            min="0"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            v-model="formData.paymentMethod"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select method</option>
            <option value="COD">COD</option>
            <option value="PREPAID">Prepaid</option>
          </select>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Dimensions (cm)</h3>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Length</label>
            <Input
              v-model.number="formData.dimensions.length"
              type="number"
              min="0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <Input
              v-model.number="formData.dimensions.width"
              type="number"
              min="0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <Input
              v-model.number="formData.dimensions.height"
              type="number"
              min="0"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <Button type="button" variant="secondary" @click="resetForm">Reset</Button>
        <Button type="submit" variant="primary" :loading="isSubmitting">
          Create Shipment
        </Button>
      </div>
    </form>

    <div v-if="createdShipment" class="mt-6 p-4 bg-green-50 rounded-lg">
      <h3 class="font-semibold text-green-800 mb-2">Shipment Created Successfully!</h3>
      <div class="space-y-1 text-sm text-green-700">
        <p><strong>Tracking Number:</strong> {{ createdShipment.trackingNumber }}</p>
        <p><strong>AWB Number:</strong> {{ createdShipment.awbNumber }}</p>
        <p v-if="createdShipment.labelUrl">
          <a :href="createdShipment.labelUrl" target="_blank" class="text-blue-600 underline">
            View Label
          </a>
        </p>
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
import type { CreateShipmentRequest, LogisticsShipment } from '@/api/types'

const uiStore = useUIStore()
const isSubmitting = ref(false)
const createdShipment = ref<LogisticsShipment | null>(null)

const formData = ref<CreateShipmentRequest>({
  orderId: '',
  pickup: {
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  },
  delivery: {
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  },
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  },
  codAmount: 0,
  paymentMethod: ''
})

const createShipment = async () => {
  isSubmitting.value = true
  createdShipment.value = null

  try {
    const request: CreateShipmentRequest = {
      ...formData.value,
      dimensions: formData.value.dimensions.length > 0 ? formData.value.dimensions : undefined,
      codAmount: formData.value.codAmount > 0 ? formData.value.codAmount : undefined,
      paymentMethod: formData.value.paymentMethod || undefined
    }

    const response = await logisticsApi.createShipment(request)
    if (response.success && response.data) {
      createdShipment.value = response.data
      uiStore.showNotification('success', 'Shipment created successfully')
      resetForm()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to create shipment')
    }
  } catch (err: any) {
    const status = err?.response?.status
    const message = status === 403
      ? "You don't have permission to perform this action."
      : status === 400
        ? (err?.response?.data?.error || 'Invalid request. Please check your input.')
        : extractErrorMessage(err)
    uiStore.showNotification('error', message)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    orderId: '',
    pickup: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    },
    delivery: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    },
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    codAmount: 0,
    paymentMethod: ''
  }
  createdShipment.value = null
}
</script>
